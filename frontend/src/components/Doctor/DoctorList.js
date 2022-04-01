import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Paper, Button, IconButton, Stack, Box, TextField, InputAdornment, Alert } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';


const DoctorList = ({setAlert}) => {
  const [ doctors, setDoctors ] = useState([]);
  const [ query, setQuery ] = useState('');
  const [ queryDoctors, setQueryDoctors ] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get('/api/doctors')
      .then(response => {
        setDoctors(response.data);
        setQueryDoctors(response.data);
      })
    axios.get('/api/alert')
      .then(response => {
        setAlert({
          active: true,
          success: response.data.success,
          error: response.data.error
        })
      })
  }, [location])

  const handlePatientClick = (e) => {
    navigate(`${e.id}`)
  }

  const handleQueryChange = (e) => {
    setQuery(e.target.value.toLowerCase());
  }

  useEffect(() => {
    const results = doctors.filter(patient => {
      const fullname = (patient.firstname + ' ' + patient.lastname).toLowerCase();
      return fullname.includes(query);
    })
    setQueryDoctors(results);
  }, [query])

  const rows = queryDoctors.map((patient, i) => ({
    id: patient.id,
    col1: patient.lastname,
    col2: patient.firstname,
    col3: patient.birthday,
    col4: patient.gender
  }))
  
  const columns= [
    { field: 'col1', headerName: 'Last Name', flex: 1},
    { field: 'col2', headerName: 'First Name', flex: 1},
    { field: 'col3', headerName: 'DOB', flex: 1},
    { field: 'col4', headerName: 'Gender', flex: 1},
  ];

  const rowsCondensed = queryDoctors.map((patient, i) => ({
    id: patient.id,
    col1: patient.lastname,
    col2: patient.firstname
  }))
  const columnsCondensed= [
    { field: 'col1', headerName: 'Last Name', flex: 1},
    { field: 'col2', headerName: 'First Name', flex: 1}
  ];

  return (
    <Stack spacing={4}>
      <Typography variant='h3'>
        Doctors
      </Typography> 
      <Stack direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 5 }}
        justifyContent={{ xs: 'center', sm: 'space-between' }}
        alignItems={{ xs: 'center', sm: 'flex-end' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%', flex: 1 }}>
          <SearchIcon sx={{ mr: 1, my: 0.5 }} />
          <TextField
            label="Search by name"
            variant='standard'
            fullWidth
            value={query}
            onChange={handleQueryChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="clear search" onClick={()=>setQuery('')}>
                <CloseOutlinedIcon />
              </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Link to='/doctors/create'>
          <Button variant='contained' color='success' startIcon={<PersonAddIcon />} sx={{ flex: 1}} >
            Create Patient
          </Button>
        </Link>
      </Stack>
      <Box sx={{ height: 500, width: '100%', display: { xs: 'none', sm: 'block'} }} component={Paper} >
    
        <DataGrid 
        
          className='patient-list'
          rows={rows} 
          columns={columns}
          disableColumnMenu 
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          isRowSelectable={() => {false}}
          onRowClick={handlePatientClick} 
          sx={{ px: '20px'}}/>
        
      </Box>
      <Box sx={{ height: 500, width: '100%', display: { xs: 'block', sm: 'none'}}} component={Paper} >
        <DataGrid 
          className='patient-list'
          rows={rowsCondensed} 
          columns={columnsCondensed} 
          disableColumnMenu 
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          isRowSelectable={() => {false}}
          onRowClick={handlePatientClick} 
          sx={{ px: '20px'}}/>
        </Box>
    <Outlet />
    </Stack>
  );
}

export default DoctorList;