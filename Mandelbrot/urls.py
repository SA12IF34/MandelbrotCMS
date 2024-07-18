from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('authentication/apis/', include('authentication.urls')),

    path('sessions_manager/', include('sessions_manager.urls')),
    path('learning_tracker/', include('learning_tracker.urls')),
    path('entertainment/', include('entertainment.urls')),
    path('tasks/', include('tasks.urls')),
    path('goals/', include('goals.urls')),
    path('notes/', include('notes.urls')),

    path('home/', cms_home),
    path('', home_page),
    path('saifchan/', include('saifapp.urls')),

    re_path(r'^mediafiles/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT})
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 

CMS_REACT_ROUTES = [
    'all-missions',
    'missions/<int:id>',
    'missions/<int:id>/edit',
    'create-missions-list',
    'sign-up',
    'log-in',
    'profile'
]


for route in CMS_REACT_ROUTES:
    if route == 'log-in' or route == 'sign-up':
        urlpatterns.append(path(f'{route}/', account_page))  
    
    else:
        urlpatterns.append(path(f'{route}/', cms_home)) 
        

