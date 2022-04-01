from django.urls import path
from .views import index

app_name = 'frontend'
urlpatterns = [
    path('', index),
    path('patients/', index, name='patient-list'),
    path('patients/create/', index),
    path('patients/<int:id>', index),
    path('patients/<int:id>/update', index),
    path('doctors/', index),
    path('doctors/create/', index),
    path('doctors/<int:id>', index),
    path('doctors/<int:id>/update', index),
]
