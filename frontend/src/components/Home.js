import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Stack, Box, Icon } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function HomePage() {
  return (
    <Stack spacing={2}>
      <Typography variant='h4' style={{ fontWeight: 700, letterSpacing: '0.05em', borderBottom: '1px solid' }}>DASHBOARD</Typography>
      <Stack direction={{xs: 'column', md: 'row'}} spacing={{ xs: 2, lg: 5}} mx='auto' alignItems='center' justifyContent='center'>
          <Link to="/patients">
            <Button className='dashboard-btn' fullWidth sx={{ width: '275px', height: '200px' }} variant='contained' align='center' color='primary'>
              <Stack alignItems="center" justifyContent='center'>
                <PersonIcon style={{ fontSize: '5em'}} />
                <h2 style={{ marginBottom: 0}}>Patients</h2>
              </Stack>
            </Button>
          </Link>
          <Link to="/doctors">
            <Button className='dashboard-btn' fullWidth sx={{ width: '275px', height: '200px' }} variant='contained' color='success'>
              <Stack alignItems="center" justifyContent='center'>
                <MedicalServicesIcon style={{ fontSize: '5em'}} />
                <h2 style={{ marginBottom: 0}}>Doctors</h2>
              </Stack>
            </Button>
          </Link>
          <Link to="/appointments">
            <Button className='dashboard-btn' fullWidth sx={{ width: '275px', height: '200px' }} variant='contained' color='warning'>
              <Stack alignItems="center" justifyContent='center'>
                <CalendarMonthIcon style={{ fontSize: '5em'}} />
                <h2 style={{ marginBottom: 0}}>Appointments</h2>
              </Stack>
            </Button>
          </Link>
      </Stack>
    </Stack>
  );
}