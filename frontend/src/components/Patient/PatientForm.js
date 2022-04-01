import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Box, Grid, Typography, Button, TextField, Paper, FormControl, Stack, InputLabel, Select, MenuItem } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, DesktopDatePicker } from '@mui/lab';
import getCookie from '../../getCookie';
import date from 'date-and-time';
import axios from 'axios';

const PatientForm = ({mode}) => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [ formValues, setFormValues ] = useState({
    firstname: '',
    lastname: '',
    birthday: '',
    gender: '',
    weight: '',
    height_ft: '',
    height_in: '',
    phone: ''
  })

  useEffect(() => {
    if (mode === 'Update') {
      axios.get(`/api/patients/${id}`)
        .then(response => {
          setFormValues({
            firstname: response.data.firstname,
            lastname: response.data.lastname,
            birthday: response.data.birthday, 
            gender: response.data.gender,
            weight: response.data.weight,
            height_ft: response.data.height_ft,
            height_in: response.data.height_in,
            phone: response.data.phone
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
    weight: false,
    height_ft: false,
    height_in: false,
    phone: false
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
  
  const handleBirthdayChange = (birthday) => {
    const parsed = date.parse(String(birthday), '    MMM DD YYYY...');
    const year = parsed.getFullYear();
    const formatted = date.format(parsed, 'YYYY-MM-DD');
    setFormValues(prev => ({
      ...prev,
      birthday: year <= 2022 ? formatted : ''
    }));
    setFormErrors(prev => ({
      ...prev,
      birthday: false
    }));
  }


  const formatBirthday = () => {
    const date = formValues.birthday.slice(8,10);
    const mon = formValues.birthday.slice(5,7);
    const yr = formValues.birthday.slice(0,4);
    return `${mon}-${date}-${yr}`;
  }

  const validatePatient = () => {
    const numOnly = /^[0-9]+$/;

    // conditions that would cause errors
    return {
      firstname: formValues.firstname === '',
      lastname: formValues.lastname === '',
      birthday: formValues.birthday === '',
      gender: formValues.gender === '',
      height_ft: formValues.height_ft === '' || formValues.height_ft < 0 || !String(formValues.height_ft).match(numOnly),
      height_in: formValues.height_in === '' || formValues.height_in < 0 || formValues.height_in > 12 || !String(formValues.height_in).match(numOnly),
      weight: formValues.weight === '' || formValues.weight < 0 || !String(formValues.weight).match(numOnly),
      phone: formValues.phone === '' || formValues.phone.length !== 10 || !formValues.phone.match(numOnly),
    }
  }

  const handleSave = () => {
    setFormErrors(prev => {
      const errors =  validatePatient();
      setFormIsValid(!Object.values(errors).includes(true));
      return errors;
    })
  }


  useEffect(() => {
    if (formIsValid) {
      const url = mode === 'Create' ? '/api/patients/create' : `/api/patients/${id}`;
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
          birthday: formValues.birthday,
          gender: formValues.gender,
          weight: formValues.weight,
          height_ft: formValues.height_ft,
          height_in: formValues.height_in,
          phone: formValues.phone
        }),
        mode: 'same-origin'
      };
      axios(params)
        .then(response => navigate(`/patients/${response.data.id}`))
        .catch(error => navigate('/patients'))

    }
  }, [formIsValid])

  return (
    <Stack alignItems='center' spacing={4}>
      <Typography variant='h3'>{mode} Patient</Typography>
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
        <Grid item xs={12} sm={6} align='center'>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DesktopDatePicker
              label='Date of Birth'
              value={formatBirthday()}
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