from django.shortcuts import render, redirect
from django.urls import reverse
from .models import Patient, Doctor
from .serializers import PatientSerializer, DoctorSerializer
from rest_framework import generics, status
from rest_framework.views import APIView # generic view
from rest_framework.response import Response # sending custom response from view


# Create your views here.

class GetAlertView(APIView):
  def get(self, request, format=None):
    data = { 'success': '', 'error': ''}
    if request.session.has_key('success'):
      data['success'] = request.session['success']
    if request.session.has_key('error'):
      data['error'] = request.session['error']

    request.session['success'] = ''
    request.session['error'] = ''

    return Response(data, status=status.HTTP_200_OK)


class PatientListView(generics.ListAPIView):
  serializer_class = PatientSerializer
  queryset = Patient.objects.all()

class CreatePatientView(APIView):
  serializer_class = PatientSerializer
  
  def post(self, request, format=None):
    serializer = self.serializer_class(data=request.data) # gives us a python version of the data so we can validate it
    if serializer.is_valid():
      firstname = serializer.data.get('firstname').capitalize()
      lastname = serializer.data.get('lastname').capitalize()
      birthday = serializer.data.get('birthday')
      gender = serializer.data.get('gender')
      weight = serializer.data.get('weight')
      height_ft = serializer.data.get('height_ft')
      height_in = serializer.data.get('height_in')
      phone = serializer.data.get('phone')

      patient = Patient(firstname=firstname, lastname=lastname, birthday=birthday, gender=gender, weight=weight, height_ft=height_ft, height_in=height_in, phone=phone)
      patient.save()

      request.session['success'] = 'Patient successfully created!'
      
      return Response(PatientSerializer(patient).data, status=status.HTTP_201_CREATED)
    request.session['error'] = 'Sorry! Could not create new patient...'
    return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


# url: /patients/:id
class ManagePatientView(APIView):
  serializer_class = PatientSerializer
  
  # getting patient data to populate update form or show detail
  def get(self, request, *args, **kwargs):
    try:
      _id = self.kwargs.get('id')
      patient = Patient.objects.get(id=_id)
      data = PatientSerializer(patient).data

      # additional data to render on detail view
      data['age'] = patient.age()
      data['long_gender'] = patient.long_gender()
      data['formatted_phone'] = patient.formatted_phone()
      data['formatted_height'] = patient.formatted_height()

      return Response(data, status=status.HTTP_200_OK)
    except:
      request.session['error'] = 'Patient not found.'
      return Response({'Patient not found': 'Invalid id...'}, status=status.HTTP_404_NOT_FOUND)

  # updating patient data
  def patch(self, request, *args, **kwargs):
    try:
      _id = self.kwargs.get('id')
      serializer = self.serializer_class(data=request.data) # gives us a python version of the data so we can validate it
      if serializer.is_valid():

        patient = Patient.objects.get(id=_id)
        patient.firstname = serializer.data.get('firstname').capitalize()
        patient.lastname = serializer.data.get('lastname').capitalize()
        patient.birthday = serializer.data.get('birthday')
        patient.gender = serializer.data.get('gender')
        patient.weight = serializer.data.get('weight')
        patient.height_ft = serializer.data.get('height_ft')
        patient.height_in = serializer.data.get('height_in')
        patient.phone = serializer.data.get('phone')
        patient.save()

        data = PatientSerializer(patient).data
        request.session['success'] = 'Patient successfully updated!'
        return Response(data, status=status.HTTP_200_OK)
    except:
      request.session['error'] = 'Sorry! Could not update patient.'
      return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

  def delete(self, request, *args, **kwargs):
    try:
      _id = self.kwargs.get('id')
      if _id != None:
        patient = Patient.objects.get(id=_id)
        patient.delete()
        request.session['success'] = 'Patient successfully deleted!'
        return Response({'successful delete'}, status=status.HTTP_200_OK)
    except:
      request.session['error'] = 'Sorry! Could not delete patient.'
      return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class DoctorListView(generics.ListAPIView):
  serializer_class = DoctorSerializer
  queryset = Doctor.objects.all()

class CreateDoctorView(APIView):
  serializer_class = DoctorSerializer
  
  def post(self, request, format=None):
    serializer = self.serializer_class(data=request.data) # gives us a python version of the data so we can validate it
    if serializer.is_valid():
      firstname = serializer.data.get('firstname').capitalize()
      lastname = serializer.data.get('lastname').capitalize()
      gender = serializer.data.get('gender')
      phone = serializer.data.get('phone')
      availability = serializer.data.get('availability')

      doctor = Doctor(firstname=firstname, lastname=lastname, gender=gender, phone=phone, availability=availability)
      doctor.save()

      request.session['success'] = 'Doctor successfully created!'
      print(doctor)

      data = DoctorSerializer(doctor).data
      data['id'] = doctor.id # needed for redirect
      
      return Response(data, status=status.HTTP_201_CREATED)
    request.session['error'] = 'Sorry! Could not create new doctor...'
    return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

# url: /patients/:id
class ManageDoctorView(APIView):
  serializer_class = DoctorSerializer
  
  # getting patient data to populate update form or show detail
  def get(self, request, *args, **kwargs):
    try:
      _id = self.kwargs.get('id')
      doctor = Doctor.objects.get(id=_id)
      data = DoctorSerializer(doctor).data

      # additional data to render on detail view
      data['long_gender'] = doctor.long_gender()
      data['formatted_phone'] = doctor.formatted_phone()
      data['formatted_availability'] = doctor.formatted_availability()

      return Response(data, status=status.HTTP_200_OK)
    except:
      request.session['error'] = 'Patient not found.'
      return Response({'Patient not found': 'Invalid id...'}, status=status.HTTP_404_NOT_FOUND)

  # updating patient data
  def patch(self, request, *args, **kwargs):
    try:
      _id = self.kwargs.get('id')
      serializer = self.serializer_class(data=request.data) # gives us a python version of the data so we can validate it
      if serializer.is_valid():
        doctor = Doctor.objects.get(id=_id)
        doctor.firstname = serializer.data.get('firstname').capitalize()
        doctor.lastname = serializer.data.get('lastname').capitalize()
        doctor.gender = serializer.data.get('gender')
        doctor.phone = serializer.data.get('phone')
        doctor.availability = serializer.data.get('availability')
        doctor.save()

        data = DoctorSerializer(doctor).data
        request.session['success'] = 'Doctor successfully updated!'
        return Response(data, status=status.HTTP_200_OK)
    except:
      request.session['error'] = 'Sorry! Could not update doctor.'
      return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

  def delete(self, request, *args, **kwargs):
    try:
      _id = self.kwargs.get('id')
      if _id != None:
        doctor = Doctor.objects.get(id=_id)
        doctor.delete()
        request.session['success'] = 'Doctor successfully deleted!'
        return Response({'successful delete'}, status=status.HTTP_200_OK)
    except:
      request.session['error'] = 'Sorry! Could not delete doctor.'
      return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
