from django.shortcuts import render, redirect
from django.urls import reverse
from .models import Patient, Doctor, Appointment
from .serializers import PatientSerializer, DoctorSerializer, AppointmentSerializer
from rest_framework import generics, status
from rest_framework.views import APIView # generic view
from rest_framework.response import Response # sending custom response from view
from rest_framework.exceptions import NotFound


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





# patient views
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
      data['formatted_weight'] = patient.formatted_weight()
      

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

        appts = Appointment.objects.filter(patient_id__exact=_id)
        for appt in appts:
          appt.patient_name = patient.firstname + ' ' + patient.lastname
          appt.save()

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

        appts = Appointment.objects.filter(patient_id__exact=_id)
        for appt in appts:
          appt.delete()
        request.session['success'] = 'Patient successfully deleted!'
        return Response({'successful delete'}, status=status.HTTP_200_OK)
    except:
      request.session['error'] = 'Sorry! Could not delete patient.'
      return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)





# doctor views
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
      accepts_new_patients = serializer.data.get('accepts_new_patients')

      doctor = Doctor(firstname=firstname, lastname=lastname, gender=gender, phone=phone, accepts_new_patients=accepts_new_patients)
      doctor.save()

      request.session['success'] = 'Doctor successfully created!'
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

      return Response(data, status=status.HTTP_200_OK)
    except:
      request.session['error'] = 'Doctor not found.'
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
        doctor.accepts_new_patients = serializer.data.get('accepts_new_patients')
        doctor.save()

        appts = Appointment.objects.filter(doctor_id__exact=_id)
        for appt in appts:
          appt.doctor_name = doctor.firstname + ' ' + doctor.lastname
          appt.save()

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

        appts = Appointment.objects.filter(doctor_id__exact=_id)
        for appt in appts:
          appt.delete()
          
        request.session['success'] = 'Doctor successfully deleted!'
        return Response({'successful delete'}, status=status.HTTP_200_OK)
    except:
      request.session['error'] = 'Sorry! Could not delete doctor.'
      return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)





# appointment views
class AppointmentListView(generics.ListAPIView):
  serializer_class = AppointmentSerializer
  queryset = Appointment.objects.all()

  def list(self, request):
    queryset = self.get_queryset()
    data = AppointmentSerializer(queryset, many=True).data

    for appt in data:
      appt_obj = Appointment.objects.get(id=appt['id'])
      appt['status'] = appt_obj.status()
      appt['formatted_time'] = appt_obj.formatted_time()

    return Response(data)

class CreateAppointmentView(APIView):
  serializer_class = AppointmentSerializer
  
  def post(self, request, format=None):
    serializer = self.serializer_class(data=request.data) # gives us a python version of the data so we can validate it
    if serializer.is_valid():
      try:
        patient_id = serializer.data.get('patient_id')
        patient_name = serializer.data.get('patient_name')
        patient = Patient.objects.get(id=patient_id)
        fullname = patient.firstname + ' ' + patient.lastname
        if fullname != patient_name:
          raise NotFound()
      except:
        request.session['error'] = 'Could not create new appointment (patient does not exist)'
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

      try:
        doctor_id = serializer.data.get('doctor_id')
        doctor_name = serializer.data.get('doctor_name')
        doctor = Doctor.objects.get(id=doctor_id)
        fullname = doctor.firstname + ' ' + doctor.lastname
        if fullname != doctor_name:
          raise NotFound()
      except:
        request.session['error'] = 'Could not create new appointment (doctor does not exist)'
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

      date = serializer.data.get('date')
      time = serializer.data.get('time')
      notes = serializer.data.get('notes')

      appt = Appointment(patient_id=patient_id, patient_name=patient_name, doctor_id=doctor_id, doctor_name=doctor_name, date=date, time=time, notes=notes)
      appt.save()

      request.session['success'] = 'Appointment successfully created!'
      data = AppointmentSerializer(appt).data
      data['id'] = appt.id # needed for redirect
      
      return Response(data, status=status.HTTP_201_CREATED)
    request.session['error'] = 'Sorry! Could not create new appointment...'
    return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

# url: /patients/:id
class ManageAppointmentView(APIView):
  serializer_class = AppointmentSerializer
  
  # getting patient data to populate update form or show detail
  def get(self, request, *args, **kwargs):
    try:
      _id = self.kwargs.get('id')
      appt = Appointment.objects.get(id=_id)
      data = AppointmentSerializer(appt).data
      data['status'] = appt.status()
      data['formatted_time'] = appt.formatted_time()
 

      return Response(data, status=status.HTTP_200_OK)
    except:
      request.session['error'] = 'Appointment not found.'
      return Response({'Appointment not found': 'Invalid id...'}, status=status.HTTP_404_NOT_FOUND)

  # updating patient data
  def patch(self, request, *args, **kwargs):
    try:
      _id = self.kwargs.get('id')
      serializer = self.serializer_class(data=request.data) # gives us a python version of the data so we can validate it
      if serializer.is_valid():
        appt = Appointment.objects.get(id=_id)
        appt.patient_id = serializer.data.get('patient_id')
        appt.patient_name = serializer.data.get('patient_name')
        appt.doctor_id = serializer.data.get('doctor_id')
        appt.doctor_name = serializer.data.get('doctor_name')
        appt.date = serializer.data.get('date')
        appt.time = serializer.data.get('time')
        appt.notes = serializer.data.get('notes')
        appt.save()

        data = AppointmentSerializer(appt).data
        request.session['success'] = 'Appointment successfully updated!'
        return Response(data, status=status.HTTP_200_OK)
    except:
      request.session['error'] = 'Sorry! Could not update appointment.'
      return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

  def delete(self, request, *args, **kwargs):
    try:
      _id = self.kwargs.get('id')
      if _id != None:
        appt = Appointment.objects.get(id=_id)
        appt.delete()
        request.session['success'] = 'Appointment successfully deleted!'
        return Response({'successful delete'}, status=status.HTTP_200_OK)
    except:
      request.session['error'] = 'Sorry! Could not delete appointment.'
      return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class FindAppointmentsView(generics.ListAPIView):
  serializer_class = AppointmentSerializer
  queryset = Appointment.objects.all()

  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    _id = self.kwargs.get('id')
    _type = self.kwargs.get('type')
    if _type == 'patients':
      queryset = queryset.filter(patient_id__exact=_id)
    elif _type == 'doctors':
      queryset = queryset.filter(doctor_id__exact=_id)

    data = AppointmentSerializer(queryset, many=True).data

    for appt in data:
      appt_obj = Appointment.objects.get(id=appt['id'])
      appt['status'] = appt_obj.status()
      appt['formatted_time'] = appt_obj.formatted_time()

    return Response(data)

class CreateAppointmentFromView(APIView):

  def get(self, request, *args, **kwargs):
    try:
      _id = self.kwargs.get('id')
      _type = self.kwargs.get('type')

      if _type == 'patients':
        patient = Patient.objects.get(id=_id)
        data = PatientSerializer(patient).data
        return Response(data)
      elif _type == 'doctors':
        doctor = Doctor.objects.get(id=_id)
        data = DoctorSerializer(doctor).data
        return Response(data)
    except:
      request.session['error'] = 'Unable to schedule appointment.'
      return Response({'Person not found': 'Invalid id...'}, status=status.HTTP_404_NOT_FOUND)

