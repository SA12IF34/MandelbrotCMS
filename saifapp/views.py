from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from .models import PartLink 
from .serializers import PartLinkSerializer



@api_view(['GET'])
@permission_classes([AllowAny])
def get_links(request):
    links = PartLink.objects.filter().order_by('id')
    serializer = PartLinkSerializer(instance=links, many=True)

    return Response(data=serializer.data, status=200)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_link(request):
    try:
        data = request.data
        if 'user' not in data.keys():
            data['user'] = request.user.id

        serializer = PartLinkSerializer(data=data)

        if serializer.is_valid():
            serializer.save()

            return Response(data=serializer.data, status=201)
            
        return Response(status=400)
        
    except:
        return Response(status=500)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def many_part_links(request):
    user = request.user.id
    data = request.data
    return_data = []

    for link in data:
        serializer = PartLinkSerializer(data={"name": link[0], "link": link[1], "user": user})
        if serializer.is_valid():
            serializer.save()
            return_data.append(serializer.data['name'])
        continue

    return Response(data=return_data, status=201)