import math
from django.urls import reverse
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.utils import timezone
import datetime
import time

# Create your models here.

class Patient(models.Model):
  GENDER_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('-', 'Decline to Answer'),
  ]

  firstname   = models.CharField(max_length=35)
  lastname    = models.CharField(max_length=35)
  birthday    = models.DateField()
  gender      = models.CharField(max_length=1, choices=GENDER_CHOICES)
  weight      = models.PositiveSmallIntegerField()
  height_ft   = models.PositiveSmallIntegerField()
  height_in   = models.PositiveSmallIntegerField(validators=[MaxValueValidator(12), MinValueValidator(0)])
  phone       = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]+$')])
  
  def age(self):
    today = datetime.date.today()
    delta = today - self.birthday 
    year = datetime.timedelta(days = 365)
    month = datetime.timedelta(days = 30)
    age_yrs = math.trunc(delta / year)
    if age_yrs == 0:
      age_mos = math.trunc(delta / month)
      return str(age_mos) + ' mos'
    else:
      return str(age_yrs) + ' yrs'

  def long_gender(self):
    if self.gender == 'M':
      return 'Male'
    elif self.gender == 'F':
      return 'Female'
    elif self.gender == '-':
      return 'Decline to Answer'

  def formatted_weight(self):
    return str(self.weight) + ' lbs'

  def formatted_height(self):
    return str(self.height_ft) + '\' ' + str(self.height_in) + '"'

  def formatted_phone(self):
    num = self.phone
    return '(' + num[0:3] + ') ' + num[3:6] + ' - ' + num[6:]



class Doctor(models.Model):
  GENDER_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('-', 'Decline to Answer'),
  ]

  ACCEPTS_NEW_PATIENTS_CHOICES = [
    ('yes', 'yes'),
    ('no', 'no')
  ]

  firstname             = models.CharField(max_length=35)
  lastname              = models.CharField(max_length=35)
  gender                = models.CharField(max_length=1, choices=GENDER_CHOICES)
  phone                 = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]+$')])
  accepts_new_patients  = models.CharField(max_length=3, choices=ACCEPTS_NEW_PATIENTS_CHOICES)

  def long_gender(self):
    if self.gender == 'M':
      return 'Male'
    elif self.gender == 'F':
      return 'Female'
    elif self.gender == '-':
      return 'Decline to Answer'

  def formatted_phone(self):
    num = self.phone
    return '(' + num[0:3] + ') ' + num[3:6] + ' - ' + num[6:]


class Appointment(models.Model):
  patient_id      = models.CharField(max_length=3)
  patient_name    = models.CharField(max_length=70)
  doctor_id       = models.CharField(max_length=3)
  doctor_name     = models.CharField(max_length=70)
  date            = models.DateField()
  time            = models.TimeField()
  notes           = models.TextField(blank=True, null=True)



  def status(self):
    current_date = datetime.date.today()
    current_time = datetime.datetime.now().time()
    if (self.date > current_date or (self.date == current_date and self.time > current_time)):
      return 'Upcoming'
    else:
      return 'Completed'
  

  def formatted_time(self):
    parsed = datetime.time.fromisoformat(str(self.time))
    formatted = parsed.strftime("%I:%M %p")
    return formatted