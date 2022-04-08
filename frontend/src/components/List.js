import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import { Typography, Paper, Button, IconButton, Stack, Box, TextField, InputAdornment } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SearchIcon from '@mui/icons-material/Search';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { DataGrid } from '@mui/x-data-grid';

import capitalize from '../utils/capitalize';
import { useWidth } from '../utils/hooks';
import getListData from '../utils/getListData';


const List = ({type}) => {
  const [ items, setItems ] = useState([]);
  const [ query, setQuery ] = useState('');
  const [ queryResults, setQueryResults ] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const width = useWidth();

  const { rows, columns } = getListData(type, queryResults, width);


  const getItems = async() => {
    try {
      const response = await axios.get(`/api/${type}`);
      setItems(response.data);
      setQueryResults(response.data);
    } catch (err) {
      navigate('/');
    }
  }

  const filterItems = () => {
    let results = []
    if (type === 'appointments') {
      results = items.filter(appt => appt.doctor_name.toLowerCase().includes(query) || appt.patient_name.toLowerCase().includes(query));
    } else {
      results = items.filter(person => {
        const fullname = (person.firstname + ' ' + person.lastname).toLowerCase();
        const reverse = (person.lastname + ' ' + person.firstname).toLowerCase();
        return fullname.includes(query) || reverse.includes(query);
      })
    }
    setQueryResults(results);
  }


  useEffect(() => {
    setQuery('');
    getItems();
  }, [location])

  useEffect(() => {
    filterItems();
  }, [query])


  const handleRowClick = (e) => {
    navigate(`${e.id}`)
  }

  const handleQueryChange = (e) => {
    setQuery(e.target.value.toLowerCase());
  }


  return (
    <Stack spacing={4}>
      <Typography variant='h3' style={{ fontSize: width < 600 ? '2.5rem' : '3rem'}}>
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
          <Button variant='contained' color='success' startIcon={type==='appointments' ? <EventAvailableIcon /> : <PersonAddIcon />} sx={{ flex: 1}} >
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

export default List;