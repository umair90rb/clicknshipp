import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import PersonalInfoForm from './PersonalInfoForm';
import EducationHistoryForm from './EducationHistoryForm';
import ExperienceHistoryForm from './ExperienceHistoryForm';
import ImmediateContactForm from './ImmediateContactForm';
import AllowanceForm from './AllowanceForm';
import PictureForm from './PictureForm';
import { fetchEmployee } from 'store/slices/employee/fetchEmployee';
import { setMessage } from 'store/slices/util/utilSlice';

const steps = ['Add personal info', 'Add picture', 'Add education history', 'Add experiences', 'Add immediate contacts', 'Add allowances'];

const CreateEmployee = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { employeeId: employeeIdFromParam } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);

  const fetchUserForUpdate = async (id) => {
    const { payload, type } = await dispatch(fetchEmployee({ id }));
    if (type === 'employee/fetch/fulfilled') {
      setEmployeeData(payload.data.employee);
    } else {
      dispatch(setMessage({ message: 'Error in fetching employee data to update, try again!', type: 'error' }));
    }
  };

  useEffect(() => {
    if (employeeIdFromParam && pathname.indexOf('update') > -1) {
      setEmployeeId(employeeIdFromParam);
      fetchUserForUpdate(employeeIdFromParam);
    }
  }, []);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <PersonalInfoForm setStep={setActiveStep} setEmployeeId={setEmployeeId} employeeDataToUpdate={employeeData} />;
      case 1:
        return <PictureForm setStep={setActiveStep} employeeId={employeeId} employeeDataToUpdate={employeeData} />;
      case 2:
        return <EducationHistoryForm setStep={setActiveStep} employeeId={employeeId} employeeDataToUpdate={employeeData} />;
      case 3:
        return <ExperienceHistoryForm setStep={setActiveStep} employeeId={employeeId} employeeDataToUpdate={employeeData} />;
      case 4:
        return <ImmediateContactForm setStep={setActiveStep} employeeId={employeeId} employeeDataToUpdate={employeeData} />;
      case 5:
        return <AllowanceForm employeeId={employeeId} employeeDataToUpdate={employeeData} />;
      default:
        break;
    }
  };

  return (
    <Grid item xs={12} md={12} lg={12}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">
            {employeeIdFromParam && pathname.indexOf('update') > -1 ? 'Update Employee' : 'Add New Employee'}
          </Typography>
        </Grid>
      </Grid>
      <MainCard sx={{ mt: 1, p: 3 }} content={true}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStep()}
      </MainCard>
    </Grid>
  );
};

export default CreateEmployee;
