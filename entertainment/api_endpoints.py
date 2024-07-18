from django.urls import path
from .views import *


urlpatterns = [
    path('materials/', MaterialsAPI.as_view()),
    path('materials/url/', post_material_by_url),
    path('materials/<int:pk>/', MaterialAPI.as_view()),
    path('materials/special/', get_special),
    path('materials/search/', search)
]