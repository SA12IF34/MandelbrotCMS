import requests
from bs4 import BeautifulSoup
from googleapiclient.discovery import build
from django.conf import settings

# Text Summarization API to create courses descriptions
import requests

def summarize_text(text):
    try:
        url = "https://api.ai21.com/studio/v1/summarize"

        payload = {
            "sourceType": "TEXT",
            "source": text
        }
        headers_s = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": "Bearer "+ settings.ENV('SUMMARIZATION_KEY')
        }

        response = requests.post(url, json=payload, headers=headers_s)
        summarization = response.json()['summary']

        return summarization

    except:
        return None



# Coursera Scraping Function

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
}

def coursera(url):

    """
        Scrapes coursera courses.
    """

    if not ('specializations'in url) and not ('professional-certificates' in url):
        page = requests.get(url, headers=headers).text
        doc = BeautifulSoup(page, 'html.parser')

        # Get Course Name
        course_title = doc.find('h1', {'data-e2e': 'hero-title'}).text

        # Get Course Description
        description_container = doc.find('div', {'data-track-component': 'what_you_will_learn_section'})
        description_list = ""
        
        if description_container is not None:
            description_element_list = description_container.find_all('span')
            

            for ele in description_element_list:
                description = ele.find('span')
                if description is not None:
                    description = description.text
                    if type(description) == str and len(description) > 0:
                        description_list += f" {description}"


        description = summarize_text(description_list)

        # Get Course Sections
        section_elements = doc.find_all('div', {'data-testid': 'accordion-item'})
        section_title_list = []

        for ele in section_elements:
            title = ele.find('h3')
            if title is not None:
                title = title.text
                if type(title) == str and len(title) > 0:
                    section_title_list.append({'name':title})
    
        # Get Course Image
        course_name = ''
        if '?' in url:
            url = url.split('?')[0]

        if url.split('/')[-1] == '':
            course_name = url.split('/')[-2]
        else:
            course_name = url.split('/')[-1]

        base_url = 'https://www.coursera.org'
        href = doc.find('h3', string='Offered by').parent.parent.find('a')['href']

        page2 = requests.get(base_url+href, headers=headers).text
        doc2 = BeautifulSoup(page2, 'html.parser')
        
        image_src = "https://" + doc2.find('a', {'href': '/learn/'+course_name}).find('img')['src'].split("https://")[-1].split("?")[0]

        # Return Course Data
        return {
            "name": course_title,
            "description": description,
            "image": image_src
        }, section_title_list
    else:
        return -1



# Youtube Scraping Functions

api_key = settings.ENV('YOUTUBE_API_KEY')
youtube_api = build('youtube', 'v3', developerKey=api_key)

def video_scrape(video_id):

    """
        Get's Youtube's videos content using youtube api.
    """

    # Request video details using the video ID
    request = youtube_api.videos().list(part='snippet', id=video_id)
    response = request.execute()

    # Extract information from the API response
    if 'items' in response and len(response['items']) > 0:
        video_info = response['items'][0]['snippet']
        
        video_title = video_info['title']
        video_description_content = video_info['description']
        thumbnails = response['items'][0]['snippet']['thumbnails']
        thumbnail_url = thumbnails.get('maxres', thumbnails.get('high', thumbnails['default'])).get('url')

        video_description = summarize_text(video_description_content)
        
        if video_description == -1:
            video_description = video_description_content

        return {
            "name": video_title,
            "description": video_description,
            "image": thumbnail_url
        }, []
    else:
        print('Video not found or API request failed.')


def playlist_scrape(playlist_id):

    """
        Gets Youtube's playlists content using youtube api.
    """

    playlist_request = youtube_api.playlistItems().list(
        part='snippet',
        playlistId=playlist_id,
        maxResults=1000  # Adjust the number of results as needed
    )

    playlist_response = playlist_request.execute()
    # Extract information from the API response

    playlist_info = playlist_response['items'][0]['snippet']
    
    playlist_title = playlist_info['title']
    playlist_description = playlist_info['description']
    thumbnails = playlist_response['items'][0]['snippet']['thumbnails']
    thumbnail_url = thumbnails.get('high', thumbnails['default']).get('url')
    videos = []

    for item in playlist_response['items']:
        video_title = item['snippet']['title']
        
        videos.append({"name": video_title})

    playlist_description = summarize_text(playlist_description)

    return {
        "name": playlist_title,
        "description": playlist_description,
        "image": thumbnail_url
    }, videos


def youtube(url):
    
    if "watch" not in url and "playlist" not in url:
        video_id = url.split("?")[0].split("/")[-1]
        return video_scrape(video_id=video_id)
    
    if "watch" in url:
        video_id = url.split("v=")[-1].split("&")[0]
        return video_scrape(video_id=video_id)
        
    
    elif "playlist" in url and "watch" not in url:
        playlist_id = url.split("list=")[-1].split("&")[0]
        return playlist_scrape(playlist_id=playlist_id)

