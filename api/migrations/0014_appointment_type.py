# Generated by Django 4.0.3 on 2022-04-05 18:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_appointment_notes'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='type',
            field=models.CharField(default='Virtual Visit', max_length=30),
            preserve_default=False,
        ),
    ]
