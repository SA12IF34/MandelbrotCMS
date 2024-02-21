from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('authentication/apis/', include('authentication.urls')),
    path('sessions_manager/', include('sessions_manager.urls')),
    path('learning_tracker/', include('learning_tracker.urls')),
    path('entertainment/', include('entertainment.urls')),
    path('tasks/', include('tasks.urls')),
    path('goals/', include('goals.urls')),

    path('home/', cms_home),
    path('', home_page)

]

CMS_REACT_ROUTES = [
    'all-missions',
    'missions/<int:id>',
    'missions/<int:id>/edit',
    'create-missions-list',
    'sign-up',
    'log-in',
    'profile'
]

WEBSITE_REACT_ROUTES = [
    'skills',
    'about',
    'contact',
    'mandelbrotCMS'
]

for route in CMS_REACT_ROUTES:
    if route == 'log-in' or route == 'sign-up':
        urlpatterns.append(path(f'{route}/', account_page))  
    
    else:
        urlpatterns.append(path(f'{route}/', cms_home)) 
        

for route in WEBSITE_REACT_ROUTES:
    urlpatterns.append(path(f'{route}/', TemplateView.as_view(template_name='website-home/dist/index.html')))