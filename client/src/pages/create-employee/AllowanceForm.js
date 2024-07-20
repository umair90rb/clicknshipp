import { useEffect } from 'react';
import { Button, Box, TextField, FormHelperText, Grid, FormControl, Divider, InputBase } from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import * as Yup from 'yup';
import { Formik, ErrorMessage, FieldArray } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateEmployeeAllowance, fetchCreateEmployeeImmediateContact } from 'store/slices/employee/fetchEmployee';
import { toSentence } from 'utils/string-utils';
import { useNavigate } from 'react-router-dom';
import { fetchAllAllowance } from 'store/slices/allowance/fetchAllowance';
import {
  allowanceErrorSelector,
  allowanceFetchStatusSelector,
  allowanceIsLoadingSelector,
  allowanceListSelector
} from 'store/slices/allowance/allowanceSelector';
import fetchStatus from 'constants/fetchStatuses';
import { setMessage } from 'store/slices/util/utilSlice';

const AllowanceForm = ({ employeeId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allowanceList = useSelector(allowanceListSelector);
  const allowanceFetchStatus = useSelector(allowanceFetchStatusSelector);
  const allowanceIsLoading = useSelector(allowanceIsLoadingSelector);
  const allowanceError = useSelector(allowanceErrorSelector);

  const goToBack = () => navigate(-1);

  useEffect(() => {
    if (allowanceFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllAllowance());
    }
  }, []);

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);
    const { type, payload } = await dispatch(fetchCreateEmployeeAllowance({ body: values }));
    if (type === 'employee/allowance/create/fetch/fulfilled') {
      setSubmitting(false);
      dispatch(setMessage({ type: 'success', message: 'Employee allowance added' }));
      goToBack();
    } else {
      setStatus({ success: false });
      setErrors({ submit: payload.error.map((e) => toSentence(e)).join('. ') || 'Employee allowance not added!' });
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        allowance: [{ type: '', amount: null, employee_id: employeeId }]
      }}
      validationSchema={Yup.object().shape({
        allowance: Yup.array()
          .of(
            Yup.object().shape({
              employee_id: Yup.number().required('Please add employee personal info in previous step first'),
              type: Yup.string().nullable().required('Please select allowance'),
              amount: Yup.number().nullable().required('Please add amount')
            })
          )
          .min(1, 'Please add minimum 1 allowance')
      })}
      onSubmit={handleSubmit}
    >
      {(addAllowanceForm) => (
        <Grid container mt={5}>
          <FieldArray
            validateOnChange={false}
            name="allowance"
            render={(arrayHelper) =>
              addAllowanceForm.values.allowance &&
              addAllowanceForm.values.allowance.length > 0 &&
              addAllowanceForm.values.allowance.map((item, index) => (
                <>
                  <Grid item key={index} spacing={1} container>
                    <Grid item xs={4} container alignItems="center" justifyContent="start">
                      <Autocomplete
                        name={`allowance.${index}.type`}
                        value={addAllowanceForm.values.type}
                        onChange={(e, value) => {
                          if (value === '') {
                            addAllowanceForm.setFieldValue(`allowance.${index}.type`, null);
                          }
                          addAllowanceForm.setFieldValue(`allowance.${index}.type`, value.label);
                        }}
                        options={allowanceList.map((allowance) => ({
                          id: allowance.id,
                          label: allowance.name
                        }))}
                        fullWidth
                        freeSolo
                        disableClearable
                        renderInput={(params) => (
                          <TextField
                            error={
                              addAllowanceForm.touched.allowance &&
                              addAllowanceForm.touched.allowance[index] &&
                              addAllowanceForm.touched.allowance[index].type &&
                              !!addAllowanceForm.errors.allowance &&
                              !!addAllowanceForm.errors.allowance[index] &&
                              !!addAllowanceForm.errors.allowance[index].type
                            }
                            fullWidth
                            size="small"
                            id={params.id}
                            inputProps={{
                              ...params.inputProps,

                              placeholder: 'House allowance',
                              autoComplete: 'new-password' // disable autocomplete and autofill
                            }}
                            {...params.InputProps}
                          />
                        )}
                      />
                      {allowanceIsLoading && (
                        <FormHelperText sx={{ m: 0 }} error id="helper-text-type">
                          Loading...
                        </FormHelperText>
                      )}
                      <ErrorMessage
                        name={`allowance.${index}.type`}
                        render={(msg) => (
                          <FormHelperText error id="helper-text-type">
                            {msg}
                          </FormHelperText>
                        )}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl fullWidth margin="normal">
                        <TextField
                          error={
                            addAllowanceForm.touched.allowance &&
                            addAllowanceForm.touched.allowance[index] &&
                            addAllowanceForm.touched.allowance[index].amount &&
                            !!addAllowanceForm.errors.allowance &&
                            !!addAllowanceForm.errors.allowance[index] &&
                            !!addAllowanceForm.errors.allowance[index].amount
                          }
                          size="small"
                          value={addAllowanceForm.values.amount}
                          onChange={addAllowanceForm.handleChange}
                          type="number"
                          id={`allowance.${index}.amount`}
                          name={`allowance.${index}.amount`}
                          label="Amount"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`allowance.${index}.amount`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-amount">
                              {msg}
                            </FormHelperText>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item container alignItems="center" justifyContent="center" display="flex" xs={2}>
                      <Button
                        size="small"
                        onClick={() => arrayHelper.push({ employee_id: employeeId, allowance_id: null, amount: null })}
                        color="primary"
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Grid>
                    <Grid item container alignItems="center" justifyContent="center" display="flex" xs={2}>
                      <Button
                        size="small"
                        onClick={() => addAllowanceForm.values.allowance.length > 1 && arrayHelper.remove(index)}
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
          {addAllowanceForm.errors.submit && (
            <Grid container item justifyContent="center" alignItems="center">
              <Grid item xs={12} container justifyContent="start" alignItems="center">
                <FormHelperText error>{addAllowanceForm.errors.submit}</FormHelperText>
              </Grid>
            </Grid>
          )}
          {/* {addAllowanceForm.errors && (
            <Grid container item justifyContent="center" alignItems="center">
              <Grid item xs={12} container justifyContent="start" alignItems="center">
                <FormHelperText error>{JSON.stringify(addAllowanceForm.errors)}</FormHelperText>
              </Grid>
            </Grid>
          )} */}

          <Grid container item justifyContent="space-between" alignItems="center">
            <Grid item xs={2}>
              <Button onClick={goToBack} fullWidth variant="contained">
                Finish
              </Button>
            </Grid>
            <Grid item mt={1} xs={4}>
              <Button
                onClick={addAllowanceForm.handleSubmit}
                // onClick={() => console.log(addAllowanceForm.errors)}
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
