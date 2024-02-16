from rest_framework import serializers
from .models import *

class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = '__all__'


class PartitionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project_Partition
        fields = '__all__'