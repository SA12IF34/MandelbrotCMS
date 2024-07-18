from django.db import models
from django.contrib.auth.models import User
from sessions_manager.models import Project
from learning_tracker.models import Material as LearningMaterial
from entertainment.models import EntertainmentMaterial
from goals.models import Goal
from tasks.models import TasksContainer
 

class BaseNote(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    content = models.TextField(null=False, blank=False)
    drawn_content = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    last_update = models.DateField(auto_now=True)

kwargs = {
    "on_delete": models.CASCADE,
    "null": True,
    "blank": True
}

class Note(BaseNote):
    project = models.ForeignKey(Project, **kwargs)
    learning_material = models.ForeignKey(LearningMaterial, **kwargs)
    entertainment_material = models.ForeignKey(EntertainmentMaterial, **kwargs)
    goal = models.ForeignKey(Goal, **kwargs)
    tasks_list = models.ForeignKey(TasksContainer, **kwargs)

