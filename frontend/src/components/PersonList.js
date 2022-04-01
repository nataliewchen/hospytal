import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Paper, Button, IconButton, Stack, Box, TextField, InputAdornment, Alert } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import capitalize from '../capitalize';
import { useWidth } from '../hooks';


const PersonList = ({type, setAlert}) => {
  const [ people, setPeople ] = useState([]);
  const [ query, setQuery ] = useState('');
  const [ queryResults, setQueryResults ] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get(`/api/${type}`)
      .then(response => {
        setPeople(response.data);
        setQueryResults(response.data);
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

  const handleRowClick = (e) => {
    navigate(`${e.id}`)
  }

  const handleQueryChange = (e) => {
    setQuery(e.target.value.toLowerCase());
  }

  useEffect(() => {
    const results = people.filter(person => {
      const fullname = (person.firstname + ' ' + person.lastname).toLowerCase();
      const reverse = (person.lastname + ' ' + person.firstname).toLowerCase();
      return fullname.includes(query) || reverse.includes(query);
    })
    setQueryResults(results);
  }, [query])

  const rows = queryResults.map((person, i) => {
    const row = {
      id: person.id,
      col1: person.lastname,
      col2: person.firstname,
      col3: person.gender
    }
    if (type === 'patients') {
      row['col4'] = person.birthday
    }
    return row;
  })
  
  let columns= [
    { field: 'col1', headerName: 'Last Name', flex: 1},
    { field: 'col2', headerName: 'First Name', flex: 1},
    { field: 'col3', headerName: 'Gender', flex: 1},
  ];

  if (type === 'patients') {
    columns.push({field: 'col4', headerName: 'DOB', flex: 1})
  }

  const width = useWidth();
  if (width < 600) {
    columns = columns.slice(0,2);
  }


  const rowsCondensed = queryResults.map((person, i) => ({
    id: person.id,
    col1: person.lastname,
    col2: person.firstname
  }))
  const columnsCondensed= [
    { field: 'col1', headerName: 'Last Name', flex: 1},
    { field: 'col2', headerName: 'First Name', flex: 1}
  ];

  return (
    <Stack spacing={4}>
      <Typography variant='h3'>
        {capitalize(type)}
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
        <Link to={`/${type}/create`}>
          <Button variant='contained' color='success' startIcon={<PersonAddIcon />} sx={{ flex: 1}} >
            Create {type.slice(0, -1)}
          </Button>
        </Link>
      </Stack>
      <Box style={{ height: 500, width: '100%' }} component={Paper}>
        <DataGrid 
          className='person-list person-list'
          rows={rows} 
          columns={columns}
          disableColumnMenu 
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          isRowSelectable={() => {false}}
          onRowClick={handleRowClick} 
          sx={{ px: '20px'}} />
      </Box>
      <Outlet />
    </Stack>
  );
}

export default PersonList;