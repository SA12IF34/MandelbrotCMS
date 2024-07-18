from django.shortcuts import render, redirect
from django.urls import path, re_path
from .views import NotesViewSet


def page(request, id=None):

    if request.user.is_authenticated:
        return render(request=request, template_name='notes/dist/index.html')
    
    return redirect('/')
 
urlpatterns = [
    path('apis/create/', NotesViewSet.as_view({'post': 'create'})),
    path('apis/get/', NotesViewSet.as_view({'get': 'list'})),
    path('apis/get/<int:pk>/', NotesViewSet.as_view({'get':'retrieve'})),
    path('apis/update/<int:pk>/', NotesViewSet.as_view({'get':'retrieve', 'patch': 'partial_update'})),
    path('apis/delete/<int:pk>/', NotesViewSet.as_view({'get':'retrieve', 'delete': 'destroy'})),

    path('', page)
]

REACT_ROUTES = [
    'create-note/',
    'notes/<int:id>/'
]

for route in REACT_ROUTES:
    urlpatterns.append(path(route, page))