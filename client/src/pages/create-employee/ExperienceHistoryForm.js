import { Button, Box, TextField, FormHelperText, Grid, FormControl, Divider } from '@mui/material';
import * as Yup from 'yup';
import { Formik, ErrorMessage, FieldArray } from 'formik';
import { useDispatch } from 'react-redux';
import { fetchCreateEmployeeExperience } from 'store/slices/employee/fetchEmployee';
import { toSentence } from 'utils/string-utils';

const ExperienceHistoryForm = ({ employeeId, setStep }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);
    const { type, payload } = await dispatch(fetchCreateEmployeeExperience({ body: values }));
    if (type === 'employee/experience/create/fetch/fulfilled') {
      setSubmitting(false);
      setStep((step) => ++step);
    } else {
      setStatus({ success: false });
      setErrors({ submit: payload.error.map((e) => toSentence(e)).join('. ') || 'Employee experience not added!' });
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        experience: [{ company: '', started_at: '', ended_at: '', designation: '', employee_id: employeeId || 1 }]
      }}
      validationSchema={Yup.object().shape({
        experience: Yup.array()
          .of(
            Yup.object().shape({
              employee_id: Yup.number().required('Please add employee personal info in previous step first'),
              company: Yup.string().required('Please enter company'),
              designation: Yup.string().required('Please add designation'),
              started_at: Yup.string().required('Please enter start date'),
              ended_at: Yup.string().required('Please enter end date')
            })
          )
          .min(1, 'Please add minimum 1 experience')
      })}
      onSubmit={handleSubmit}
    >
      {(addExperienceForm) => (
        <Grid container mt={5}>
          <FieldArray
            validateOnChange={false}
            name="experience"
            render={(arrayHelper) =>
              addExperienceForm.values.experience &&
              addExperienceForm.values.experience.length > 0 &&
              addExperienceForm.values.experience.map((item, index) => (
                <>
                  <Grid item key={index} container margin={1} spacing={1}>
                    <Grid item xs={4}>
                      <FormControl fullWidth margin="normal">
                        <TextField
                          error={
                            addExperienceForm.touched.experience &&
                            addExperienceForm.touched.experience[index] &&
                            addExperienceForm.touched.experience[index].company &&
                            !!addExperienceForm.errors.experience &&
                            !!addExperienceForm.errors.experience[index] &&
                            !!addExperienceForm.errors.experience[index].company
                          }
                          value={item.company}
                          onChange={addExperienceForm.handleChange}
                          type="text"
                          id={`experience.${index}.company`}
                          name={`experience.${index}.company`}
                          label="Company"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`experience.${index}.company`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-company">
                              {msg}
                            </FormHelperText>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl fullWidth margin="normal">
                        <TextField
                          error={
                            addExperienceForm.touched.experience &&
                            addExperienceForm.touched.experience[index] &&
                            addExperienceForm.touched.experience[index].started_at &&
                            !!addExperienceForm.errors.experience &&
                            !!addExperienceForm.errors.experience[index] &&
                            !!addExperienceForm.errors.experience[index].started_at
                          }
                          value={item.started_at}
                          onChange={addExperienceForm.handleChange}
                          type="date"
                          placeholder=""
                          id={`experience.${index}.started_at`}
                          name={`experience.${index}.started_at`}
                          label="Started At"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`experience.${index}.started_at`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-started_at">
                              {msg}
                            </FormHelperText>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl fullWidth margin="normal">
                        <TextField
                          error={
                            addExperienceForm.touched.experience &&
                            addExperienceForm.touched.experience[index] &&
                            addExperienceForm.touched.experience[index].ended_at &&
                            !!addExperienceForm.errors.experience &&
                            !!addExperienceForm.errors.experience[index] &&
                            !!addExperienceForm.errors.experience[index].ended_at
                          }
                          value={item.ended_at}
                          onChange={addExperienceForm.handleChange}
                          type="date"
                          id={`experience.${index}.ended_at`}
                          name={`experience.${index}.ended_at`}
                          label="Ended At"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`experience.${index}.ended_at`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-ended_at">
                              {msg}
                            </FormHelperText>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid item key={index} container margin={1} spacing={1}>
                    <Grid item xs={6}>
                      <FormControl fullWidth margin="normal">
                        <TextField
                          error={
                            addExperienceForm.touched.experience &&
                            addExperienceForm.touched.experience[index] &&
                            addExperienceForm.touched.experience[index].designation &&
                            !!addExperienceForm.errors.experience &&
                            !!addExperienceForm.errors.experience[index] &&
                            !!addExperienceForm.errors.experience[index].designation
                          }
                          value={item.designation}
                          onChange={addExperienceForm.handleChange}
                          type="text"
                          id={`experience.${index}.designation`}
                          name={`experience.${index}.designation`}
                          label="Designation"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`experience.${index}.designation`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-designation">
                              {msg}
                            </FormHelperText>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item container alignItems="center" justifyContent="center" display="flex" xs={3}>
                      <Button
                        size="small"
                        onClick={() => arrayHelper.push({ employee_id: employeeId, degree: '', started_at: '', ended_at: '' })}
                        color="primary"
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Grid>
                    <Grid item container alignItems="center" justifyContent="center" display="flex" xs={3}>
                      <Button
                        size="small"
                        onClick={() => addExperienceForm.values.experience.length > 1 && arrayHelper.remove(index)}
                        color="error"
                        variant="outlined"
                      >
                        X
                      </Button>
                    </Grid>
                  </Grid>
                  <Box sx={{ width: '100%' }}>
                    <Divider sx={{ bgcolor: 'black', height: 1 }} />
                  </Box>
                </>
              ))
            }
          />
          {addExperienceForm.errors.submit && (
            <Grid container item justifyContent="center" alignItems="center">
              <Grid item xs={12} container justifyContent="start" alignItems="center">
                <FormHelperText error>{addExperienceForm.errors.submit}</FormHelperText>
              </Grid>
            </Grid>
          )}

          <Grid container item justifyContent="space-between" alignItems="center">
            <Grid item xs={2}>
              <Button onClick={() => setStep((step) => ++step)} fullWidth variant="contained">
                Skip
              </Button>
            </Grid>
            <Grid item mt={1} xs={4}>
              <Button
                onClick={addExperienceForm.handleSubmit}
                // onClick={() => console.log(addExperienceForm.errors)}
                fullWidth
                variant="contained"
              >
                Save experience history
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
};

export default ExperienceHistoryForm;
