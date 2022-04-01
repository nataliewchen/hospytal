from django.urls import path
from .views import GetAlertView, PatientListView, CreatePatientView, ManagePatientView, DoctorListView, CreateDoctorView, ManageDoctorView

app_name= 'api'
urlpatterns = [
  path('alert', GetAlertView.as_view()),
  path('patients', PatientListView.as_view(), name='patient-list'),
  path('patients/create', CreatePatientView.as_view()),
  path('patients/<int:id>', ManagePatientView.as_view()),
  path('doctors', DoctorListView.as_view()),
  path('doctors/create', CreateDoctorView.as_view()),
  path('doctors/<int:id>', ManageDoctorView.as_view()),
]