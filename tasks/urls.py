from django.urls import path
from .views import *
 

urlpatterns = [
    path('apis/get-containers/', get_task_containers),
    path('apis/today-tasks/<str:date>/', get_today_tasks),
    path('apis/get-tasks/<int:pk>/', get_tasks),
    path('apis/get-tasks/<int:pk>/<str:sequance>/', get_sequance_list),
    # path('apis/get-reminders/', get_reminders),
    # path('apis/get-reminder/<int:pk>/', get_reminder),
    path('apis/new-task-list/', post_task_list),
    # path('apis/new-reminder/', post_reminder),
    path('apis/update-task/<int:pk>/', update_task),
    path('apis/delete-task/<int:pk>/', delete_task),
    path('apis/delete-container/<int:pk>/', delete_task_container),
    # path('apis/delete-reminder/<int:pk>/', delete_reminder)
]