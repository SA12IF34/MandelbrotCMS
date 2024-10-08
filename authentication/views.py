from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import *

from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from rest_framework.authentication import SessionAuthentication

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView

import requests

from django.conf import settings


# Social Authentication

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

class GitHubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter


@api_view(['POST'])
@permission_classes([AllowAny])
def get_github_access_token(request):
    try:
        response = requests.post('https://github.com/login/oauth/access_token', {
            'client_id': settings.GITHUB_CLIENT_ID,
            'client_secret': settings.GITHUB_CLIENT_SECRET,
            'code': request.data['code']
        })

        if (response.text.startswith('error')):
            return Response(status=HTTP_400_BAD_REQUEST)
        
        else:
            access_token = response.text.split('&')[0].split('=')[1]

            return Response(data={'access_token': access_token}, status=HTTP_200_OK)
        
    except:
        return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)


# JWT Authentication

class TokenObtainPairSerializerChan(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username

        return token
    
class TokenObtainPairViewChan(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializerChan

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == HTTP_200_OK:
            refresh_token = response.data.get('refresh', None)
            access_token = response.data.get('access', None)

            if refresh_token and access_token:
                # Set cookies in the response
                response.set_cookie('refresh_token', refresh_token)  
                response.set_cookie('access_token', access_token)  

        return response

class TokenRefreshAPI(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == HTTP_200_OK:
            refresh_token = response.data.get('refresh', None)
            access_token = response.data.get('access', None)

            if refresh_token and access_token:
                # Set cookies in the original response
                response.set_cookie('refresh_token', refresh_token)  
                response.set_cookie('access_token', access_token)  

        return response

def authenticateJWT(user):
    refresh = RefreshToken.for_user(user)
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }


class SignUpJWTAPI(APIView):

    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        if not User.objects.filter(email=request.data['email']).exists():
            try:
                user = User.objects.create_user(username=request.data['username'].lower(), email=request.data['email'], password=request.data['password'])

                auth_creds = authenticateJWT(user)

                response = Response(data=auth_creds, status=HTTP_201_CREATED)
                response.set_cookie('access_token',auth_creds['access'], samesite=None, secure=True, httponly=False)
                response.set_cookie('refresh_token',auth_creds['refresh'], samesite=None, secure=True, httponly=False)

                return response

            except:
                return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
        
        else:
            return Response(status=HTTP_306_RESERVED)
        

# Session Based Authentication

class RegisterAPI(APIView): 

    permission_classes = [AllowAny]
    authentication_classes = [SessionAuthentication]
    
    def post(self, request):
        data = request.data

        if not User.objects.filter(email=data['email']).exists():
            user = User.objects.create_user(
                username=data['username'].lower(), 
                email=data['email'], 
                password=data['password']
            )
   
            login(request, user)
                            
            return Response(status=HTTP_201_CREATED)
                    
        else :

            return Response(data={"response": "email"}, status=HTTP_306_RESERVED)
        
class AuthenticationAPI(APIView):

    permission_classes = [AllowAny]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        data = request.data

        if User.objects.filter(email=data['email']).exists():
            user = authenticate(username=data['username'].lower(), email=data['email'], password=data['password'])

            if user is not None:
                login(request, user)

                return Response(status=HTTP_202_ACCEPTED)

        return Response(data={"response": "user not found"}, status=HTTP_404_NOT_FOUND)


class ProfileAPI(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response(data={'username': user.username.capitalize(), 'email': user.email}, status=HTTP_200_OK)

class LogOutAPI(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        logout(request=request)

        return Response(status=HTTP_202_ACCEPTED)

class CloseAPI(APIView):

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        user = request.user
        logout(request)
        user.delete() 

        return Response(status=HTTP_204_NO_CONTENT)