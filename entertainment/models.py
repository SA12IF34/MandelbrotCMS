from django.db import models
from django.contrib.auth.models import User

TYPE_CHIOCES = [
    ('anime', 'anime'),
    ('game', 'game'),
    ('shows & movies', 'shows & movies'),
    ('other', 'other')
]

STATUS_CHOICES = [
    ('current', 'current'),
    ('done', 'done'),
    ('later', 'later')
]

# Create your models here.
class EntertainmentMaterial(models.Model):
    name = models.CharField(max_length=250, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    url = models.TextField(null=False, blank=False)
    image = models.TextField(null=True, blank=True)
    type = models.CharField(max_length=15, choices=TYPE_CHIOCES, null=False, blank=False)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='current', null=False, blank=False)
    special = models.BooleanField(null=False, blank=False, default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self):
        return f'{self.name} | {self.user.username}'
    
