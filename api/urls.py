from django.urls import path
from .views import (
  GetAlertView, 
  PatientListView, CreatePatientView, ManagePatientView, 
  DoctorListView, CreateDoctorView, ManageDoctorView, 
  AppointmentListView, CreateAppointmentView, ManageAppointmentView, FindAppointmentsView, CreateAppointmentFromView
)

app_name= 'api'
urlpatterns = [
  path('alert', GetAlertView.as_view()),
  path('patients', PatientListView.as_view(), name='patient-list'),
  path('patients/create', CreatePatientView.as_view()),
  path('patients/<int:id>', ManagePatientView.as_view()),
  path('doctors', DoctorListView.as_view()),
  path('doctors/create', CreateDoctorView.as_view()),
  path('doctors/<int:id>', ManageDoctorView.as_view()),
  path('appointments', AppointmentListView.as_view()),
  path('appointments/create', CreateAppointmentView.as_view()),
  path('appointments/create/<str:type>/<int:id>', CreateAppointmentFromView.as_view()),
  path('appointments/<int:id>', ManageAppointmentView.as_view()),
  path('appointments/<str:type>/<int:id>', FindAppointmentsView.as_view()),
]