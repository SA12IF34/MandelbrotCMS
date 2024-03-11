from django.contrib import admin
from .models import *


class PartitionInline(admin.StackedInline):
    model = Project_Partition
    extra = 1

class ProjectAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['name', 'description', 'categories']}),
        ('Time Info', {'fields': ['starting_time', 'finish_time']}),
        ('Project Manager', {'fields': ['user']})
    ]
    inlines = [PartitionInline]


admin.site.register(Project, ProjectAdmin)
# admin.site.register(Project_Partition)