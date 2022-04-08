import React, { useState } from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Navbar from './Navbar';
import CustomAlert from './CustomAlert';
import Home from './Home';
import List from './List';
import PersonDialog from './PersonDialog';
import AppointmentDialog from './AppointmentDialog';

import PatientForm from './PatientForm';
import DoctorForm from './DoctorForm';
import AppointmentForm from './AppointmentForm';

function App () {
  const [ alert, setAlert ] = useState({
    active: false,
    success: '', 
    error: ''
  });

  return (
    
    <Router>
    <Navbar />
    <main>
      <CustomAlert alert={alert} setAlert={setAlert} />
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="patients" element={ <List type='patients' setAlert={setAlert} /> } >
          <Route path=":id" element={ <PersonDialog type='patients' /> } />
        </Route>
        <Route path="patients/create" element={ <PatientForm mode='Create' /> } />
        <Route path="patients/:id/update" element={ <PatientForm mode='Update' /> } />
  

        <Route path="doctors" element={ <List type='doctors' setAlert={setAlert} /> } >
          <Route path=":id" element={ <PersonDialog type='doctors' /> } />
        </Route>
        <Route path="doctors/create" element={ <DoctorForm mode='Create' /> } />
        <Route path="doctors/:id/update" element={ <DoctorForm mode='Update' /> } />


        <Route path="appointments" element={ <List type='appointments' setAlert={setAlert} /> } >
          <Route path=":id" element={ <AppointmentDialog /> } />
        </Route>
        <Route path="appointments/create" element={ <AppointmentForm mode='Create' /> } />
        <Route path="appointments/create/:type/:id" element={ <AppointmentForm mode='CreateFrom' /> } />
        <Route path="appointments/:id/update" element={ <AppointmentForm mode='Update' /> } />
      </Routes>
      </main>
    </Router>
  );
}

export default App;