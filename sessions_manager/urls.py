from django.urls import path
from django.shortcuts import render, redirect
from .views import *

REACT_ROUTES = [
    'completed',
    'in-progress',
    'new-project',
    'projects/<int:id>'
]

def page(request, id=None):

    if request.user.is_authenticated:
        return render(request=request, template_name='sessions-manager/dist/index.html')
    
    return redirect('/')

urlpatterns = [
    # Pages
    path('', page),
    
    # APIs
    path('apis/projects/', ProjectsAPI.as_view()),
    path('apis/projects/filter-category/', project_filter_category),
    path('apis/projects/<int:pk>/', ProjectAPI.as_view()),
    path('apis/projects/<int:pk>/create-partition/', PartitionsAPI.as_view()),
    path('apis/partitions/<int:pk>/', PartitionAPI.as_view())
]


for route in REACT_ROUTES:
    urlpatterns.append(path(f'{route}/', page)) 