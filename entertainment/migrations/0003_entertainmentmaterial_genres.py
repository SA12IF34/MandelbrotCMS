# Generated by Django 4.2.7 on 2024-09-22 16:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entertainment', '0002_entertainmentmaterial_last_update'),
    ]

    operations = [
        migrations.AddField(
            model_name='entertainmentmaterial',
            name='genres',
            field=models.TextField(default=None, null=True),
        ),
    ]
