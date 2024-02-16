from django.urls import path
from django.shortcuts import render, redirect
from .views import *

REACT_ROUTES = [
    '<int:id>',
    'new'
]

def page(request, id=None):

    if request.user.is_authenticated:
        return render(request=request, template_name='goals/dist/index.html')
    
    return redirect('/')

urlpatterns = [
    path('', page),

    path('apis/goals/', GoalsAPI.as_view()),
    path('apis/goals/<int:pk>/', GoalAPI.as_view()),
    path('apis/goals/progress/<int:pk>/', get_goal_progress)
]

for route in REACT_ROUTES:
    urlpatterns.append(path(f'{route}/', page)) 