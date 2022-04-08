import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import date from 'date-and-time';
import axios from 'axios';

import { Grid, Typography, Button, TextField, Paper, FormControl, Stack, InputLabel, Select, MenuItem } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, DesktopDatePicker } from '@mui/lab';

import getCookie from '../utils/getCookie';
import { toPyDate, toJSDate, toFullYear } from '../utils/convertDateTime';

const PatientForm = ({mode}) => {
  const {id} = useParams();
  const navigate = useNavigate();
  const fields = ['firstname', 'lastname', 'birthday', 'gender', 'weight', 'height_ft', 'height_in', 'phone'];

  const fieldDefaults = (value) => {
    const defaults = {};
    fields.forEach(field => defaults[field] = value);
    return defaults;
  }

  const [ formValues, setFormValues ] = useState(fieldDefaults(''));
  const [ formErrors, setFormErrors ] = useState(fieldDefaults(false));
  const [ formIsValid, setFormIsValid ] = useState(false);


  const populateForm = async() => {
    const response = await axios.get(`/api/patients/${id}`);
    const data = {};
    fields.forEach(field => data[field] = response.data[field]);
    setFormValues(data);
  }

  useEffect(() => {
    if (mode === 'Update') {
      populateForm();
    }
  }, [])
  

  // name, weight, height, phone
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: false }));
  }
  
  const handleBirthdayChange = (birthday) => {
    if (birthday) {
      const now = new Date();
      const year = birthday.getFullYear();
      setFormValues(prev => ({
        ...prev,
        birthday: birthday < now && year > 1000 ? toPyDate(birthday) : ''
      }));
    } else {
      setFormValues(prev => ({...prev, birthday: ''}));
    }
    setFormErrors(prev => ({ ...prev,  birthday: false }));
  }


  const patientErrors = () => {
    const numOnly = /^[0-9]+$/;
    return {
      firstname: formValues.firstname === '',
      lastname: formValues.lastname === '',
      birthday: formValues.birthday === '',
      gender: formValues.gender === '',
      height_ft: formValues.height_ft === '' || formValues.height_ft < 0 || !String(formValues.height_ft).match(numOnly),
      height_in: formValues.height_in === '' || formValues.height_in < 0 || formValues.height_in > 11 || !String(formValues.height_in).match(numOnly),
      weight: formValues.weight === '' || formValues.weight < 0 || !String(formValues.weight).match(numOnly),
      phone: formValues.phone === '' || formValues.phone.length !== 10 || !formValues.phone.match(numOnly),
    }
  }

  const handleSave = () => {
    setFormErrors(prev => {
      const errors =  patientErrors();
      setFormIsValid(!Object.values(errors).includes(true));
      return errors;
    })
  }

  const sendRequest = async() => {
    const url = mode === 'Create' ? '/api/patients/create' : `/api/patients/${id}`;
    const method = mode === 'Create' ? 'POST' : 'PATCH';
    const params = {
      method: method,
      url: url,
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      data: JSON.stringify(formValues),
      mode: 'same-origin'
    };
    await axios(params)
      .then(response => navigate(`/patients/${response.data.id}`))
      .catch(error => navigate('/patients'))
  }


  useEffect(() => {
    if (formIsValid) {
      sendRequest();
    }
  }, [formIsValid])

  return (
    <Stack alignItems='center' spacing={4}>
      <Typography variant='h3'>{mode} Patient</Typography>
      <Grid className='form-grid' container sx={{maxWidth: '550px', p: 3, mx: 'auto'}} spacing={3} component={Paper}>
        <Grid item xs={12} align='center'>
          <TextField  
            label='First Name' 
            name='firstname'
            required fullWidth 
            value={formValues.firstname}
            error={formErrors.firstname}
            onChange={handleFormChange}/>
          </Grid>
        <Grid item xs={12} align='center'>
          <TextField 
            error={formErrors.lastname}
            label='Last Name' 
            name='lastname' 
            required fullWidth 
            value={formValues.lastname}
            onChange={handleFormChange} />
        </Grid>
        <Grid item xs={12} sm={6} align='center'>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DesktopDatePicker
              label='Date of Birth'
              value={toJSDate(formValues.birthday)}
              onChange={handleBirthdayChange}
              disableOpenPicker={true}
              renderInput={(params) => <TextField {...params} required fullWidth error={formErrors.birthday} />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} align='center'>
        <FormControl required fullWidth error={formErrors.gender}>
          <InputLabel id="gender">Gender</InputLabel>
          <Select 
            align='left'
            labelId="gender"
            id="gender"
            label="gender"
            name='gender'
            value={formValues.gender}
            onChange={handleFormChange}
          >
            <MenuItem value='M'>Male</MenuItem>
            <MenuItem value={'F'}>Female</MenuItem>
            <MenuItem value={'-'}>Decline to Answer</MenuItem>
          </Select>
        </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} align='center'>
          <TextField 
            error={formErrors.weight}
            label='Weight (lbs)' 
            name='weight' 
            required fullWidth 
            value={formValues.weight}
            onChange={handleFormChange} />
        </Grid>
        <Grid item xs={6} sm={4} align='center'>
          <TextField 
            error={formErrors.height_ft}
            label='Height (ft)' 
            name='height_ft' 
            required fullWidth 
            value={formValues.height_ft}
            onChange={handleFormChange} />
          </Grid>
          <Grid item xs={6} sm={4} align='center'>
            <TextField 
              error={formErrors.height_in}
              label='Height (in)' 
              name='height_in' 
              required fullWidth 
              value={formValues.height_in}
              onChange={handleFormChange} />
          </Grid>
        <Grid item xs={12} align='center'>
          <TextField  
              error={formErrors.phone}
              label='Phone Number' 
              name='phone' 
              helperText='Format: 1234567890'
              required fullWidth 
              value={formValues.phone}
              onChange={handleFormChange} />
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Link to={mode==='Create' ? '/patients' : `/patients/${id}`}><Button variant='contained' disableElevation>Cancel</Button></Link>
          <Button variant='contained' color='success' disableElevation onClick={handleSave}>Save</Button>
        </Grid>
      </Grid>
      </Stack>
  );
}

export default PatientForm;