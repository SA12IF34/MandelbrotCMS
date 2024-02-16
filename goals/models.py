from django.db import models
from learning_tracker.models import Material
from sessions_manager.models import Project
from entertainment.models import EntertainmentMaterial
from django.contrib.auth.models import User


class Goal(models.Model):
    name = models.CharField(max_length=250, null=False, blank=False)
    description = models.TextField(null=False, blank=False)
    learning_materials = models.ManyToManyField(Material, blank=True)
    projects = models.ManyToManyField(Project, blank=True)
    rewards = models.ManyToManyField(EntertainmentMaterial, blank=False)
    reward_text = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self):
        return f'{self.name} | {self.user.username}'