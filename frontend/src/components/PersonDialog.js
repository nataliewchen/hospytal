import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, Tab, DialogTitle, Dialog, DialogContent, Button, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Stack, Box, DialogActions} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { DataGrid } from '@mui/x-data-grid';

import getCookie from '../utils/getCookie';
import capitalize from '../utils/capitalize';
import axios from 'axios';
import { useWidth } from '../utils/hooks';


const PersonDialog = ({type}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const width = useWidth();

  const [ person, setPerson ] = useState({ firstname: '', lastname: ''});
  const [ open, setOpen ] = useState(true);
  const [ deleteOpen, setDeleteOpen ] = useState(false);
  const [ rows, setRows ] = useState([]);
  const [ tab, setTab ] = useState('Details');


  const getDetails = async() => {
    try {
      const response = await axios.get(`/api/${type}/${id}`);
      setPerson(response.data);
    } catch {
      navigate(`/${type}`)
    }
  }

  const getAppts = async() => {
    const response = await axios.get(`/api/appointments/${type}/${id}`);
    const rows = response.data.map(appt => ({
      id: appt.id,
      col1: type === 'patients' ? appt.doctor_name : appt.patient_name,
      col2: String(appt.date) + ' ' + String(appt.formatted_time)
    }));
    setRows(rows);
  }

  
  useEffect(() => {
    getDetails();
    getAppts();
  }, [])


  const handleDialogClose = () => {
    setOpen(false);
    navigate(`/${type}`);
  }

  const handleDeleteDialogClose = () => {
    setDeleteOpen(false);
  };

  const handleTabChange = (e, value) => {
    setTab(value);
  }
  
  const handleCreateAppt = () => {
    navigate(`/appointments/create/${type}/${id}`);
  }

  const handleDelete = async () => {
    const params = {
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
    }
    try {
      const response = await axios.delete(`/api/${type}/${id}`, params)
      handleDialogClose();
    } catch {
      navigate(`/${type}/${id}`)
    }
  }

  const handleEdit = () => {
    navigate(`/${type}/${id}/update`)
  }

  const handleApptClick = (e) => {
    navigate(`/appointments/${e.id}`)
  }

  //for data grid
  let columns= [
    { field: 'col1', headerName: type === 'patients' ? 'Doctor' : 'Patient', flex: 1},
    { field: 'col2', headerName: 'Date & Time', flex: 1},
  ];

  if (width < 600) {
    columns = columns.slice(1);
  }

  const patientTable = [
    { header: 'Name:',          content: person.firstname + ' ' + person.lastname },
    { header: 'Date of Birth:', content: person.birthday },
    { header: 'Age:',           content: person.age },
    { header: 'Gender:',        content: person.long_gender },
    { header: 'Weight:',        content: person.formatted_weight },
    { header: 'Height:',        content: person.formatted_height },
    { header: 'Phone Number:',  content: person.formatted_phone }
  ]
  const doctorTable = [
    { header: 'Name:',                  content: person.firstname + ' ' + person.lastname },
    { header: 'Gender:',                content: person.long_gender },
    { header: 'Phone Number:',          content: person.formatted_phone },
    { header: 'Accepts New Patients:',  content: person.accepts_new_patients }
  ]


  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth scoll='paper' className='person-dialog'>
      <DialogTitle>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} aria-label="dialog navigation" onChange={handleTabChange}>
          <Tab label="Details" value="Details" />
          <Tab label={width < 400 ? 'Appts' : 'Appointments'} value="Appointments"  />
          </Tabs>
        </Box>
        <IconButton aria-label='close' onClick={handleDialogClose}><CloseOutlinedIcon /></IconButton>
        </Stack>
        
      </DialogTitle>
      <DialogContent >
        <Stack spacing={3} sx={{ display: tab === 'Details' ? 'block' : 'none'}}>
          <TableContainer mt={5} sx={{ border: 1, borderColor: 'lightgray' }}>
            <Table aria-label='detail table'>
            <TableBody>
              {type === 'patients' ? patientTable.map((row, i) => 
              <TableRow key={i}>
                <TableCell className='table-row-header'>{row.header}</TableCell>
                <TableCell>{row.content}</TableCell>
              </TableRow>
              ) : null}
              {type === 'doctors' ? doctorTable.map((row, i) => 
              <TableRow key={i}>
                <TableCell className='table-row-header'>{row.header}</TableCell>
                <TableCell>{row.content}</TableCell>
              </TableRow>
              ) : null}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction={{ xs: 'column', sm: 'row'}} justifyContent='center' alignItems='center' spacing={1}>
            <Button style={{ width: '130px' }} variant='outlined' size='small' startIcon={<EventAvailableIcon />} color='success' disableElevation onClick={handleCreateAppt}>
              Schedule
            </Button>
            <Button style={{ width: '130px' }} variant='outlined' size='small' startIcon={<EditOutlinedIcon />} color='primary' disableElevation onClick={handleEdit}>
              Edit
            </Button>
            <Button style={{ width: '130px' }} variant='outlined' size='small' startIcon={<DeleteIcon />} color='error' disableElevation onClick={()=> {setDeleteOpen(true)}}>
              Delete
            </Button>
          </Stack>
        </Stack>
        <Box style={{ height: tab === 'Appointments' ? '100%' : '0px', opacity: tab === 'Appointments' ? 1 : 0 }}>
          {rows.length === 0 ? <Box p={5}>No appointments to show</Box> : 
          <Box style={{ width: '100%' }} component={Paper}>
            <DataGrid 
              className='person-list person-list'
              rows={rows} 
              columns={columns}
              autoHeight
              hideFooter
              scroll='paper'
              disableColumnMenu 
              pageSize={5}
              rowsPerPageOptions={[5]}
              onRowClick={handleApptClick}
              isRowSelectable={() => {false}}
              sx={{ px: '20px' }} />
          </Box>}
        </Box>
          
    

          
      </DialogContent>
      <Dialog
        open={deleteOpen}
        onClose={handleDeleteDialogClose}
        aria-describedby="delete-patient-confirmation"
        maxWidth='xs'
      >
        <DialogContent>
            Are you sure you want to delete this {type.slice(0, -1)} and all associated appointments? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button color='error' onClick={handleDelete} autoFocus>Yes, delete</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}

export default PersonDialog;