from django.db import models
from django.contrib.auth.models import User

PROJECT_CATEGORIES = [
    ('in progress', 'in_progress'),
    ('completed', 'completed')
]

class Project(models.Model):
    name = models.CharField(max_length=200, null=False, blank=False)
    description = models.TextField(null=False, blank=False)
    categories = models.CharField(max_length=50, choices=PROJECT_CATEGORIES, default='in progress', null=False, blank=False)
    starting_time = models.DateField(null=True, blank=True)
    finish_time = models.DateField(null=True, blank=True)
    creation_date = models.DateField(auto_now=True, null=False, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self):
        return f'{self.name} | {self.user.username}'


class Project_Partition(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    done = models.BooleanField(default=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.name} | {self.project.name}'


    