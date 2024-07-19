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
import { useDispatch } from '../../../node_modules/react-redux/es/exports';
import { fetchEmployee } from 'store/slices/employee/fetchEmployee';
const EmployeeView = () => {
  const { employeeId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({});
  const { contacts, experiences, education, allowances, increments, ...employee } = employeeData || {};
  const [error, setError] = useState('');

  const getEmployeeDetails = async (employeeId) => {
    try {
      setLoading(true);
      const { type, payload } = await dispatch(fetchEmployee({ id: employeeId }));
      if (type === 'employee/fetch/fulfilled') {
        setEmployeeData(payload.data.employee);
      } else {
        setError(payload.error || 'Something goes wrong! Try again');
      }
      setLoading(false);
    } catch (error) {
      setError(error || 'Something goes wrong! Try again');
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployeeDetails(employeeId);
  }, []);

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
        {contacts?.length > 0 && <ImmediateContactsCard contacts={contacts} />}
        <Box component="section" sx={{ p: 1 }}></Box>
        {experiences?.length > 0 && <ExperienceCard experiences={experiences} />}
        <Box component="section" sx={{ p: 1 }}></Box>
        {education?.length > 0 && <EducationCard education={education} />}
        <Box component="section" sx={{ p: 1 }}></Box>
        {increments?.length > 0 && <IncrementHistoryCard increments={increments} />}
      </Grid>
    </Grid>
  );
};

export default EmployeeView;
