from rest_framework import serializers
from .models import Doctor, Patient
import datetime

class PatientSerializer(serializers.ModelSerializer):
  class Meta:
    model = Patient
    fields = '__all__'
  
  def validate_birthday(self, value):
    if value > datetime.date.today():
      raise serializers.ValidationError('Birthday must not exceed current date.')
    return value

class DoctorSerializer(serializers.ModelSerializer):
  class Meta:
    model = Doctor
    fields = '__all__'

  def validate_availability(self, value):
    days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    for day in value['days']:
      if day not in days:
        raise serializers.ValidationError('Invalid input for availability.')
    return value
