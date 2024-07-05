import { Button, Box, TextField, FormHelperText, Grid, FormControl, Divider } from '@mui/material';
import * as Yup from 'yup';
import { Formik, ErrorMessage, FieldArray } from 'formik';
import { useDispatch } from 'react-redux';
import { fetchCreateEmployeeEducation } from 'store/slices/employee/fetchEmployee';
import { toSentence } from 'utils/string-utils';

const EducationHistoryForm = ({ employeeId, setStep }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);
    const { type, payload } = await dispatch(fetchCreateEmployeeEducation({ body: values }));
    if (type === 'employee/education/create/fetch/fulfilled') {
      setSubmitting(false);
      setStep((step) => ++step);
    } else {
      setStatus({ success: false });
      setErrors({ submit: payload.error.map((e) => toSentence(e)).join('. ') || 'Employee education not added!' });
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        education: [{ degree: '', started_at: '', ended_at: '', obtained: 0, total: 0, employee_id: employeeId || 1 }]
      }}
      validationSchema={Yup.object().shape({
        education: Yup.array()
          .of(
            Yup.object().shape({
              employee_id: Yup.number().required('Please add employee personal info in previous step first'),
              degree: Yup.string().required('Please enter degree'),
              obtained: Yup.number().required('Please add degree obtained marks'),
              total: Yup.number().required('Please add degree total marks'),
              started_at: Yup.string().required('Please enter degree start date'),
              ended_at: Yup.string().required('Please enter degree end date')
            })
          )
          .min(1, 'Please add minimum 1 degree')
      })}
      onSubmit={handleSubmit}
    >
      {(addEducationForm) => (
        <Grid container mt={5}>
          <FieldArray
            validateOnChange={false}
            name="education"
            render={(arrayHelper) =>
              addEducationForm.values.education &&
              addEducationForm.values.education.length > 0 &&
              addEducationForm.values.education.map((item, index) => (
                <>
                  <Grid item key={index} container margin={1} spacing={1}>
                    <Grid item xs={4}>
                      <FormControl fullWidth margin="normal">
                        <TextField
                          error={
                            addEducationForm.touched.education &&
                            addEducationForm.touched.education[index] &&
                            addEducationForm.touched.education[index].degree &&
                            !!addEducationForm.errors.education &&
                            !!addEducationForm.errors.education[index] &&
                            !!addEducationForm.errors.education[index].degree
                          }
                          value={item.degree}
                          onChange={addEducationForm.handleChange}
                          type="text"
                          id={`education.${index}.degree`}
                          name={`education.${index}.degree`}
                          label="Degree"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`education.${index}.degree`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-degree">
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
                            addEducationForm.touched.education &&
                            addEducationForm.touched.education[index] &&
                            addEducationForm.touched.education[index].started_at &&
                            !!addEducationForm.errors.education &&
                            !!addEducationForm.errors.education[index] &&
                            !!addEducationForm.errors.education[index].started_at
                          }
                          value={item.started_at}
                          onChange={addEducationForm.handleChange}
                          type="date"
                          placeholder=""
                          id={`education.${index}.started_at`}
                          name={`education.${index}.started_at`}
                          label="Started At"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`education.${index}.started_at`}
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
                            addEducationForm.touched.education &&
                            addEducationForm.touched.education[index] &&
                            addEducationForm.touched.education[index].ended_at &&
                            !!addEducationForm.errors.education &&
                            !!addEducationForm.errors.education[index] &&
                            !!addEducationForm.errors.education[index].ended_at
                          }
                          value={item.ended_at}
                          onChange={addEducationForm.handleChange}
                          type="date"
                          id={`education.${index}.ended_at`}
                          name={`education.${index}.ended_at`}
                          label="Ended At"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`education.${index}.ended_at`}
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
                    <Grid item xs={5}>
                      <FormControl fullWidth margin="normal">
                        <TextField
                          error={
                            addEducationForm.touched.education &&
                            addEducationForm.touched.education[index] &&
                            addEducationForm.touched.education[index].obtained &&
                            !!addEducationForm.errors.education &&
                            !!addEducationForm.errors.education[index] &&
                            !!addEducationForm.errors.education[index].obtained
                          }
                          value={item.obtained}
                          onChange={addEducationForm.handleChange}
                          type="number"
                          id={`education.${index}.obtained`}
                          name={`education.${index}.obtained`}
                          label="Obtained"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`education.${index}.obtained`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-obtained">
                              {msg}
                            </FormHelperText>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={5}>
                      <FormControl fullWidth margin="normal">
                        <TextField
                          error={
                            addEducationForm.touched.education &&
                            addEducationForm.touched.education[index] &&
                            addEducationForm.touched.education[index].total &&
                            !!addEducationForm.errors.education &&
                            !!addEducationForm.errors.education[index] &&
                            !!addEducationForm.errors.education[index].total
                          }
                          value={item.total}
                          onChange={addEducationForm.handleChange}
                          type="number"
                          id={`education.${index}.total`}
                          name={`education.${index}.total`}
                          label="Total"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`education.${index}.total`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-total">
                              {msg}
                            </FormHelperText>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item container alignItems="center" justifyContent="center" display="flex" xs={1}>
                      <Button
                        size="small"
                        onClick={() =>
                          arrayHelper.push({ employee_id: employeeId, degree: '', started_at: '', ended_at: '', obtained: 0, total: 0 })
                        }
                        color="primary"
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Grid>
                    <Grid item container alignItems="center" justifyContent="center" display="flex" xs={1}>
                      <Button
                        size="small"
                        onClick={() => addEducationForm.values.education.length > 1 && arrayHelper.remove(index)}
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
          {addEducationForm.errors.submit && (
            <Grid container item justifyContent="center" alignItems="center">
              <Grid item xs={12} container justifyContent="start" alignItems="center">
                <FormHelperText error>{addEducationForm.errors.submit}</FormHelperText>
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
                onClick={addEducationForm.handleSubmit}
                // onClick={() => console.log(addEducationForm.errors)}
                fullWidth
                variant="contained"
              >
                Save education history
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
};

export default EducationHistoryForm;
