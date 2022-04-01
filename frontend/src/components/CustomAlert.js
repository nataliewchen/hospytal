import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';


const CustomAlert = ({alert, setAlert}) => {
  
  const handleAlertClose = () => {
    setAlert(prev => ({
      ...prev,
      active: false,
    }))
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
      <Snackbar anchorOrigin={{ vertical:'top', horizontal:'center' }} open={alert.active} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity='error' sx={{ width: '100%' }}>
          {alert.error}
        </Alert>
      </Snackbar> : ''}
    </div>
  );
}

export default CustomAlert;