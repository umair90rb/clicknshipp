import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularLoader({ height = '70vh' }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
      <CircularProgress />
    </Box>
  );
}
