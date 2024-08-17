from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet, ModelViewSet
from rest_framework.status import *
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import serializers

from .serializers import NoteSerializer
from .models import Note

# APIs for handling different notes table operations
class NotesViewSet(ModelViewSet):

    queryset = Note.objects.all()
    serializer_class = NoteSerializer    

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]


    def create(self, request):
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = self.get_serializer(data=data)

        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()

                return Response(data=serializer.data, status=HTTP_201_CREATED)
        
        except serializers.ValidationError:
            return Response(status=HTTP_400_BAD_REQUEST)
        
        except:
            return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)

    
    def list(self, request):
        notes = self.get_queryset().order_by('-id')
        serializer = self.get_serializer(notes, many=True)

        return Response(data=serializer.data, status=HTTP_200_OK)

    
    def retrieve(self, request, pk=None):
        note = self.get_object()
        serializer = self.get_serializer(note)
        
        return Response(data=serializer.data, status=HTTP_200_OK)


    def partial_update(self, request, pk=None):
        note = self.get_object()
        serializer = self.get_serializer(instance=note, data=request.data, partial=True)

        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()

                return Response(data=serializer.data, status=HTTP_202_ACCEPTED)

        except serializers.ValidationError:
            return Response(status=HTTP_400_BAD_REQUEST)        
    
        except:
            return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
        

    def destroy(self, request, pk=None):
        note = self.get_object()

        note.delete()

        return Response(status=HTTP_204_NO_CONTENT)