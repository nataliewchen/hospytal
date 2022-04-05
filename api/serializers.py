from rest_framework import serializers
from .models import Doctor, Patient, Appointment
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
    types_ref = ['Virtual Visits', 'In-Person Visits (Hospital)', 'In-Person Visits (Home)']
    for type in value['types']:
      if type not in types_ref:
        raise serializers.ValidationError('Invalid input for availability.')
    return value

class AppointmentSerializer(serializers.ModelSerializer):
  class Meta:
    model = Appointment
    fields = '__all__'
