from rest_framework.views import APIView
from rest_framework.status import *
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view, authentication_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import *
from .serializers import *

from notes.utils import get_obj_notes

# Projects APIs class which apply RAED, SEARCH, and CREATE functionalities.
class ProjectsAPI(APIView):

    """
        Projects APIs class which apply RAED, SEARCH, and CREATE functionalities.
    """

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]

    def get(self, request):
        user = request.user.id

        # Applying search functionality if "search" url parameter exists
        search_query = request.query_params.get('search', None)
        if search_query is not None:
            projects = Project.objects.filter(user=user, name__contains=search_query)
            serializer = ProjectSerializer(instance=projects, many=True)

            return Response(data=serializer.data, status=HTTP_200_OK)

        
        projects = Project.objects.filter(user=user)
        serializer = ProjectSerializer(instance=projects, many=True)

        return Response(data=serializer.data, status=HTTP_200_OK)
    
    def post(self, request):
        user = request.user.id
        project_data = request.data['project']

        if not (user in project_data):
            project_data['user'] = user
        
        serializer = ProjectSerializer(data=project_data) # Creating project instance in DB
        
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()


                if len(request.data['partitions']) > 0: 
                    # Creating project's partitions instances and connecting them with the project
                    partitions_data = request.data['partitions']
                    for d in partitions_data:
                        d['project'] = serializer.data['id']
                    
                    serializer2 = PartitionSerializer(data=partitions_data, many=True)
                    
                    try: 
                        if serializer2.is_valid(raise_exception=True):
                            serializer2.save()

                            return Response(data=serializer.data, status=HTTP_201_CREATED)
                    
                    except serializers.ValidationError:
                        return Response(status=HTTP_400_BAD_REQUEST)
                    
            return Response(data={'project': serializer.data}, status=HTTP_201_CREATED)
        
        except serializers.ValidationError:
            return Response(data=serializer.error_messages,status=HTTP_400_BAD_REQUEST)



# Getting projects by category
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def project_filter_category(request):
    
    if request.method == 'GET':
        user = request.user.id

        category_query = request.query_params.get('category', None)

        if category_query is not None:
            projects = Project.objects.filter(user=user, categories=category_query)
            serializer = ProjectSerializer(instance=projects, many=True)

            return Response(data=serializer.data, status=HTTP_200_OK)
        
        return Response(status=HTTP_400_BAD_REQUEST)



# Project APIs for READ, UPDATE, and DELETE functionalities.
class ProjectAPI(APIView):

    """
        Project APIs for READ, UPDATE, and DELETE functionalities.
    """

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]

    def get(self, request, pk):
        try: 
            project = Project.objects.get(id=pk, user=request.user.id) # Retrieving user's project from the DB

        except Project.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)
        
        partitions = project.project_partition_set.all()
    
        serializer1 = ProjectSerializer(instance=project)
        serializer2 = PartitionSerializer(instance=partitions, many=True)

        related_notes = get_obj_notes(project)

        data = {
            "project": serializer1.data,
            "partitions": serializer2.data,
            "notes": related_notes
        }

        return Response(data=data, status=200)

    def patch(self, request, pk):
        project = Project.objects.get(id=pk)
        serializer = ProjectSerializer(instance=project, data=request.data, partial=True)

        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()

                return Response(data=serializer.data, status=HTTP_202_ACCEPTED)
        
        except serializers.ValidationError:
            return Response(status=HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        project = Project.objects.get(id=pk)
        project.delete()

        return Response(status=HTTP_204_NO_CONTENT)


# Change project category
def project_change_category(project, category, check_date=None):
    
    if check_date:
        data = {"categories": category, "finish_time": check_date}
    else: 
        data = {"categories": category}
        
    serializer = ProjectSerializer(instance=project, data=data, partial=True)

    if serializer.is_valid():
        serializer.save()

        return True


# Project Partitions APIs for CREATE functionality.
class PartitionsAPI(APIView):

    """
        Project Partitions APIs for CREATE functionality.
    """

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]

    def post(self, request, pk):
        data = request.data
        if not ('project' in data):
            data['project'] = pk

        serializer = PartitionSerializer(data=data)

        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()

                return Response(data=serializer.data, status=HTTP_201_CREATED)
        
        except serializers.ValidationError:
            return Response(status=HTTP_400_BAD_REQUEST)


# Project Partition APIs for READ, UPDATE, and DELETE functionalities.
class PartitionAPI(APIView):

    """
        Project Partition APIs for READ, UPDATE, and DELETE functionalities.
    """

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]
    
    def get(self, request, pk):
        try:
            partition = Project_Partition.objects.get(id=pk)
        except Project_Partition.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)

        serializer = PartitionSerializer(instance=partition)

        return Response(data=serializer.data, status=HTTP_200_OK)
    
    def patch(self, request, pk):
        data = {
            "done": request.data['done']
        }
        partition = Project_Partition.objects.get(id=pk)
        serializer = PartitionSerializer(instance=partition, data=data, partial=True)

        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                
                # Applying auto category change depending on the number of partitions done 
                project = Project.objects.get(id=serializer.data['project'])
                partitions = Project_Partition.objects.filter(project=project.id, done=True)
                
                partitions_count = partitions.count()

                if partitions_count == len(project.project_partition_set.all()):
                    project_change_category(project=project, category='completed', check_date=request.data['check_date'])
                    return Response(status=HTTP_200_OK) 
                
                elif not data['done'] and partitions_count < len(project.project_partition_set.all()):
                    project_change_category(project=project, category='in progress')
                    return Response(status=HTTP_202_ACCEPTED)

                return Response(data=serializer.data, status=HTTP_202_ACCEPTED)
        
        except serializers.ValidationError:
            return Response(status=HTTP_400_BAD_REQUEST)    
    
    def delete(self, request, pk):
        partition = Project_Partition.objects.get(id=pk)
        project = partition.project
        partition.delete()

        project = Project.objects.get(id=project.id)
        partitions = Project_Partition.objects.filter(project=project.id, done=True)
        
        if partitions.count() == len(project.project_partition_set.all()): # Applying auto category change functionality.
            project_change_category(project=project, category='completed')
            return Response(status=HTTP_200_OK) 
        
        elif partitions.count() < len(project.project_partition_set.all()):
            project_change_category(project=project, category='in progress')
            return Response(status=HTTP_202_ACCEPTED)

        return Response(status=HTTP_204_NO_CONTENT)
    