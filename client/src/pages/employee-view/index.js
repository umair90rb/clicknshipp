import { useEffect, useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, Button, Chip, ButtonGroup } from '@mui/material';
import { useParams } from 'react-router-dom';
import CenterCircularLoader from 'components/CenterCircularLoader';
import EmployeeCard from './EmployeeCard';
import ImmediateContactsCard from './ImmediateContactCard';
import ExperienceCard from './ExperienceCard';
import EducationCard from './EducationCard';
import SalaryCard from './SalaryCard';
import IncrementHistoryCard from './IncrementHistoryCard';
const EmployeeView = () => {
  const { employeeId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const employee = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    hireDate: '2020-01-15',
    department: 'Engineering',
    designation: 'ABC',
    salary: '$100,000',
    profilePicture: 'https://via.placeholder.com/150'
  };

  const contacts = [
    {
      name: 'Jane Doe',
      phone: '123-456-7891',
      address: '123 Main St, Anytown, USA',
      relation: 'Spouse'
    },
    {
      name: 'Jim Smith',
      phone: '123-456-7892',
      address: '456 Oak St, Anytown, USA',
      relation: 'Brother'
    },
    {
      name: 'Lisa Johnson',
      phone: '123-456-7893',
      address: '789 Pine St, Anytown, USA',
      relation: 'Friend'
    }
  ];

  const experiences = [
    {
      company: 'Jane Doe',
      designation: '123-456-7891',
      started_at: '123 Main St, Anytown, USA',
      ended_at: 'Spouse'
    },
    {
      company: 'Jane Doe',
      designation: '123-456-7891',
      started_at: '123 Main St, Anytown, USA',
      ended_at: 'Spouse'
    },
    {
      company: 'Jane Doe',
      designation: '123-456-7891',
      started_at: '123 Main St, Anytown, USA',
      ended_at: 'Spouse'
    }
  ];

  const education = [
    {
      degree: 'Jane Doe',
      obtained: '123-456-7891',
      total: '123-456-7891',
      started_at: '123 Main St, Anytown, USA',
      ended_at: 'Spouse'
    },
    {
      degree: 'Jane Doe',
      obtained: '123-456-7891',
      total: '123-456-7891',
      started_at: '123 Main St, Anytown, USA',
      ended_at: 'Spouse'
    },
    {
      degree: 'Jane Doe',
      obtained: '123-456-7891',
      total: '123-456-7891',
      started_at: '123 Main St, Anytown, USA',
      ended_at: 'Spouse'
    }
  ];

  const allowances = [
    {
      type: 'Jane Doe',
      amount: '123-456-7891'
    },
    {
      type: 'Jane Doe',
      amount: '123-456-7891'
    },
    {
      type: 'Jane Doe',
      amount: '123-456-7891'
    },
    {
      type: 'Jane Doe',
      amount: '123-456-7891'
    }
  ];

  const increments = [
    {
      type: 'Jane Doe',
      amount: '123-456-7891',
      created_at: '1234234'
    },
    {
      type: 'Jane Doe',
      amount: '123-456-7891',
      created_at: '1234234'
    },
    {
      type: 'Jane Doe',
      amount: '123-456-7891',
      created_at: '1234234'
    },
    {
      type: 'Jane Doe',
      amount: '123-456-7891',
      created_at: '1234234'
    }
  ];

  const getEmployeeDetails = () => {};

  useEffect(() => {
    getEmployeeDetails();
  }, [employeeId]);

  if (loading) {
    return <CenterCircularLoader />;
  }

  if (error) {
    return <Typography variant="h4">Something goes wrong during getting order data!</Typography>;
  }

  return (
    <Grid container>
      <Grid item xs={3} md={3} lg={3} sx={{ border: '0px solid black' }}>
        <EmployeeCard employee={employee} />
        <Box component="section" sx={{ p: 1 }}></Box>
        <SalaryCard salary={1000} allowances={allowances} />
      </Grid>
      <Grid item xs={9} md={9} lg={9}>
        <ImmediateContactsCard contacts={contacts} />
        <Box component="section" sx={{ p: 1 }}></Box>
        <ExperienceCard experiences={experiences} />
        <Box component="section" sx={{ p: 1 }}></Box>
        <EducationCard education={education} />
        <Box component="section" sx={{ p: 1 }}></Box>
        <IncrementHistoryCard increments={increments} />
      </Grid>
    </Grid>
  );
};

export default EmployeeView;
