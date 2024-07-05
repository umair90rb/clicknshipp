import { Button, Box, TextField, FormHelperText, Grid, FormControl, Divider } from '@mui/material';
import * as Yup from 'yup';
import { Formik, ErrorMessage, FieldArray } from 'formik';
import { useDispatch } from 'react-redux';
import { fetchCreateEmployeeImmediateContact } from 'store/slices/employee/fetchEmployee';
import { toSentence } from 'utils/string-utils';

const AllowanceForm = ({ employeeId, setStep }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);
    const { type, payload } = await dispatch(fetchCreateEmployeeImmediateContact({ body: values }));
    if (type === 'employee/immediateContact/create/fetch/fulfilled') {
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
        contact: [{ name: '', phone: '', relation: '', address: '', employee_id: employeeId || 1 }]
      }}
      validationSchema={Yup.object().shape({
        contact: Yup.array()
          .of(
            Yup.object().shape({
              employee_id: Yup.number().required('Please add employee personal info in previous step first'),
              name: Yup.string().required('Please enter name'),
              address: Yup.string().required('Please add address'),
              phone: Yup.string().required('Please enter phone'),
              relation: Yup.string().required('Please enter relation')
            })
          )
          .min(1, 'Please add minimum 1 contact')
      })}
      onSubmit={handleSubmit}
    >
      {(addImmediateContactForm) => (
        <Grid container mt={5}>
          <FieldArray
            validateOnChange={false}
            name="contact"
            render={(arrayHelper) =>
              addImmediateContactForm.values.contact &&
              addImmediateContactForm.values.contact.length > 0 &&
              addImmediateContactForm.values.contact.map((item, index) => (
                <>
                  <Grid item key={index} container margin={1} spacing={1}>
                    <Grid item xs={4}>
                      <FormControl fullWidth margin="normal">
                        <TextField
                          error={
                            addImmediateContactForm.touched.contact &&
                            addImmediateContactForm.touched.contact[index] &&
                            addImmediateContactForm.touched.contact[index].name &&
                            !!addImmediateContactForm.errors.contact &&
                            !!addImmediateContactForm.errors.contact[index] &&
                            !!addImmediateContactForm.errors.contact[index].name
                          }
                          value={item.name}
                          onChange={addImmediateContactForm.handleChange}
                          type="text"
                          id={`contact.${index}.name`}
                          name={`contact.${index}.name`}
                          label="Name"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`contact.${index}.name`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
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
                            addImmediateContactForm.touched.contact &&
                            addImmediateContactForm.touched.contact[index] &&
                            addImmediateContactForm.touched.contact[index].phone &&
                            !!addImmediateContactForm.errors.contact &&
                            !!addImmediateContactForm.errors.contact[index] &&
                            !!addImmediateContactForm.errors.contact[index].phone
                          }
                          value={item.phone}
                          onChange={addImmediateContactForm.handleChange}
                          type="text"
                          placeholder=""
                          id={`contact.${index}.phone`}
                          name={`contact.${index}.phone`}
                          label="Phone"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`contact.${index}.phone`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-phone">
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
                            addImmediateContactForm.touched.contact &&
                            addImmediateContactForm.touched.contact[index] &&
                            addImmediateContactForm.touched.contact[index].relation &&
                            !!addImmediateContactForm.errors.contact &&
                            !!addImmediateContactForm.errors.contact[index] &&
                            !!addImmediateContactForm.errors.contact[index].relation
                          }
                          value={item.relation}
                          onChange={addImmediateContactForm.handleChange}
                          type="text"
                          id={`contact.${index}.relation`}
                          name={`contact.${index}.relation`}
                          label="Relation"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`contact.${index}.relation`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-relation">
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
                            addImmediateContactForm.touched.contact &&
                            addImmediateContactForm.touched.contact[index] &&
                            addImmediateContactForm.touched.contact[index].address &&
                            !!addImmediateContactForm.errors.contact &&
                            !!addImmediateContactForm.errors.contact[index] &&
                            !!addImmediateContactForm.errors.contact[index].address
                          }
                          value={item.address}
                          onChange={addImmediateContactForm.handleChange}
                          type="text"
                          id={`contact.${index}.address`}
                          name={`contact.${index}.address`}
                          label="Address"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`contact.${index}.address`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-address">
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
                        onClick={() => addImmediateContactForm.values.contact.length > 1 && arrayHelper.remove(index)}
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
          {addImmediateContactForm.errors.submit && (
            <Grid container item justifyContent="center" alignItems="center">
              <Grid item xs={12} container justifyContent="start" alignItems="center">
                <FormHelperText error>{addImmediateContactForm.errors.submit}</FormHelperText>
              </Grid>
            </Grid>
          )}

          <Grid container item justifyContent="space-between" alignItems="center">
            <Grid item xs={2}>
              <Button onClick={() => setStep((step) => --step)} fullWidth variant="contained">
                Finish
              </Button>
            </Grid>
            <Grid item mt={1} xs={4}>
              <Button
                onClick={addImmediateContactForm.handleSubmit}
                // onClick={() => console.log(addImmediateContactForm.errors)}
                fullWidth
                variant="contained"
              >
                Add allowance
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
};

export default AllowanceForm;
