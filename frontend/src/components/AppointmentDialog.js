import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DialogTitle, Dialog, DialogContent, Button, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Stack, Box, DialogActions} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

import getCookie from '../getCookie';
import capitalize from '../capitalize';
import axios from 'axios';
import date from 'date-and-time';


const AppointmentDialog = () => {
  const { id } = useParams();
  const [ appt, setAppt ] = useState({});
  const [ open, setOpen ] = useState(true);
  const [ deleteOpen, setDeleteOpen ] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get(`/api/appointments/${id}`)
      .then(response => {
        let formatted = date.parse(String(response.data.time), 'HH:mm:ss');
        formatted = date.format(formatted, 'h:mm A');

        setAppt({
          ...response.data,
          formatted_time: formatted
        })
      })
      .catch(error => navigate(`/appointments`))
  }, [])

  const handleDialogClose = () => {
    setOpen(false);
    navigate(`/appointments`);
  }

  const handleDeleteDialogClose = () => {
    setDeleteOpen(false);
  };
  
  const handleDelete = () => {
    const params = {
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
    }
    axios.delete(`/api/appointments/${id}`, params)
      .then(response => handleDialogClose())
  }

  const handleEdit = () => {
    navigate(`/appointments/${id}/update`)
  }

  return (
    <Dialog className='appt-dialog' open={open} onClose={handleDialogClose} fullWidth>
      <DialogTitle>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
        Appointment Details
        <IconButton aria-label='close' onClick={handleDialogClose}><CloseOutlinedIcon /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
        <TableContainer mt={5} sx={{ border: 1, borderColor: 'lightgray' }}>
          <Table aria-label='detail table'>
          <TableBody>
              <TableRow>
                <TableCell className='table-row-header'>Patient Name:</TableCell>
                <TableCell><Link className='text-link' to={`/patients/${appt.patient_id}`}>{appt.patient_name}</Link></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='table-row-header'>Doctor Name:</TableCell>
                <TableCell><Link className='text-link' to={`/patients/${appt.doctor_id}`}>{appt.doctor_name}</Link></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='table-row-header'>Date:</TableCell>
                <TableCell>{appt.date}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='table-row-header'>Time:</TableCell>
                <TableCell>{appt.formatted_time}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='table-row-header'>Status:</TableCell>
                <TableCell>{appt.status}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='table-row-header'>Notes:</TableCell>
                <TableCell className='wide-cell'>{appt.notes}</TableCell>
              </TableRow>
              
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction='row' justifyContent='center' spacing={1}>
                    <Button variant='outlined' size='small' startIcon={<EditOutlinedIcon />} color='primary' disableElevation onClick={handleEdit}>
                      Edit
                    </Button>
                    <Button variant='outlined' size='small' startIcon={<DeleteIcon />} color='error' disableElevation onClick={()=> {setDeleteOpen(true)}}>
                      Delete
                    </Button>
                  </Stack>
        </Stack>
        
      </DialogContent>
      <Dialog
        open={deleteOpen}
        onClose={handleDeleteDialogClose}
        aria-describedby="delete-patient-confirmation"
        maxWidth='xs'
      >
        <DialogContent>
            Are you sure you want to delete this appointment? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button color='error' onClick={handleDelete} autoFocus>
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}

export default AppointmentDialog;