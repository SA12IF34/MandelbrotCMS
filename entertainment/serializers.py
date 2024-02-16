from rest_framework import serializers
from .models import EntertainmentMaterial

class EntertainmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = EntertainmentMaterial
        fields = '__all__'