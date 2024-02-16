from django.db import models
from sessions_manager.models import *
from learning_tracker.models import Material as LearningMaterial
from entertainment.models import EntertainmentMaterial
from goals.models import Goal
from django.contrib.auth.models import User

# Create your models here.

class Task(models.Model): 
    content = models.TextField(null=False, blank=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    learningMaterial = models.ForeignKey(LearningMaterial, on_delete=models.CASCADE, null=True, blank=True)
    reward = models.ForeignKey(EntertainmentMaterial, on_delete=models.CASCADE, null=True, blank=True)
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, null=True, blank=True)
    container = models.ForeignKey('TasksContainer', on_delete=models.CASCADE, null=True, blank=True)
    done = models.BooleanField(null=False, blank=False, default=False)


class TasksContainer(models.Model):
    title = models.CharField(max_length=200, null=False, blank=False)
    date = models.DateField(null=False, blank=False)
    reward = models.ForeignKey(EntertainmentMaterial, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    # reminder = models.ForeignKey('Reminder', on_delete=models.CASCADE, null=True, blank=True)
    done = models.BooleanField(default=False, blank=False, null=False)

    def __str__(self):
        return f'{self.title} | {self.user.username}'
    

# class Reminder(models.Model):
#     times = models.TextField(null=False, blank=False)
#     user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)