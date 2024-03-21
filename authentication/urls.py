from django.urls import path, include
from .views import *

urlpatterns = [
    path('jwt/login/', TokenObtainPairViewChan.as_view()),
    path('jwt/refresh-token/', TokenRefreshAPI.as_view()),
    path('jwt/signup/', SignUpJWTAPI.as_view()),

    path('register/', RegisterAPI.as_view()),
    path('authenticate/', AuthenticationAPI.as_view()),
    
    path('rest-auth/', include('dj_rest_auth.urls')),
    path('rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    path('rest-auth/google/', GoogleLogin.as_view()),
    path('rest-auth/github/', GitHubLogin.as_view()),
    path('rest-auth/access_token/github/', get_github_access_token),

    path('profile/', ProfileAPI.as_view()),
    path('logout/',LogOutAPI.as_view()),
    path('close-account/', CloseAPI.as_view())
]