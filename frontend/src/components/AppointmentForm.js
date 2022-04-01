import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Box, Grid, Typography, Autocomplete, Button, TextField, Paper, FormControl, Stack, InputLabel, Select, MenuItem } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/lab';
import getCookie from '../getCookie';
import date from 'date-and-time';
import axios from 'axios';

const AppointmentForm = ({mode}) => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [ formValues, setFormValues ] = useState({
    patient_id: '',
    patient_name: '',
    doctor_id: '',
    doctor_name: '',
    date: date.format(new Date(), 'YYYY-MM-DD'),
    time: date.format(new Date(), 'HH:mm:ss'),
    notes: ''
  })
  const [ allPatients, setAllPatients ] = useState([]);
  const [ allDoctors, setAllDoctors ] = useState([]);
  const [ dateTime, setDateTime ] = useState(new Date());

    useEffect(() => {
      axios.get('/api/patients')
        .then(response => {
          const patients = response.data.map(patient => ({
            label: patient.firstname + ' ' + patient.lastname,
            id: patient.id
          }))
          setAllPatients(patients);
        })
      
        axios.get('/api/doctors')
        .then(response => {
          const doctors = response.data.map(doctor => ({
            label: doctor.firstname + ' ' + doctor.lastname,
            id: doctor.id
          }))
          setAllDoctors(doctors);
        })
  }, [])

  useEffect(() => {
    if (mode === 'Update') {
      axios.get(`/api/appointments/${id}`)
        .then(response => {
          setFormValues({
            patient_id: response.data.patient_id,
            patient_name: response.data.patient_name,
            doctor_id: response.data.doctor_id,
            doctor_name: response.data.doctor_name,
            date: response.data.date,
            time: response.data.time,
            notes: response.data.notes === null ? '' : response.data.notes
          })
        })
        .catch(error => navigate('/appointments'))
    } else if (mode === 'CreateFrom') {
      axios.get(`/api/appointments/create/${type}/${id}`)
        .then(response => {
          if (type === 'patients') {
            setFormValues(prev => ({
              ...prev,
              patient_id: response.data.patient_id,
              patient_name: response.data.firstname + ' ' + response.data.lastname,
            }))
          } else if (type === 'doctors') {
            setFormValues(prev => ({
              ...prev,
              doctor_id: response.data.doctor_id,
              doctor_name: response.data.firstname + ' ' + response.data.lastname,
            }))
          }
        })
    }
  }, [])
  
  const [ formErrors, setFormErrors ] = useState({
    patient_id: false,
    patient_name: false,
    doctor_id: false,
    doctor_name: false,
    date: false,
    time: false
  })
  const [ formIsValid, setFormIsValid ] = useState(false);

  const handleNotesChange = (e) => {
    setFormValues(prev => ({
      ...prev,
      notes: e.target.value
    }));
  }

  const handlePatientChange = (e) => {
    const fullname = e.target.textContent;
    const id = allPatients.find(patient => patient.label === fullname).id;
    setFormValues(prev => ({
      ...prev,
      patient_name: fullname,
      patient_id: id
    }));
    setFormErrors(prev => ({
      ...prev,
      patient_name: false,
      patient_id: false
    }));
  }

  const handleDoctorChange = (e) => {
    const fullname = e.target.textContent;
    const id = allDoctors.find(doctor => doctor.label === fullname).id;
    setFormValues(prev => ({
      ...prev,
      doctor_name: fullname,
      doctor_id: id
    }));
    setFormErrors(prev => ({
      ...prev,
      doctor_name: false,
      doctor_id: false
    }));
  }

  const handleDateTimeChange = (value) => {
    setDateTime(value);
    const parsed = date.parse(String(value), '    MMM DD YYYY HH:mm:ss...');
    const day = date.format(parsed, 'YYYY-MM-DD');
    const time = date.format(parsed, 'HH:mm:ss');
    setFormValues(prev => ({
      ...prev,
      date: day,
      time: time
    }));
    setFormErrors(prev => ({
      ...prev,
      date: false,
      time: false
    }));
  }

  const formatDateTime = () => {
    const full = String(formValues.date) + ' ' + String(formValues.time);
    const parsed = date.parse(full, 'YYYY-MM-DD HH:mm:ss');
    return parsed;
  }
  


  const validateAppointment = () => {
    // conditions that would cause errors
    return {
      patient_id: formValues.patient_id === '',
      patient_name: formValues.patient_name === '',
      doctor_id: formValues.doctor_id === '',
      doctor_name: formValues.doctor_name === '',
      date: formValues.date === '',
      time: formValues.time === '',
    }
  }

  const handleSave = () => {
    setFormErrors(prev => {
      const errors =  validateAppointment();
      setFormIsValid(!Object.values(errors).includes(true));
      return errors;
    })
  }

  useEffect(() => {
    if (formIsValid) {
      const url = mode === 'Create' ? '/api/appointments/create' : `/api/appointments/${id}`;
      const method = mode === 'Create' ? 'POST' : 'PATCH';
      const params = {
        method: method,
        url: url,
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        data: JSON.stringify({
          patient_id: formValues.patient_id,
          patient_name: formValues.patient_name,
          doctor_id: formValues.doctor_id,
          doctor_name: formValues.doctor_name,
          date: formValues.date,
          time: formValues.time,
          notes: formValues.notes
        }),
        mode: 'same-origin'
      };
      axios(params)
        .then(response => navigate(`/appointments/${response.data.id}`))
        .catch(error => navigate('/appointments'))

    }
  }, [formIsValid])

  return (
    <Stack alignItems='center' spacing={4}>
      <Typography variant='h3'>{mode === 'Update' ? 'Update' : 'Create'} Appointment</Typography>
      <Grid className='form-grid' container sx={{maxWidth: '600px', p: 3, mx: 'auto'}} spacing={3} component={Paper}>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            options={allPatients}
            onChange={handlePatientChange}
            
            fullWidth
            isOptionEqualToValue={(option, value) => option == value}
            renderInput={(params) => <TextField value={formValues.patient_name} {...params} required error={formErrors.patient_name || formErrors.patient_id} label="Select a patient" />}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            options={allDoctors}
            onChange={handleDoctorChange}
            
            fullWidth
            renderInput={(params) => <TextField value={formValues.doctor_name} {...params} required error={formErrors.doctor_name || formErrors.doctor_id}label="Select a doctor" />}
          />
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <MobileDateTimePicker
              label='Date + Time'
              value={dateTime}
              onChange={handleDateTimeChange}
              renderInput={(params) => <TextField {...params} required fullWidth error={formErrors.date || formErrors.time } />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <TextField  
            label='Notes' 
            fullWidth multiline rows={5}
            value={formValues.notes}
            onChange={handleNotesChange}
            />
          </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Link to={mode==='Create' ? '/appointments' : `/appointments/${id}`}><Button variant='contained' disableElevation>Cancel</Button></Link>
          <Button variant='contained' color='success' disableElevation onClick={handleSave}>Save</Button>
        </Grid>
      </Grid>
      </Stack>
  );
}

export default AppointmentForm;