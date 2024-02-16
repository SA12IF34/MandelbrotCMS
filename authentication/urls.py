from django.urls import path
from .views import *

urlpatterns = [
    path('jwt/login/', TokenObtainPairViewChan.as_view()),
    path('jwt/refresh-token/', TokenRefreshAPI.as_view()),
    path('jwt/signup/', SignUpJWTAPI.as_view()),
    path('register/', RegisterAPI.as_view()),
    path('authenticate/', AuthenticationAPI.as_view()),
    path('profile/', ProfileAPI.as_view()),
    path('logout/',LogOutAPI.as_view()),
    path('close-account/', CloseAPI.as_view())
]