# Generated by Django 4.0.3 on 2022-04-07 19:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_doctor_firstname_alter_doctor_lastname'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appointment',
            name='doctor_exists',
        ),
        migrations.RemoveField(
            model_name='appointment',
            name='patient_exists',
        ),
    ]
