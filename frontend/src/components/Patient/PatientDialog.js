import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DialogTitle, Dialog, DialogContent, Button, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Stack, Box, DialogActions} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

import getCookie from '../../getCookie';
import axios from 'axios';


const PatientDialog = () => {
  const { id } = useParams();
  const [ patient, setPatient ] = useState({});
  const [ open, setOpen ] = useState(true);
  const [ deleteOpen, setDeleteOpen ] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get(`/api/patients/${id}`)
      .then(response => setPatient(response.data))
      .catch(error => navigate('/patients'))
  }, [])

  const handleDialogClose = () => {
    setOpen(false);
    navigate('/patients');
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
    axios.delete(`/api/patients/${id}`, params)
      .then(response => handleDialogClose())
  }

  const handleEdit = () => {
    navigate(`/patients/${patient.id}/update`)
  }

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth>
      <DialogTitle align='right'>
        <IconButton aria-label='close' onClick={handleDialogClose}><CloseOutlinedIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
        <TableContainer component={Paper} mt={5}>
          <Table aria-label='patient detail table'>
          <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{patient.firstname} {patient.lastname}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date of Birth:</TableCell>
                <TableCell>{patient.birthday}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Age:</TableCell>
                <TableCell>{patient.age}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Gender:</TableCell>
                <TableCell>{patient.long_gender}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Weight:</TableCell>
                <TableCell>{patient.weight} lbs</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Height:</TableCell>
                <TableCell>{patient.formatted_height}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Phone Number:</TableCell>
                <TableCell>{patient.formatted_phone}</TableCell>
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
            Are you sure you want to delete this patient? This action cannot be undone.
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

export default PatientDialog;