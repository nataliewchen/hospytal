# Generated by Django 4.0.3 on 2022-03-31 20:29

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_doctor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctor',
            name='availability',
            field=models.JSONField(default=api.models.Doctor.availability_default),
        ),
    ]
