from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.status import *
from .models import *
from .serializers import *

from datetime import datetime

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def get_task_containers(request):
    
    try:
        user = request.user.id
        containers = TasksContainer.objects.filter(user=user).order_by('-id')
        containers_serializer = ContainerSerializer(instance=containers, many=True)

        return Response(data=containers_serializer.data, status=HTTP_200_OK)
    
    except:
        return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def get_today_tasks(request, date):
    
    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        user = request.user.id
        container = TasksContainer.objects.get(user=user, date=date_obj)
        tasks = container.task_set.all()
        container_serializer = ContainerSerializer(instance=container)
        tasks_serializer = TaskSerializer(instance=tasks, many=True)

        data = container_serializer.data
        data['tasks'] = tasks_serializer.data

        return Response(data=data, status=HTTP_200_OK)
    
    except TasksContainer.DoesNotExist:
        return Response(status=HTTP_204_NO_CONTENT)

    except:
        return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def get_tasks(request, pk):
    
    try:
        container = TasksContainer.objects.get(id=pk)
        tasks = container.task_set.all()
        container_serializer = ContainerSerializer(instance=container)
        tasks_serializer = TaskSerializer(instance=tasks, many=True)

        data = container_serializer.data
        data['tasks'] = tasks_serializer.data

        return Response(data=data, status=HTTP_200_OK) 
    
    except TasksContainer.DoesNotExist:
        return Response(status=HTTP_404_NOT_FOUND)

    except:
        return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)    


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([SessionAuthentication, JWTAuthentication])
# def get_reminders(request):

#     # try:
#     user = request.user.id
#     reminders = Reminder.objects.filter(user=user).order_by('-id')
#     serializer = ReminderSerializer(instance=reminders, many=True)
        
#     return Response(data=serializer.data, status=HTTP_200_OK)

#     # except:
#     #     return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([SessionAuthentication, JWTAuthentication])
# def get_reminder(request, pk):
#     try:
#         reminder = Reminder.objects.get(id=pk)
#         serializer = ReminderSerializer(instance=reminder)

#         return Response(data=serializer.data, status=200)

#     except:
#         return Response(status=500);

def add_container(tasks, container_id):

    for task in tasks:
        task['container'] = container_id

    return tasks

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def post_task_list(request):
    
    try:
        user = request.user.id
        tasks_data = request.data['tasks']
        container_data = request.data['container']        

        container_data['user'] = user

        container_serializer = ContainerSerializer(data=container_data)
            
        if container_serializer.is_valid(raise_exception=True):
            container_serializer.save()

            tasks_data = add_container(tasks_data, container_serializer.data['id'])

            tasks_serializer = TaskSerializer(data=tasks_data, many=True)

            try:
                if tasks_serializer.is_valid(raise_exception=True):
                    tasks_serializer.save()
                    return Response(data=container_serializer.data, status=HTTP_201_CREATED)
            
            except serializers.ValidationError:
                print(tasks_serializer.errors)
                return Response(data={'valid_error': 'tasks'},status=HTTP_400_BAD_REQUEST)
    
    except serializers.ValidationError:
        return Response(data={'valid_error': 'container'}, status=HTTP_400_BAD_REQUEST)
            
    except:
        return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([SessionAuthentication, JWTAuthentication])
# def post_reminder(request):
    
#     try: 
#         user = request.user.id
#         data = request.data
#         data['user'] = user

#         serializer = ReminderSerializer(data=data)

#         if serializer.is_valid(raise_exception=True):
#             serializer.save()


#             return Response(data=serializer.data, status=HTTP_201_CREATED)
        
#     except serializers.ValidationError:
#         return Response(status=HTTP_400_BAD_REQUEST)
    
#     except:
#         return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication, SessionAuthentication])
def update_task(request, pk):

    try:
        task = Task.objects.get(id=pk)
        serializer = TaskSerializer(instance=task, data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):
            serializer.save()

            tasks_container = TasksContainer.objects.get(id=serializer.data['container'])
            all_tasks = tasks_container.task_set.all()
            done_tasks = Task.objects.filter(container=tasks_container.id, done=True)

            if done_tasks.count() == all_tasks.count():
                container_serializer = ContainerSerializer(instance=tasks_container, data={"done": True}, partial=True)

                if container_serializer.is_valid():
                    container_serializer.save()

                    return Response(status=HTTP_200_OK)

            return Response(status=HTTP_202_ACCEPTED)
    
    except serializers.ValidationError:
        return Response(status=HTTP_400_BAD_REQUEST)
    
    except:
        return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def delete_task(request, pk):

    try:
        user = request.user.id

        task = Task.objects.get(id=pk, user=user)
        task.delete()

        return Response(status=HTTP_204_NO_CONTENT)

    except:
        return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def delete_task_container(request, pk):

    try:
        user = request.user.id
        container = TasksContainer.objects.get(id=pk, user=user)
        container.delete()

        return Response(status=HTTP_204_NO_CONTENT)

    except:
        return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
# @authentication_classes([SessionAuthentication, JWTAuthentication])
# def delete_reminder(request, pk):

#     try:
#         reminder = Reminder.objects.get(id=pk)
#         reminder.delete()

#         return Response(status=HTTP_204_NO_CONTENT)

#     except:
#         return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
    

