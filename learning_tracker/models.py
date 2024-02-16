from django.db import models
from django.contrib.auth.models import User

SOURCE_CHOICES = [
    ('youtube', 'youtube'),
    ('coursera', 'coursera')
]

COURSE_CATEGORIES = [
    ('in progress', 'in progress'),
    ('done', 'done'),
    ('future material', 'future material')
]

class Material(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    url = models.TextField(null=False, blank=False)
    image = models.TextField(null=True, blank=True)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, null=False, blank=False)
    category = models.CharField(max_length=50,default='in progress',choices=COURSE_CATEGORIES, null=False, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self):
        return f'{self.name} | {self.user.username}'

class Section(models.Model):
    name = models.CharField(max_length=200, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    material = models.ForeignKey(Material, on_delete=models.CASCADE, null=False, blank=False)
    done = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.name} | {self.material.name}'