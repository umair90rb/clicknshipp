import { useEffect, useRef } from 'react';

import { Autocomplete, Button, TextField, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateEmployee, fetchUpdateEmployee } from 'store/slices/employee/fetchEmployee';
import { fetchAllDepartment } from 'store/slices/department/fetchDepartment';
import { fetchAllDesignation } from 'store/slices/designation/fetchDesignation';
import { departmentIsLoadingSelector, departmentListSelector } from 'store/slices/department/departmentSelector';
import { designationIsLoadingSelector, designationListSelector } from 'store/slices/designation/designationSelector';
import { toSentence } from 'utils/string-utils';

const PersonalInfoForm = ({ setStep, setEmployeeId, employeeDataToUpdate }) => {
  const dispatch = useDispatch();

  const formRef = useRef();
  const departmentsList = useSelector(departmentListSelector);
  const departmentsListIsLoading = useSelector(departmentIsLoadingSelector);
  const designationList = useSelector(designationListSelector);
  const designationListIsLoading = useSelector(designationIsLoadingSelector);

  const createEmployee = async (values, setErrors, setStatus) => {
    const { type, payload } = await dispatch(fetchCreateEmployee({ body: values }));
    if (type === 'employee/create/fetch/fulfilled') {
      setEmployeeId(payload.data.employee.id);
      setStep((step) => ++step);
    } else {
      setStatus({ success: false });
      setErrors({ submit: payload.error.map((e) => toSentence(e)).join('. ') || 'Employee creation failed!' });
    }
  };

  const updatedEmployee = async (values, setErrors, setStatus) => {
    const { type, payload } = await dispatch(fetchUpdateEmployee({ id: employeeDataToUpdate.id, body: values }));
    if (type === 'employee/update/fetch/fulfilled') {
      setEmployeeId(payload.data.employee.id);
      setStep((step) => ++step);
    } else {
      setStatus({ success: false });
      setErrors({ submit: payload.error.map((e) => toSentence(e)).join('. ') || 'Employee update failed!' });
    }
  };

  const handleSubmit = (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);
    if (employeeDataToUpdate) {
      updatedEmployee(values, setErrors, setStatus);
    } else {
      createEmployee(values, setErrors, setStatus);
    }
    setSubmitting(true);
  };

  useEffect(() => {
    dispatch(fetchAllDepartment());
    dispatch(fetchAllDesignation());
  }, []);

  useEffect(() => {
    if (employeeDataToUpdate) {
      const {
        name,
        email,
        phone,
        hire_at,
        department: { id: department_id },
        designation: { id: designation_id },
        salary
      } = employeeDataToUpdate;
      formRef.current.setValues({ name, email, phone, hire_at, department_id, designation_id, salary });
    }
  }, [employeeDataToUpdate]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize={true}
      initialValues={{
        name: '',
        email: '',
        phone: '',
        hire_at: '',
        department_id: null,
        designation_id: null,
        salary: 0
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required('Name is required'),
        email: Yup.string().email('Must be a valid email'),
        phone: Yup.string().max(255).required('Phone is required'),
        hire_at: Yup.string().max(255).required('Hire date is required'),
        department_id: Yup.number().nullable(null).required('Department is required'),
        designation_id: Yup.number().nullable(null).required('Designation is required'),
        salary: Yup.number().required('Salary is required')
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, setFieldValue, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container sx={{ mt: 5, border: '0px solid black' }}>
            <Grid item container spacing={3}>
              <Grid item xs={4} md={4} lg={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="name">Name*</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Ali"
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  />
                  {touched.name && errors.name && (
                    <FormHelperText error id="helper-text-name">
                      {errors.name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={4} md={4} lg={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <OutlinedInput
                    id="email"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="ali@sukooon.com"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={4} md={4} lg={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="phone">Phone*</InputLabel>
                  <OutlinedInput
                    id="phone"
                    type="string"
                    value={values.phone}
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="04001244567"
                    fullWidth
                    error={Boolean(touched.phone && errors.phone)}
                  />
                  {touched.phone && errors.phone && (
                    <FormHelperText error id="helper-text-phone">
                      {errors.phone}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
            </Grid>

            <Grid item container mt={2} spacing={3}>
              <Grid item xs={3} md={3} lg={3}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="hire_at">Hired At*</InputLabel>
                  <OutlinedInput
                    id="hire_at"
                    type="date"
                    value={values.hire_at}
                    name="hire_at"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Ali"
                    fullWidth
                    error={Boolean(touched.hire_at && errors.hire_at)}
                  />
                  {touched.hire_at && errors.hire_at && (
                    <FormHelperText error id="helper-text-hire_at">
                      {errors.hire_at}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={3} md={3} lg={3}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="department_id">Department*</InputLabel>
                  <Autocomplete
                    options={departmentsList.map((department) => ({ id: department.id, label: department.name }))}
                    id="department_id"
                    name="department_id"
                    value={values.department_id ? departmentsList.find((department) => department.id === values.department_id)?.name : ''}
                    onBlur={handleBlur}
                    onChange={(event, newValue) => {
                      setFieldValue('department_id', newValue.id);
                    }}
                    openOnFocus
                    disableClearable
                    clearOnEscape
                    autoHighlight
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(touched.department_id && errors.department_id)}
                        InputProps={{
                          ...params.InputProps,
                          type: 'search',
                          placeholder: departmentsListIsLoading ? 'Loading...' : 'Select Department',
                          style: {
                            padding: 8
                          }
                        }}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  />
                  {touched.department_id && errors.department_id && (
                    <FormHelperText error id="helper-text-department_id">
                      {errors.department_id}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={3} md={3} lg={3}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="designation_id">Designation*</InputLabel>
                  <Autocomplete
                    options={designationList.map((designation) => ({ id: designation.id, label: designation.name }))}
                    id="designation_id"
                    name="designation_id"
                    value={
                      values.designation_id ? designationList.find((designation) => designation.id === values.designation_id)?.name : ''
                    }
                    onBlur={handleBlur}
                    onChange={(event, newValue) => {
                      setFieldValue('designation_id', newValue.id);
                    }}
                    openOnFocus
                    disableClearable
                    clearOnEscape
                    autoHighlight
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={Boolean(touched.designation_id && errors.designation_id)}
                        InputProps={{
                          ...params.InputProps,
                          type: 'search',
                          placeholder: designationListIsLoading ? 'Loading...' : 'Select Designation',
                          style: {
                            padding: 8
                          }
                        }}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  />
                  {touched.designation_id && errors.designation_id && (
                    <FormHelperText error id="helper-text-designation_id">
                      {errors.designation_id}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={3} md={3} lg={3}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="salary">Salary*</InputLabel>
                  <OutlinedInput
                    id="salary"
                    type="string"
                    value={values.salary}
                    name="salary"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="10,000"
                    fullWidth
                    error={Boolean(touched.salary && errors.salary)}
                  />
                  {touched.salary && errors.salary && (
                    <FormHelperText error id="helper-text-salary">
                      {errors.salary}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
            </Grid>

            <Grid item container my={3} spacing={3}>
              {errors.submit && (
                <Grid item xs={12} container justifyContent="start" alignItems="center">
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item container xs={12} justifyContent="end" alignItems="center">
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} size="large" type="submit" variant="contained" color="primary">
                    Save Employee Personal Info
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default PersonalInfoForm;
