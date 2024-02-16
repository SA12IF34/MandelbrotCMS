from rest_framework.views import APIView
from rest_framework.status import *
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import permission_classes, api_view, authentication_classes
from rest_framework.authentication import SessionAuthentication
from .models import *
from .serializers import *
from .scrape import coursera, youtube

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication, JWTAuthentication])
def get_material_data(request):
    if request.method == 'POST':
        
        if request.data['source'] == 'coursera':
            data = coursera(request.data['url'])
        
        elif request.data['source'] == 'youtube':
            data = youtube(request.data['url'])
        
        return Response(data=data, status=HTTP_200_OK)

    return Response(status=HTTP_400_BAD_REQUEST)

class MaterialsAPI(APIView):

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]

    def get(self, request):
        try:
            user = request.user.id

            search_query = request.query_params.get('search', None)
            if search_query is not None:
                materials = Material.objects.filter(user=user, category='in progress', name__contains=search_query)
                serializer = MaterialSerializer(instance=materials, many=True)

                return Response(data=serializer.data, status=HTTP_200_OK)            

            in_progress_material = Material.objects.filter(user=user, category='in progress')
            done_material = Material.objects.filter(user=user, category='done')
            future_material = Material.objects.filter(user=user, category='future material')
            
            in_progress_serializer = MaterialSerializer(instance=in_progress_material, many=True)
            done_serializer = MaterialSerializer(instance=done_material, many=True)
            future_serializer = MaterialSerializer(instance=future_material, many=True)


            data = {
                'in_progress': in_progress_serializer.data,
                'done': done_serializer.data,
                'future': future_serializer.data
            }

            return Response(data=data, status=HTTP_200_OK)
        
        except :
            return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request): # Needs Modification Based on Software Design
        
        user = request.user.id
        if request.data['source'] == 'coursera':
           data, sections = coursera(request.data['url'])

        if request.data['source'] == 'youtube':
            data, sections = youtube(request.data['url'])

        data['user'] = user
        data['url'] = request.data['url']
        data['source'] = request.data['source']
        
        if 'category' in request.data:
            print(request.data['category'])
            data['category'] = request.data['category']
            
        serializer = MaterialSerializer(data=data)


        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()

                if len(sections) > 0:
                    for section in sections:
                        section['material'] = serializer.data['id']

                    serializer2 = SectionSerializer(data=sections, many=True)

                    try:
                        if serializer2.is_valid(raise_exception=True):
                            serializer2.save()
                        
                            return Response(data=serializer.data, status=HTTP_201_CREATED)
                        
                    except serializers.ValidationError:
                        return Response(data=serializer2.error_messages, status=HTTP_400_BAD_REQUEST)

                return Response(data=serializer.data, status=HTTP_201_CREATED)

        except serializers.ValidationError:
            return Response(data=serializer.error_messages, status=HTTP_400_BAD_REQUEST)


class MaterialAPI(APIView):

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]

    def get(self, request, pk):
        material = Material.objects.get(id=pk)
        sections = material.section_set.all()
        serializer = MaterialSerializer(instance=material)
        serializer2 = SectionSerializer(instance=sections, many=True)

        return Response(data={'material':serializer.data, 'sections': serializer2.data}, status=HTTP_200_OK)

    def patch(self, request, pk):
        material = Material.objects.get(id=pk)
        serializer = MaterialSerializer(instance=material, data=request.data, partial=True)

        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()

                return Response(status=HTTP_202_ACCEPTED)

        except serializers.ValidationError:
            return Response(data=serializer.error_messages, status=HTTP_400_BAD_REQUEST)
        

    def delete(self, request, pk):
        material = Material.objects.get(id=pk)
        material.delete()

        return Response(status=HTTP_204_NO_CONTENT)


class SectionAPI(APIView):

    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, JWTAuthentication]

    def get(self, request, pk):
        section = Section.objects.get(id=pk)
        serializer = SectionSerializer(instance=section)

        return Response(data=serializer.data, status=HTTP_200_OK)
    
    def patch(self, request, pk):
        section = Section.objects.get(id=pk)
        serializer = SectionSerializer(instance=section, data=request.data, partial=True)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                material = Material.objects.get(id=serializer.data['material'])
                all_sections = material.section_set.all()
                done_sections = Section.objects.filter(material=material.id, done=True)
                
                if (len(all_sections) == len(done_sections)) :
                    material_serializer = MaterialSerializer(instance=material, data={"category": "done"}, partial=True)
                    
                    try:
                        if material_serializer.is_valid(raise_exception=True):
                            material_serializer.save()

                            return Response(status=HTTP_202_ACCEPTED)
                    
                    except serializers.ValidationError:
                        serializer = SectionSerializer(instance=section, data={"done": False}, partial=True)
                        if serializer.is_valid():
                            serializer.save()

                            return Response(status=500)
                return Response(status=HTTP_202_ACCEPTED)
        
        except serializers.ValidationError:
            return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)
