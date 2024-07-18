from django.urls import path
from .views import *

urlpatterns = [
    path('part-links/', get_links),
    path('part-links/create/', create_link),
    path('part-links/create-many/', many_part_links)

] 