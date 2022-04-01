import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Box, Grid, Typography, Button, TextField, Paper, FormControl, FormControlLabel, FormLabel, 
  FormGroup, Checkbox, Stack, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, DesktopDatePicker } from '@mui/lab';
import getCookie from '../../getCookie';
import date from 'date-and-time';
import axios from 'axios';

const DoctorForm = ({mode}) => {
  const {id} = useParams();
  const navigate = useNavigate();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [ formValues, setFormValues ] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    phone: '',
    availability: []
  })

  const handleAvailabilityChange = (e) => {
    const day = e.target.value;
    if (!formValues.availability.includes(day)) {
      setFormValues(prev => ({
        ...prev, 
        availability: [...prev.availability, day]
      }))
    } else {
      setFormValues(prev => ({
        ...prev, 
        availability: prev.availability.filter(prevDay => prevDay !== day)
      }))
    }
  }

  useEffect(() => {
    if (mode === 'Update') {
      axios.get(`/api/doctors/${id}`)
        .then(response => {
          setFormValues({
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            gender: response.data.gender,
            phone: response.data.phone,
            availability: response.data.availability.days
          })
        })
        .catch(error => navigate('/patients'))
    }
  }, [])
  
  const [ formErrors, setFormErrors ] = useState({
    firstname: false,
    lastname: false,
    birthday: false, 
    gender: false,
    phone: false,
    availability: false
  })
  const [ formIsValid, setFormIsValid ] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    setFormErrors(prev => ({
      ...prev,
      [name]: false
    }));
  }

  const validateDoctor = () => {
    const numOnly = /^[0-9]+$/;

    // conditions that would cause errors
    return {
      firstname: formValues.firstname === '',
      lastname: formValues.lastname === '',
      gender: formValues.gender === '',
      phone: formValues.phone === '' || formValues.phone.length !== 10 || !formValues.phone.match(numOnly),
      availability: formValues.availability.length === 0
    }
  }

  const handleSave = () => {
    setFormErrors(prev => {
      const errors =  validateDoctor();
      setFormIsValid(!Object.values(errors).includes(true));
      return errors;
    })
  }


  useEffect(() => {
    if (formIsValid) {
      const url = mode === 'Create' ? '/api/doctors/create' : `/api/doctors/${id}`;
      const method = mode === 'Create' ? 'POST' : 'PATCH';
      const params = {
        method: method,
        url: url,
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        data: JSON.stringify({
          firstname: formValues.firstname,
          lastname: formValues.lastname,
          gender: formValues.gender,
          phone: formValues.phone,
          availability: {"days": formValues.availability}
        }),
        mode: 'same-origin'
      };
      axios(params)
        .then(response => navigate(`/doctors/${response.data.id}`))
        .catch(error => navigate('/doctors'))

    }
  }, [formIsValid])

  return (
    <Stack alignItems='center' spacing={4}>
      <Typography variant='h3'>{mode} Doctor</Typography>
      <Grid className='form-grid' container sx={{maxWidth: '600px', p: 3, mx: 'auto'}} spacing={3} component={Paper}>
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
          <FormControl error={formErrors.availability} component="fieldset" variant="standard" required>
            <FormLabel component="legend">Availability:</FormLabel>
              <ToggleButtonGroup
                value={formValues.availability}
                onChange={handleAvailabilityChange}
                aria-label="availability"
              >
                {days.map(day => 
              <ToggleButton value={day} aria-label={day} key={day} color='primary'>
                  {day}
              </ToggleButton>)}
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