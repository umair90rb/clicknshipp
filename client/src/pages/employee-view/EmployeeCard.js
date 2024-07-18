import React from 'react';
import { Card, CardContent, Typography, Grid, Avatar } from '@mui/material';

export default function EmployeeCard({ employee }) {
  return (
    <Card sx={{ maxWidth: 345, textAlign: 'center', padding: 2 }}>
      <Avatar alt={employee.name} src={employee.profilePicture} sx={{ width: 128, height: 128, margin: 'auto' }} />
      <CardContent>
        <Typography variant="h4" component="div">
          {employee.name}
        </Typography>
        <Typography variant="h5" color="text.primary">
          Email: {employee.email}
        </Typography>
        <Typography variant="h5" color="text.primary">
          Phone: {employee.phone}
        </Typography>
        <Typography variant="h5" color="text.primary">
          Hire Date: {employee.hireDate}
        </Typography>
        <Typography variant="h5" color="text.primary">
          Department: {employee.department}
        </Typography>
        <Typography variant="h5" color="text.primary">
          Designation: {employee.designation}
        </Typography>
      </CardContent>
    </Card>
  );
}
