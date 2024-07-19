import { useState } from 'react';
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

const steps = ['Add personal info', 'Add picture', 'Add education history', 'Add experiences', 'Add immediate contacts', 'Add allowances'];

const CreateEmployee = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [employeeId, setEmployeeId] = useState(null);

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <PersonalInfoForm setStep={setActiveStep} setEmployeeId={setEmployeeId} />;
      case 1:
        return <PictureForm setStep={setActiveStep} employeeId={employeeId} />;
      case 2:
        return <EducationHistoryForm setStep={setActiveStep} employeeId={employeeId} />;
      case 3:
        return <ExperienceHistoryForm setStep={setActiveStep} employeeId={employeeId} />;
      case 4:
        return <ImmediateContactForm setStep={setActiveStep} employeeId={employeeId} />;
      case 5:
        return <AllowanceForm employeeId={employeeId} />;
      default:
        break;
    }
  };

  return (
    <Grid item xs={12} md={12} lg={12}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">Add New Employee</Typography>
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
