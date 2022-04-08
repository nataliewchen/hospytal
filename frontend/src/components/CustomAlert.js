import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import axios from 'axios';


const CustomAlert = ({alert, setAlert}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getAlert = async() => {
    const response = await axios.get('/api/alert');
    setAlert({
      active: true,
      success: response.data.success,
      error: response.data.error
    })
  }

  useEffect(() => {
    getAlert();
  }, [location]);
  
  const handleAlertClose = () => {
    setAlert(prev => ({ ...prev, active: false }))
  }


  return (
    <div>
      {alert.success !== '' ? 
      <Snackbar anchorOrigin={{ vertical:'top', horizontal:'center' }} open={alert.active} autoHideDuration={5000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity='success' sx={{ width: '100%' }}>
          {alert.success}
        </Alert>
      </Snackbar> : ''}
      {alert.error !== '' ? 
      <Snackbar anchorOrigin={{ vertical:'top', horizontal:'center' }} open={alert.active} autoHideDuration={5000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity='error' sx={{ width: '100%' }}>
          {alert.error}
        </Alert>
      </Snackbar> : ''}
    </div>
  );
}

export default CustomAlert;