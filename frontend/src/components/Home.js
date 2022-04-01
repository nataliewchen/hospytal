import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Stack, Box, Icon } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function HomePage() {
  return (
    <Stack spacing={2} sx={{ width: '300px' }} mx='auto'>
        <Link to="/patients">
          <Button fullWidth sx={{ height: '200px' }} variant='contained' align='center'>
            <Stack alignItems="center">
              <Icon sx={{ fontSize: 50}}>person</Icon>
              <h2>Patients</h2>
            </Stack>
          </Button>
        </Link>
    </Stack>
  );
}