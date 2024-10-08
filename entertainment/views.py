from rest_framework.views import APIView
from rest_framework.status import *
from rest_framework.response import Response 
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import permission_classes, api_view, authentication_classes
from rest_framework.request import Request
from django.db.models import Q
from .models import *
from .serializers import *

from notes.utils import get_obj_notes

import requests
from bs4 import BeautifulSoup
from itertools import islice
import json
import os 

from django.conf import settings

def get_steam(url): # Scrapes game data from Steam.

    page = requests.get(url).text

    doc = BeautifulSoup(page, 'html.parser')

    class_name = 'apphub_AppName'

    name = doc.find('div', class_=class_name).string

    descriptions = doc.find('div', class_='game_area_description').strings
    description = next(islice(descriptions,2, 3)).strip()
    
    image = doc.find('img', class_='game_header_image_full').attrs.get('src')

    return {
        'name': name,
        'description': description,
        'image': image
    }

def get_anilist(url): # Get's anime's data from Anilist's API.
    if url.endswith('/'):
        url = list(url)
        url[-1] = ''
        url = ''.join(url)

    id_ = url.split('/')[-2]
    
    query = '''
    query ($id: Int) { # Define which variables will be used in the query (id)
    Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
        id
        title {
        romaji
        }
        description
        coverImage {
        large
        }
        genres
    }
    }
    '''

    # Define our query variables and values that will be used in the query request
    variables = {
        'id': id_
    }

    url = 'https://graphql.anilist.co'

    # Make the HTTP Api request
    response = requests.post(url, json={'query': query, 'variables': variables})

    data = response.json()['data']['Media']
    genres = [x.lower() for x in data['genres'] if x.lower() in genre_names]
    # genres = list(map(lambda y: y.lower(), filter(lambda x: x.lower() in genre_names, data['genres'])))

    return {
        'name': data['title']['romaji'],
        'description': data['description'],
        'image': data['coverImage']['large'],
        'genres': genres
    }


def read_json():
    try:
       with open(os.path.join(settings.BASE_DIR, 'entertainment/tokens.json'), 'r') as f:
           data = json.load(f)
           access_token = data.get('access_token')
           refresh_token = data.get('refresh_token')
           return access_token, refresh_token

    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error reading or parsing tokens.json: {e}")
        return None, None

def write_json(data):

    with open(os.path.join(settings.BASE_DIR, 'entertainment/tokens.json'), 'w') as f:
        json.dump(data, f, indent=2)

    print('wrote json')
    return

genre_names = ['action', 'adventure', 'ai', 'arts', 'cars', 'comedy', 'dementia',
    'demons', 'drama', 'ecchi', 'fantasy', 'sci-fi', 'game', 'harem',
    'hentai', 'historical', 'horror', 'josei', 'kids', 'life', 'magic',
    'martial', 'mecha', 'military', 'music', 'mystery', 'parody',
    'police', 'power', 'psychological', 'romance', 'samurai', 'school',
    'seinen', 'shoujo', 'shounen', 'slice', 'space', 'sports',
    'super', 'supernatural', 'thriller', 'vampire', 'yaoi', 'yuri']


def get_mal(url): # Get's anime's data from Myanimelist's API.
    # print(url) 
    if url.endswith('/'):
        url = list(url)
        url[-1] = ''
        url = ''.join(url)


    url_list = url.split('/')

    if url_list[-1].isdigit():
        id_ = url_list[-1]
    else:
        id_ = url.split('/')[-2]

    access_token, refresh_token = read_json()
    if access_token is None or refresh_token is None:
        return
    
    client_id = settings.ENV('MAL_CLIENT_ID')
    client_secret = settings.ENV('MAL_CLIENT_SECRET')
    
    
    response = requests.get(f'https://api.myanimelist.net/v2/anime/{id_}?fields=title,main_picture,synopsis,genres', headers={
        'Authorization': 'Bearer '+access_token
    })
    
    if response.status_code == 401:
        update_tokens(client_id, client_secret, refresh_token)
        return get_mal(url)

    data = response.json()
    genres = [x['name'].lower() for x in data['genres'] if x['name'].lower() in genre_names]
    

    # update_tokens(client_id, client_secret, refresh_token)    


    return {
        'name': data['title'],
        'description': data['synopsis'],
        'image': data['main_picture']['medium'],
        'genres': genres
    }

def update_tokens(client_id, client_secret, refresh_token):
    new_tokens = requests.post('https://myanimelist.net/v1/oauth2/token', data={
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'refresh_token',
            'refresh_token':refresh_token
    }).json()

    write_json(new_tokens)
    return



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def post_material_by_url(request):
    user = request.user.id
        
    data = request.data

    if ('myanimelist' not in data['url']) and ('anilist' not in data['url']) and ('steam' not in data['url']):
        return Response(data={'data': 'use myanimelist, anilist or steam url.'}, status=HTTP_400_BAD_REQUEST)

    if (data['type'] == '') or (data['status'] == ''):
        return Response(data={'data': 'include type and status.'}, status=HTTP_400_BAD_REQUEST)

    if data['type'] == 'anime':
        if 'myanimelist' in data['url']:
            material_data = get_mal(data['url'])
        
        elif 'anilist' in data['url']:
            material_data = get_anilist(data['url'])
                
        else:
            return Response(status=HTTP_303_SEE_OTHER)
            
    elif data['type'] == 'game':
        if 'steam' in data['url']:
            material_data = get_steam(data['url'])

        else:
            return Response(status=HTTP_303_SEE_OTHER)
        
    data['name'] = material_data['name']
    data['description'] = material_data['description']
    data['image'] = material_data['image']
    if 'genres' in material_data.keys():
        data['genres'] = ','.join(material_data['genres'])

    data['user'] = user
    serializer = EntertainmentSerializer(data=data)

    try:
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(data={'id': serializer.data['id']},status=HTTP_201_CREATED)
    
    except serializers.ValidationError:
        return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)


