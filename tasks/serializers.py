from rest_framework import serializers
from .models import *


class ContainerSerializer(serializers.ModelSerializer):

    class Meta:
        model = TasksContainer
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = '__all__'

# class ReminderSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Reminder
#         fields = '__all__'