import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import date from 'date-and-time';
import axios from 'axios';

import { Grid, Typography, Button, TextField, Paper, FormControl, FormLabel, Stack, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, DesktopDatePicker } from '@mui/lab';

import getCookie from '../utils/getCookie';


const DoctorForm = ({mode}) => {
  const {id} = useParams();
  const navigate = useNavigate();
  const fields = ['firstname', 'lastname', 'gender', 'phone', 'accepts_new_patients'];

  const fieldDefaults = (value) => {
    const defaults = {};
    fields.forEach(field => defaults[field] = value);
    return defaults;
  }

  const [ formValues, setFormValues ] = useState(fieldDefaults(''));
  const [ formErrors, setFormErrors ] = useState(fieldDefaults(false));
  const [ formIsValid, setFormIsValid ] = useState(false);


  const populateForm = async() => {
    const response = await axios.get(`/api/doctors/${id}`);
    const data = {};
    fields.forEach(field => data[field] = response.data[field]);
    setFormValues(data);
  }

  useEffect(() => {
    if (mode === 'Update') {
      populateForm();
    }
  }, [])
  

  // all fields
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev,  [name]: value }));
    setFormErrors(prev => ({   ...prev,   [name]: false }));
  }

  const doctorErrors = () => {
    const numOnly = /^[0-9]+$/;
    return {
      firstname: formValues.firstname === '',
      lastname: formValues.lastname === '',
      gender: formValues.gender === '',
      phone: formValues.phone === '' || formValues.phone.length !== 10 || !formValues.phone.match(numOnly),
      accepts_new_patients: formValues.accepts_new_patients === ''
    }
  }

  const handleSave = () => {
    setFormErrors(prev => {
      const errors =  doctorErrors();
      setFormIsValid(!Object.values(errors).includes(true));
      return errors;
    })
  }

  const sendRequest = async () => {
    const url = mode === 'Create' ? '/api/doctors/create' : `/api/doctors/${id}`;
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
      .then(response => navigate(`/doctors/${response.data.id}`))
      .catch(error => navigate('/doctors'))
  }


  useEffect(() => {
    if (formIsValid) {
      sendRequest();
    }
  }, [formIsValid])

  return (
    <Stack alignItems='center' spacing={4}>
      <Typography variant='h3'>{mode} Doctor</Typography>
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
        <Grid item xs={12} sm={5} align='center'>
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
        <Grid item xs={12} sm={7} align='center'>
          <TextField  
              error={formErrors.phone}
              label='Phone Number' 
              name='phone' 
              helperText='Format: 1234567890'
              required fullWidth 
              value={formValues.phone}
              onChange={handleFormChange} />
        </Grid>
        <Grid item xs={12}>
          <FormControl error={formErrors.accepts_new_patients} component="fieldset" variant="standard" required>
            <FormLabel component="legend">Accepts New Patients:</FormLabel>
              <ToggleButtonGroup
                exclusive
                value={formValues.accepts_new_patients}
                onChange={handleFormChange}
                aria-label="accepts new patients"
                style={{ margin: '0 auto'}}
              >
                <ToggleButton value='yes' aria-label='yes' name="accepts_new_patients" color='primary'>
                  yes
                </ToggleButton>
                <ToggleButton value='no' aria-label='no' name="accepts_new_patients" color='primary'>
                  no
                </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Link to={mode==='Create' ? '/doctors' : `/doctors/${id}`}><Button variant='contained' disableElevation>Cancel</Button></Link>
          <Button variant='contained' color='success' disableElevation onClick={handleSave}>Save</Button>
        </Grid>
      </Grid>
      </Stack>
  );
}

export default DoctorForm;