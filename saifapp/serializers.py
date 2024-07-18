from rest_framework import serializers
from .models import PartLink


class PartLinkSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartLink
        fields = '__all__'

