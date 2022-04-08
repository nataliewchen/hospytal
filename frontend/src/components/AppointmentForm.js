import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import date from 'date-and-time';
import axios from 'axios';

import { Grid, Typography, Autocomplete, Button, TextField, Paper, FormControl, Stack, InputLabel, Select, MenuItem } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, DesktopDatePicker } from '@mui/lab';

import getCookie from '../utils/getCookie';
import { toPyDate, toPyTime, toJSDate, toJSTime, toFullYear } from '../utils/convertDateTime';
import isValidDate from '../utils/isValidDate';

const AppointmentForm = ({mode}) => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const fields = ['patient_id', 'patient_name', 'doctor_id', 'doctor_name', 'date', 'time', 'notes'];

  const fieldDefaults = (value) => {
    const defaults = {};
    fields.forEach(field => defaults[field] = value);
    defaults.date = new Date();
    return defaults;
  }

  const [ formValues, setFormValues ] = useState(fieldDefaults(''))
  const [ allPatients, setAllPatients ] = useState([]);
  const [ allDoctors, setAllDoctors ] = useState([]);
  const [ formErrors, setFormErrors ] = useState(fieldDefaults(false));
  const [ formIsValid, setFormIsValid ] = useState(false);


  const getAllPatients = async() => {
    const response = await axios.get('/api/patients');
    const patients = [{ label: '', id: null }];
    response.data.forEach(patient => {
      patients.push({
        label: patient.firstname + ' ' + patient.lastname,
        id: patient.id,
      });
    });
    setAllPatients(patients);
  }

  const getAllDoctors = async() => {
    const response = await axios.get('/api/doctors');
    const doctors = [{label: '', id: null}];
    response.data.forEach(doctor => {
      doctors.push({
        label: doctor.firstname + ' ' + doctor.lastname,
        id: doctor.id
      })
    });
    setAllDoctors(doctors);
  }

  const populateFormfromAppt = async() => {
    const response = await axios.get(`/api/appointments/${id}`);
    setFormValues({
      ...response.data,
      date: toJSDate(response.data.date)
    });
  }

  const populateFormfromPerson = async() => {
    const response = axios.get(`/api/appointments/create/${type}/${id}`);
    if (type === 'patients') {
      setFormValues(prev => ({
        patient_id: response.data.id,
        patient_name: response.data.firstname + ' ' + response.data.lastname,
      }))
    } else if (type === 'doctors') {
      setFormValues(prev => ({
        doctor_id: response.data.id,
        doctor_name: response.data.firstname + ' ' + response.data.lastname,
      }))
    }
  }

  useEffect(() => {
    getAllPatients();
    getAllDoctors();

    if (mode === 'Update') {
      populateFormfromAppt();
    } else if (mode === 'Create From') {
      populateFormfromPerson();
    }
  }, [])
  


  const handlePatientChange = (e, value) => {
    setFormValues(prev => ({
      ...prev,
      patient_name: value.label,
      patient_id: value.id
    }));
    setFormErrors(prev => ({
      ...prev,
      patient_name: false,
      patient_id: false
    }));
  }

  const handleDoctorChange = (e, value) => {
    setFormValues(prev => ({
      ...prev,
      doctor_name: value.label,
      doctor_id: value.id
    }));
    setFormErrors(prev => ({
      ...prev,
      doctor_name: false,
      doctor_id: false
    }));
  }

  
  const handleDateChange = (value) => {
    if (value) {
      // console.log('v', value, 'f', formValues.date)
      // const diff = date.subtract(new Date(), value).toSeconds();
      // console.log(new Date(), value);
      // console.log(diff);
      // if (diff > 10 || diff < 0) {
        const year = toFullYear(value);
        //const formatted = toPyDate(value);
        setFormValues(prev => ({
          ...prev,
          date: year > 1000 ? value : ''
        }));
        setFormErrors(prev => ({
          ...prev,
          date: false
        }));
      // }      
    } else {
      setFormValues(prev => ({...prev, date: ''}));
    }
  }

  // time, notes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev,  [name]: value }));
    setFormErrors(prev => ({   ...prev,   [name]: false }));
  }


  const apptErrors = () => {
    return {
      patient_id: formValues.patient_id === '',
      patient_name: formValues.patient_name === '',
      doctor_id: formValues.doctor_id === '',
      doctor_name: formValues.doctor_name === '',
      date: formValues.date === '',
      time: formValues.time === ''
    }
  }

  const handleSave = () => {
    setFormErrors(prev => {
      const errors =  apptErrors();
      setFormIsValid(!Object.values(errors).includes(true));
      return errors;
    })
  }



  const checkDoctorEquality = (option, value) => {
    if (formValues.doctor_id) {
      return option.label === value && option.id === formValues.doctor_id;
    } else {
      return option.label === value;
    }
  }

  const checkPatientEquality = (option, value) => {
    if (formValues.patient_id) {
      return option.label === value && option.id === formValues.patient_id;
    } else {
      return option.label === value;
    }
  }

  let apptTimes = [];
  const getTimes= () => {
    for (let i=9; i<18; ++i) {
      apptTimes.push({
        value: `${i}:00:00`,
        label: `${i > 12 ? i % 12 : i}:00 ${i < 11 ? 'am' : 'pm'}`
      });
      apptTimes.push({
        value: `${i}:30:00`,
        label: `${i > 12 ? i % 12 : i}:30 ${i < 11 ? 'am' : 'pm'}` 
      })
    }
    apptTimes.pop();
  }
  getTimes();


  useEffect(() => {
    if (formIsValid) {
      const url = mode === 'Update' ? `/api/appointments/${id}` : `/api/appointments/create`;
      const method = mode === 'Update' ? 'PATCH' : 'POST';
      const params = {
        method: method,
        url: url,
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        data: JSON.stringify({
          ...formValues,
          date: toPyDate(formValues.date)
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
      <Grid className='form-grid' container sx={{maxWidth: '550px', p: 3, mx: 'auto'}} spacing={3} component={Paper}>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            disableClearable
            options={allPatients}
            onChange={handlePatientChange}
            value={formValues.patient_name}
            fullWidth
            isOptionEqualToValue={checkPatientEquality}
            renderInput={(params) => <TextField {...params} required error={formErrors.patient_name || formErrors.patient_id} label="Select a patient" />}
            renderOption={(props, option) => ( <li {...props} key={option.id}>{option.label}</li> )}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            disablePortal
            disableClearable
            options={allDoctors}
            onChange={handleDoctorChange}
            value={formValues.doctor_name}
            fullWidth
            isOptionEqualToValue={checkDoctorEquality}
            renderInput={(params) => <TextField {...params} value={formValues.doctor_name} required error={formErrors.doctor_name || formErrors.doctor_id} label="Select a doctor" />}
            renderOption={(props, option) => ( <li {...props} key={option.id}>{option.label}</li> )}         
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DesktopDatePicker
              label="Date"
              allowSameDateSelection
              disableCloseOnSelect={false}
              value={formValues.date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField required error={formErrors.date} fullWidth {...params} />} 
            />
          </LocalizationProvider>
          
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl required fullWidth error={formErrors.time}>
            <InputLabel id="time">Time</InputLabel>
            <Select
              name='time'
              labelId="time"
              id="time"
              value={formValues.time}
              label="time"
              align='left'
              onChange={handleFormChange}
            >
               {apptTimes.map((time, i) => 
                <MenuItem key={i} value={time.value}>{time.label}</MenuItem>)} 
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField  
            name='notes'
            label='Notes' 
            fullWidth multiline rows={5}
            value={formValues.notes}
            onChange={handleFormChange}
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