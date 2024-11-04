import { useDispatch, useSelector } from 'react-redux';
import { Typography, Select, MenuItem, Modal, Box, Grid, Button, TextField, FormControl, FormHelperText, InputLabel } from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { setMessage } from 'store/slices/util/utilSlice';
import SERVICES from 'constants/services';
import { useEffect, useState } from 'react';
import { fetchAllCities, fetchCreateCity, fetchSearchCity } from 'store/slices/city/fetchCity';
import { capitalize } from 'lodash';
import { cityCitiesSelector } from 'store/slices/city/citySelector';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export default function AddCourierCityModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const [searching, setSearching] = useState(false);
  const citiesList = useSelector(cityCitiesSelector);
  const [initialValues, setInitialValues] = useState({
    city: '',
    mapped: [{ id: '', city: '', assigned_id: null, maped: '', courier: '' }]
  });

  const handleAddCity = async (values, actions) => {
    const { type, payload } = await dispatch(fetchCreateCity({ body: values.mapped }));
    if (type === 'city/create/fetch/fulfilled') {
      dispatch(setMessage({ type: 'success', message: payload?.data?.message || 'Success! Item updated in order' }));
      dispatch(fetchAllCities());
      onClose();
    } else {
      dispatch(setMessage({ type: 'error', message: payload?.data?.message || 'Error! Item can not updated in order' }));
    }
  };

  const handleCitySearch = async (city) => {
    setSearching(true);
    const { type, payload } = await dispatch(fetchSearchCity({ body: { city } }));
    if (type === 'city/search/fetch/fulfilled') {
      if (payload.data.cities && payload.data.cities.length) {
        setInitialValues({
          city,
          mapped: payload.data.cities.map(({ id, assigned_id, city, maped, courier }) => ({ id, city, assigned_id, maped, courier }))
        });
      } else {
        setInitialValues({ city, mapped: [{ id: '', city: capitalize(city), assigned_id: null, maped: '', courier: '' }] });
      }
    } else {
      dispatch(setMessage({ type: 'error', message: payload?.data?.message || 'Error! can not search city, try again!' }));
    }
    setSearching(false);
  };

  useEffect(() => {
    return () => {
      setInitialValues({ city: '', mapped: [{ id: '', city: '', assigned_id: null, maped: '', courier: '' }] });
    };
  }, [visible]);

  return (
    <Modal open={visible} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            city: Yup.string().min(1).required('Please add city!'),
            mapped: Yup.array()
              .of(
                Yup.object().shape({
                  id: Yup.number(),
                  assigned_id: Yup.number().when('courier', {
                    is: (val) => ['trax', 'leopard', 'callcourier'].includes(val),
                    then: Yup.number().required('Field required!'),
                    otherwise: Yup.number().nullable()
                  }),
                  maped: Yup.string().min(1).required('Please enter courier city!'),
                  city: Yup.string().min(1).required('Please enter city!'),
                  courier: Yup.string().min(1).required('Please select courier!')
                })
              )
              .min(1, 'Please select at least one agent!')
          })}
          onSubmit={handleAddCity}
        >
          {(addCourierCity) => (
            <>
              <Grid spacing={1} container justifyContent="center" alignItems="center">
                <Grid item xs={5}>
                  <Autocomplete
                    sx={{
                      height: '100%',
                      [`& .${autocompleteClasses.inputRoot}`]: {
                        padding: '1px 0',
                        height: '100%',
                        '& input': {
                          padding: '0 16px',
                          height: '100%'
                        }
                      }
                    }}
                    options={citiesList}
                    error={addCourierCity.touched.city && !!addCourierCity.errors.city}
                    value={addCourierCity.values.city}
                    onChange={(e, value) => {
                      addCourierCity.setFieldValue('city', value);
                      handleCitySearch(value);
                    }}
                    type="text"
                    id="city"
                    name="city"
                    label="City Name"
                    getOptionLabel={(option) => option}
                    autoHighlight
                    fullWidth
                    renderOption={(optionProps, option) => (
                      <Box
                        component="li"
                        sx={{
                          '& > img': {
                            mr: 1.5,
                            flexShrink: 0
                          }
                        }}
                        {...optionProps}
                      >
                        {option}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        autoFocus
                        fullWidth
                        size="small"
                        id={params.id}
                        placeholder="Search"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password' // disable autocomplete and autofill
                        }}
                        {...params.InputProps}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={5}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      size="small"
                      error={addCourierCity.touched.city && !!addCourierCity.errors.city}
                      value={addCourierCity.values.city}
                      onChange={addCourierCity.handleChange}
                      type="text"
                      id="city"
                      name="city"
                      label="City Name"
                      variant="outlined"
                    />
                    <ErrorMessage
                      name="city"
                      render={(msg) => (
                        <FormHelperText sx={{ m: 0 }} error id="helper-text-quantity">
                          {msg}
                        </FormHelperText>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    disable={searching}
                    onClick={() => handleCitySearch(addCourierCity.values.city)}
                    color="success"
                    variant="outlined"
                  >
                    {searching ? 'Searching...' : 'Search'}
                  </Button>
                </Grid>
              </Grid>
              <FieldArray
                validateOnChange={false}
                name="mapped"
                render={(arrayHelper) =>
                  addCourierCity.values.mapped &&
                  addCourierCity.values.mapped.length > 0 &&
                  addCourierCity.values.mapped.map((item, index) => (
                    <Grid key={index} container spacing={1}>
                      <Grid item container alignItems="center" justifyContent="center" xs={2}>
                        <Typography variant="body1" component="span">
                          {addCourierCity.values.mapped[index].city}
                        </Typography>
                      </Grid>
                      <Grid item container alignItems="center" justifyContent="center" sx={{ mt: 1 }} xs={2}>
                        <FormControl fullWidth>
                          <InputLabel id="courier-service-type">Courier</InputLabel>
                          <Select
                            labelId="courier-service-type"
                            id="courier-service-type-select"
                            value={addCourierCity.values.mapped[index].courier}
                            name={`mapped.${index}.courier`}
                            label="Courier"
                            onChange={addCourierCity.handleChange}
                            error={
                              addCourierCity.touched.mapped &&
                              addCourierCity.touched.mapped[index] &&
                              addCourierCity.touched.mapped[index].maped &&
                              !!addCourierCity.errors.mapped &&
                              !!addCourierCity.errors.mapped[index] &&
                              !!addCourierCity.errors.mapped[index].maped
                            }
                          >
                            {SERVICES.map(([name, value], index) => (
                              <MenuItem key={index} value={value}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                          <ErrorMessage
                            name={`mapped.${index}.maped`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={3}>
                        <FormControl fullWidth margin="normal">
                          <TextField
                            error={
                              addCourierCity.touched.mapped &&
                              addCourierCity.touched.mapped[index] &&
                              addCourierCity.touched.mapped[index].maped &&
                              !!addCourierCity.errors.mapped &&
                              !!addCourierCity.errors.mapped[index] &&
                              !!addCourierCity.errors.mapped[index].maped
                            }
                            value={item.maped}
                            onChange={addCourierCity.handleChange}
                            type="text"
                            id={`mapped.${index}.maped`}
                            name={`mapped.${index}.maped`}
                            label="Courier City"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`mapped.${index}.maped`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-quantity">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={2}>
                        <FormControl fullWidth margin="normal">
                          <TextField
                            error={
                              addCourierCity.touched.mapped &&
                              addCourierCity.touched.mapped[index] &&
                              addCourierCity.touched.mapped[index].assigned_id &&
                              !!addCourierCity.errors.mapped &&
                              !!addCourierCity.errors.mapped[index] &&
                              !!addCourierCity.errors.mapped[index].assigned_id
                            }
                            value={item.assigned_id}
                            onChange={addCourierCity.handleChange}
                            type="number"
                            id={`mapped.${index}.assigned_id`}
                            name={`mapped.${index}.assigned_id`}
                            label="City Id (if any)"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`mapped.${index}.assigned_id`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-price">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item alignItems="center" justifyContent="center" display="flex" xs={1}>
                        <Button
                          onClick={() =>
                            arrayHelper.push({
                              id: '',
                              city: capitalize(addCourierCity.values.city),
                              assigned_id: null,
                              maped: '',
                              courier: ''
                            })
                          }
                          color="primary"
                          variant="contained"
                        >
                          Add
                        </Button>
                      </Grid>
                      <Grid item alignItems="center" justifyContent="center" display="flex" xs={1}>
                        <Button
                          onClick={() => addCourierCity.values.mapped.length > 1 && arrayHelper.remove(index)}
                          color="error"
                          variant="outlined"
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  ))
                }
              />
              <Grid container sx={{ flexGrow: 1 }}>
                <Grid xs display="flex" justifyContent="center" alignItems="center">
                  <Button
                    // disabled={addingItem}
                    // onClick={() => console.log(addCourierCity)}
                    onClick={addCourierCity.handleSubmit}
                    sx={{ flexGrow: 1 }}
                    variant="contained"
                  >
                    Add/Update Courier City
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Formik>
      </Box>
    </Modal>
  );
}
