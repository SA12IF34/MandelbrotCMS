from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.status import *
from django.db.models import Q
from .models import Goal
from rest_framework import serializers
from .serializers import GoalSerializer

from learning_tracker.models import Material, Section
from learning_tracker.serializers import MaterialSerializer

from sessions_manager.models import Project, Project_Partition
from sessions_manager.serializers import ProjectSerializer

from tasks.models import Task
from tasks.serializers import TaskSerializer

from entertainment.models import EntertainmentMaterial
from entertainment.serializers import EntertainmentSerializer

from notes.utils import get_obj_notes

class GoalsAPI(APIView):

    """
        Goals APIs class to retrieve created goals from the DB and create new ones in it.
    """

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]

    def get(self, request):
        try:
            user = request.user.id

            search_query = request.query_params.get('search', None)
            if search_query is not None:
                goals = Goal.objects.filter(Q(name__contains=search_query) | Q(name__iexact=search_query), user=user)
                serializer = GoalSerializer(instance=goals, many=True)
                
                return Response(data=serializer.data, status=HTTP_200_OK)

            goals = Goal.objects.filter(user=user).order_by('-id')
            serializer = GoalSerializer(instance=goals, many=True)

            return Response(data=serializer.data, status=HTTP_200_OK)
        
        except:
            return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            user = request.user.id
            goalData = request.data['goal']
            goalData['user'] = user

            serializer = GoalSerializer(data=goalData)

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                
                
                tasksData = request.data['tasks']
                for task in tasksData:
                    task['goal'] = serializer.data['id']
                    task['user'] = user
                
                tasks_serializer = TaskSerializer(data=tasksData, many=True)

                if tasks_serializer.is_valid(raise_exception=True):
                    tasks_serializer.save()

                    return Response(data=serializer.data, status=HTTP_201_CREATED)

        except serializers.ValidationError:
            return Response(status=HTTP_400_BAD_REQUEST)
        
        except:
            return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
        

class GoalAPI(APIView):

    """
        Goal APIs class to retrieve, update and delete goals from the DB.
    """

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]

    def get(self, request, pk): # Retrieving Goal from DB and all it's related objects.

        try:
            goal = Goal.objects.get(id=pk)
            goal_serializer = GoalSerializer(instance=goal)

            learning_materials = Material.objects.filter(id__in=goal_serializer.data['learning_materials'])
            learning_materials_serializer = MaterialSerializer(instance=learning_materials, many=True)

            projects = Project.objects.filter(id__in=goal_serializer.data['projects'])
            projects_serializer = ProjectSerializer(instance=projects, many=True)

            tasks = goal.task_set.all()
            tasks_serializer = TaskSerializer(instance=tasks, many=True)

            rewards = EntertainmentMaterial.objects.filter(id__in=goal_serializer.data['rewards'])
            rewards_serializer = EntertainmentSerializer(instance=rewards, many=True)

            data = goal_serializer.data
            data['learning_materials'] = learning_materials_serializer.data
            data['projects'] = projects_serializer.data
            data['tasks'] = tasks_serializer.data
            data['rewards'] = rewards_serializer.data
            data['notes'] = get_obj_notes(goal)

            return Response(data=data, status=HTTP_200_OK)
        
        except Goal.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)

        except:
            return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
    

    def patch(self, request, pk): # Updating goal's data.

        try:
            goal = Goal.objects.get(id=pk)
            serializer = GoalSerializer(instance=goal, data=request.data, partial=True)

            if serializer.is_valid(raise_exception=True):
                serializer.save()

                return Response(status=HTTP_202_ACCEPTED)
            
        except serializers.ValidationError:
            return Response(status=HTTP_400_BAD_REQUEST)

        except:
            return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
        
    def delete(self, request, pk):

        goal = Goal.objects.get(id=pk)
        goal.delete()

        return Response(status=HTTP_204_NO_CONTENT)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def get_goal_progress(request, pk): # Calculates goal's progress from the amount of done things of goal's related things.
    
    """
        Calculates goal's progress from the amount of done things of goal's related things.
    """

    try:
        done_num = 0
        total_num = 0

        goal = Goal.objects.get(id=pk)
        goal_serializer = GoalSerializer(instance=goal)

        projects = Project.objects.filter(id__in=goal_serializer.data['projects'])
        learning_materials = Material.objects.filter(id__in=goal_serializer.data['learning_materials'])
        all_tasks = Task.objects.filter(goal=goal.id)
        done_tasks = Task.objects.filter(goal=goal.id, done=True)

        done_num += done_tasks.count()
        total_num += all_tasks.count()

        for project in projects:
            all_partitions = project.project_partition_set.all()
            done_partitions = Project_Partition.objects.filter(project=project.id, done=True)
            
            done_num += done_partitions.count()
            total_num += all_partitions.count()
        
        for material in learning_materials:
            all_sections = material.section_set.all()
            done_sections = Section.objects.filter(material=material.id, done=True)

            done_num += done_sections.count()
            total_num += all_sections.count()
        
        progress_amount = f'{(done_num/total_num) * 100:.2f}' # Calculating the progress.

        return Response(data={'progress': progress_amount, 'goal': goal.name}, status=HTTP_200_OK)

    except:
        return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
