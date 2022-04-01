import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DialogTitle, Dialog, DialogContent, Button, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Stack, Box, DialogActions} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

import getCookie from '../getCookie';
import capitalize from '../capitalize';
import axios from 'axios';


const PersonDialog = ({type}) => {
  const { id } = useParams();
  const [ person, setPerson ] = useState({});
  const [ open, setOpen ] = useState(true);
  const [ deleteOpen, setDeleteOpen ] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get(`/api/${type}/${id}`)
      .then(response => setPerson(response.data))
      .catch(error => navigate(`/${type}`))
  }, [])

  const handleDialogClose = () => {
    setOpen(false);
    navigate(`/${type}`);
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
    axios.delete(`/api/${type}/${id}`, params)
      .then(response => handleDialogClose())
  }

  const handleEdit = () => {
    navigate(`/${type}/${id}/update`)
  }

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth>
      <DialogTitle>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
        {capitalize(type.slice(0, -1))} Details
        <IconButton aria-label='close' onClick={handleDialogClose}><CloseOutlinedIcon /></IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
        <TableContainer mt={5} sx={{ border: 1, borderColor: 'lightgray' }}>
          <Table aria-label='detail table'>
          <TableBody>
              <TableRow>
                <TableCell className='table-row-header'>Name:</TableCell>
                <TableCell>{person.firstname} {person.lastname}</TableCell>
              </TableRow>
              {type === 'patients' ?
              <TableRow>
                <TableCell className='table-row-header'>Date of Birth:</TableCell>
                <TableCell>{person.birthday}</TableCell>
              </TableRow>  : null}
              {type === 'patients' ?
              <TableRow>
                <TableCell className='table-row-header'>Age:</TableCell>
                <TableCell>{person.age}</TableCell>
              </TableRow> : null}
              <TableRow> 
                <TableCell className='table-row-header'>Gender:</TableCell>
                <TableCell>{person.long_gender}</TableCell>
              </TableRow>
              {type === 'patients' ?
              <TableRow>
                <TableCell className='table-row-header'>Weight:</TableCell>
                <TableCell>{person.weight} lbs</TableCell>
              </TableRow> : null}
              {type === 'patients' ?
              <TableRow>
                <TableCell className='table-row-header'>Height:</TableCell>
                <TableCell>{person.formatted_height}</TableCell>
              </TableRow> : null}
              <TableRow>
                <TableCell className='table-row-header'>Phone Number:</TableCell>
                <TableCell>{person.formatted_phone}</TableCell>
              </TableRow>
              {type === 'doctors' ?
              <TableRow>
                <TableCell className='table-row-header'>Availability:</TableCell>
                <TableCell>{person.formatted_availability}</TableCell>
              </TableRow> : null}
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
            Are you sure you want to delete this {type.slice(0, -1)}? This action cannot be undone.
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

export default PersonDialog;