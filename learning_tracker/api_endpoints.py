from django.urls import path
from .views import *


urlpatterns = [
    path('materials/', MaterialsAPI.as_view()),
    path('materials/<int:pk>/', MaterialAPI.as_view()),
    path('sections/<int:pk>/', SectionAPI.as_view()),
    path('material-data/', get_material_data)
]