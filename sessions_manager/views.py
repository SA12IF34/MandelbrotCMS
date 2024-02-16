from rest_framework.views import APIView
from rest_framework.status import *
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes, api_view, authentication_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import *
from .serializers import *


class ProjectsAPI(APIView):

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]

    def get(self, request):
        user = request.user.id

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
        
        serializer = ProjectSerializer(data=project_data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()


                if len(request.data['partitions']) > 0:
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def completed_projects(request):
    
    if request.method == 'GET':
        user = request.user.id
        projects = Project.objects.filter(user=user, categories='completed')
        serializer = ProjectSerializer(instance=projects, many=True)

        return Response(data=serializer.data, status=HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def in_progress_projects(request):
    
    if request.method == 'GET':
        user = request.user.id
        projects = Project.objects.filter(user=user, categories='in progress')
        serializer = ProjectSerializer(instance=projects, many=True)

        return Response(data=serializer.data, status=HTTP_200_OK)

class ProjectAPI(APIView):

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]

    def get(self, request, pk):
        try: 
            project = Project.objects.get(id=pk)
        except Project.DoesNotExist:
            return Response(status=HTTP_404_NOT_FOUND)
        
        partitions = project.project_partition_set.all()
    
        serializer1 = ProjectSerializer(instance=project)
        serializer2 = PartitionSerializer(instance=partitions, many=True)

        data = {
            "project": serializer1.data,
            "partitions": serializer2.data
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

def complete_project(project):
    serializer = ProjectSerializer(instance=project, data={
        "categories": "completed"
    }, partial=True)

    if serializer.is_valid():
        serializer.save()

def in_progress_project(project):
    serializer = ProjectSerializer(instance=project, data={
        "categories": "in progress"
    }, partial=True)

    if serializer.is_valid():
        serializer.save()

class PartitionsAPI(APIView):

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


class PartitionAPI(APIView):

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
        partition = Project_Partition.objects.get(id=pk)
        serializer = PartitionSerializer(instance=partition, data=request.data, partial=True)

        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                
                project = Project.objects.get(id=serializer.data['project'])
                partitions = Project_Partition.objects.filter(project=project.id, done=True)
                
                if partitions.count() == len(project.project_partition_set.all()):
                    complete_project(project=project)
                    return Response(status=HTTP_200_OK) 
                
                elif partitions.count() < len(project.project_partition_set.all()):
                    in_progress_project(project=project)
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
        
        if partitions.count() == len(project.project_partition_set.all()):
            complete_project(project=project)
            return Response(status=HTTP_200_OK) 
        
        elif partitions.count() < len(project.project_partition_set.all()):
            in_progress_project(project=project)
            return Response(status=HTTP_202_ACCEPTED)

        return Response(status=HTTP_204_NO_CONTENT)
    