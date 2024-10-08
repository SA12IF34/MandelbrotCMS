# Generated by Django 4.2.7 on 2024-07-18 10:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('goals', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('learning_tracker', '0001_initial'),
        ('entertainment', '0001_initial'),
        ('sessions_manager', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TasksContainer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('date', models.DateField()),
                ('done', models.BooleanField(default=False)),
                ('reward', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='entertainment.entertainmentmaterial')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('done', models.BooleanField(default=False)),
                ('container', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tasks.taskscontainer')),
                ('goal', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='goals.goal')),
                ('learningMaterial', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='learning_tracker.material')),
                ('project', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='sessions_manager.project')),
                ('reward', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='entertainment.entertainmentmaterial')),
            ],
        ),
    ]
