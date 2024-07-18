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

    id = url.split('/')[-2]
    
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
    }
    }
    '''

    # Define our query variables and values that will be used in the query request
    variables = {
        'id': id
    }

    url = 'https://graphql.anilist.co'

    # Make the HTTP Api request
    response = requests.post(url, json={'query': query, 'variables': variables})

    data = response.json()['data']['Media']

    return {
        'name': data['title']['romaji'],
        'description': data['description'],
        'image': data['coverImage']['large']
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

def get_mal(url): # Get's anime's data from Myanimelist's API.
    if url.endswith('/'):
        url = list(url)
        url[-1] = ''
        url = ''.join(url)


    url_list = url.split('/')

    if url_list[-1].isdigit():
        id = url_list[-1]
    else:
        id = url.split('/')[-2]

    access_token, refresh_token = read_json()
    if access_token is None or refresh_token is None:
        return
    
    client_id = settings.ENV('MAL_CLIENT_ID')
    client_secret = settings.ENV('MAL_CLIENT_SECRET')
    
    
    response = requests.get(f'https://api.myanimelist.net/v2/anime/{id}?fields=title,main_picture,synopsis', headers={
        'Authorization': 'Bearer '+access_token
    })
    
    data = response.json()

    if response.status_code == 401:
        update_tokens(client_id, client_secret, refresh_token)
        return get_mal(url)

    update_tokens(client_id, client_secret, refresh_token)    

    return {
        'name': data['title'],
        'description': data['synopsis'],
        'image': data['main_picture']['medium']
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
        materials = EntertainmentMaterial.objects.filter(user=user, special=True, type=type).order_by('-id') 
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
            materials = EntertainmentMaterial.objects.filter(Q(status='current') | Q(status='later'), user=user, name__contains=search_query)
            serializer = EntertainmentSerializer(instance=materials, many=True)

            return Response(data=serializer.data, status=HTTP_200_OK)

        for s in status:
            for type in types:
                materials = EntertainmentMaterial.objects.filter(user=user, type=type, status=s).order_by('-id') 
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

    materials = EntertainmentMaterial.objects.filter(user=user, **search_query)
    serializer = EntertainmentSerializer(instance=materials, many=True)

    return Response(data=serializer.data, status=HTTP_200_OK)
    
