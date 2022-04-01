import math
from django.urls import reverse
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from datetime import datetime, time, date, timedelta

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
    today = date.today()
    delta = today - self.birthday 
    year = timedelta(days = 365)
    age = math.trunc(delta / year)
    return age

  def long_gender(self):
    if self.gender == 'M':
      return 'Male'
    elif self.gender == 'F':
      return 'Female'
    elif self.gender == '-':
      return 'Decline to Answer'

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

  def availability_default():
    return {
      "days": []
    }

  firstname     = models.CharField(max_length=35, validators=[RegexValidator(r'^[a-zA-Z]+$')])
  lastname      = models.CharField(max_length=35, validators=[RegexValidator(r'^[a-zA-Z]+$')])
  gender        = models.CharField(max_length=1, choices=GENDER_CHOICES)
  phone         = models.CharField(max_length=10, validators=[RegexValidator(r'^[0-9]+$')])
  availability  = models.JSONField(default=availability_default)

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
  
  def formatted_availability(self):
    ref = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    days = self.availability["days"]
    days_str = ''
    for el in ref:
      if el in days:
        days_str += el + ', '
    return days_str[0:-2]


class Appointment(models.Model):
  patient_id      = models.CharField(max_length=3)
  patient_name    = models.CharField(max_length=70)
  doctor_id       = models.CharField(max_length=3)
  doctor_name     = models.CharField(max_length=70)
  date            = models.DateField()
  time            = models.TimeField()
  notes           = models.TextField(blank=True, null=True)


  def status(self):
    date_now = datetime.now().date()
    time_now = datetime.now().time()
    if self.date >= date_now and self.time > time_now:
      return 'Upcoming'
    else:
      return 'Completed'
  
  def formatted_time(self):
    parsed = time.fromisoformat(str(self.time))
    formatted = parsed.strftime("%I:%M %p")
    return formatted
    
