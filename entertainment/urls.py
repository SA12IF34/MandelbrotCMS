from django.urls import path, include
from django.shortcuts import render, redirect

REACT_ROUTES = [
    'materials/<int:id>',
    'add-material',
    'special'
]

def page(request, id=None):

    if request.user.is_authenticated:
        return render(request=request, template_name='entertainment/dist/index.html')

    return redirect('/')

urlpatterns = [
    path('', page),
    
    # api routes
    path('apis/', include('entertainment.api_endpoints'))
]


for route in REACT_ROUTES:
    urlpatterns.append(path(f'{route}/', page))