# Global variable to use for organizing response data
types = ['anime', 'game', 'shows & movies', 'other']

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def get_special(request): # Queries user's special materials
    
    user = request.user.id
    data = {}

    for type in types:
        materials = EntertainmentMaterial.objects.filter(user=user, special=True, type=type).order_by('-last_update') 
        serializer = EntertainmentSerializer(instance=materials, many=True)
        data[type] = serializer.data

    return Response(data=data, status=HTTP_200_OK)


class MaterialsAPI(APIView):

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]

    def get(self, request): # Queries All user's mateirals and format them by type and status
        user = request.user.id
        data = {'current':{}, 'done':{}, 'later': {}}
        status = ['current', 'done', 'later']

        search_query = request.query_params.get('search', None)

        if search_query is not None:
            materials = EntertainmentMaterial.objects.filter(Q(status='current') | Q(status='later'), Q(name__contains=search_query) | Q(name__iexact=search_query), user=user)
            serializer = EntertainmentSerializer(instance=materials, many=True)

            return Response(data=serializer.data, status=HTTP_200_OK)

        for s in status:
            for type in types:
                materials = EntertainmentMaterial.objects.filter(user=user, type=type, status=s).order_by('-last_update') 
                serializer = EntertainmentSerializer(instance=materials, many=True)
                data[f'{s}'][f'{type}'] = serializer.data


        return Response(data=data, status=HTTP_200_OK)

    def post(self, request): # Posts new material with the data user submits
        user = request.user.id
        
        data = request.data
        
        data['user'] = user
        serializer = EntertainmentSerializer(data=data)

        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()

                return Response(data={'id': serializer.data['id']},status=HTTP_201_CREATED)
        
        except serializers.ValidationError:
            return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)

def generate_profile(material):
    if material['genres'] is not None:
        genres = ' '.join(material['genres'].split(','))
    else:
        genres = ' '.join(get_mal(material['url'])['genres'] if 'myanimelist' in material['url'] else get_anilist(material['url'])['genres'])
        m = EntertainmentMaterial.objects.get(id=material['id'])
        m.genres = ','.join(genres)
        m.save()

    return genres

def get_anime_id(anime):
    
    url = anime['url']
    url = url[:-1] if url[-1] == '/' else url

    url_list = url.split('/')

    if url_list[-1].isdigit():
        id_ = url_list[-1]
    else:
        id_ = url.split('/')[-2]
    
    if 'anilist' in url:
        # Using the API made by Proohit, https://github.com/proohit/find-my-anime
        res = requests.get(f'https://find-my-anime.dtimur.de/api?id={id_}&provider=Anilist')
        sources = res.json()[0]['sources']
        id_ = get_anime_id({'url':list(filter(lambda x: 'myanimelist' in x, sources))[0]})
    
    return int(id_)


def process_anime_recommendations(item):
    new_item = {}
    new_item['name'] = item['title']
    new_item['description'] = item['synopsis']
    new_item['image'] = item['main_picture']['medium']

    return new_item


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommend_anime(request):
    try:
        materials = EntertainmentMaterial.objects.filter(Q(status='current') | Q(status='done'), type='anime', user=request.user.id)
        serializer = EntertainmentSerializer(materials, many=True)
        # Make user profile
        profile = [p for p in map(generate_profile, serializer.data) if len(p) > 0]
        seen_animes = list(map(get_anime_id, serializer.data))
        
        # Call recommendation api
        data = {
            'profile': profile,
            'seen_animes': seen_animes
        }


        return Response(data=data, status=200)
    
    except:
        return Response(status=500)

class MaterialAPI(APIView):

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]

    def get(self, request, pk): # Queries certain material
        
        try:
            material = EntertainmentMaterial.objects.get(id=pk)
            serializer = EntertainmentSerializer(instance=material) 

            related_notes = get_obj_notes(material)

            return Response(data={'material': serializer.data, 'notes': related_notes}, status=HTTP_200_OK)
            
        except EntertainmentMaterial.DoesNotExist:  
            return Response(status=HTTP_404_NOT_FOUND)
    
    def patch(self, request, pk): # Updates certain material's data 
        data = request.data
        material = EntertainmentMaterial.objects.get(id=pk)

        serializer = EntertainmentSerializer(instance=material, data=data, partial=True)

        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()

                return Response(status=HTTP_202_ACCEPTED)
        
        except serializers.ValidationError:
            return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
        
    def delete(self, request, pk): # Deletes certian material

        material = EntertainmentMaterial.objects.get(id=pk)
        material.delete()

        return Response(status=HTTP_204_NO_CONTENT)

@api_view(['GET'])
def search(request):
    user = request.user.id
    search_query = request.query_params.dict()
    keys = request.query_params.keys()
    
    for key in keys:
        try:
            if search_query[key] == '': del search_query[key]
            if search_query[key] == 'shows': search_query[key] = 'shows & movies'
        except KeyError:
            pass

    try:
        if search_query['special'] != '':
            search_query['special'] = search_query['special'] == 'true'
    
    except KeyError:
        pass

    materials = EntertainmentMaterial.objects.filter(user=user, **search_query).order_by('-last_update')
    serializer = EntertainmentSerializer(instance=materials, many=True)

    return Response(data=serializer.data, status=HTTP_200_OK)
    
