import React, { useState } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Navbar from './Navbar';
import Home from './Home';
import PersonList from './PersonList';
import PersonDialog from './PersonDialog';

import PatientForm from './Patient/PatientForm';
import DoctorForm from './Doctor/DoctorForm';
import PatientDialog from './Patient/PatientDialog';


import { Typography, AppBar, Box, Button, IconButton, Toolbar, Alert, Snackbar } from '@mui/material';
import { Grid } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

function App () {
  const [ alert, setAlert ] = useState({
    active: false,
    success: '', 
    error: ''
  });
  
  const handleAlertClose = () => {
    setAlert(prev => ({
      ...prev,
      active: false,
    }))
  }


  return (
    
    <Router>
    <Navbar />
    <main>
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
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="patients" element={ <PersonList type='patients' setAlert={setAlert} /> } >
          <Route path=":id" element={ <PersonDialog type='patients' /> } />
        </Route>
        <Route path="patients/create" element={ <PatientForm mode='Create' /> } />
        <Route path="patients/:id/update" element={ <PatientForm mode='Update' /> } />
  

        <Route path="doctors" element={ <PersonList type='doctors' setAlert={setAlert} /> } >
          <Route path=":id" element={ <PersonDialog type='doctors' /> } />
        </Route>
        <Route path="doctors/create" element={ <DoctorForm mode='Create' /> } />
        <Route path="doctors/:id/update" element={ <DoctorForm mode='Update' /> } />
      </Routes>
      </main>
    </Router>
  );
}

export default App;