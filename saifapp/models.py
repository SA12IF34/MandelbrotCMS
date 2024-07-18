from django.db import models
from django.contrib.auth.models import User

class PartLink(models.Model):
    name = models.CharField(max_length=50, blank=False, null=False)
    link = models.CharField(max_length=50, blank=False, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name

