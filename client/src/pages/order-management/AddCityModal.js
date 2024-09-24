import { useDispatch } from 'react-redux';
import { Stack, Select, MenuItem, Modal, Box, Grid, Button, TextField, FormControl, FormHelperText, InputLabel } from '@mui/material';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchUpdateItemsInOrder } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';
import { setOrder } from 'store/slices/order/orderSlice';
import SERVICES from 'constants/services';
import { useState } from 'react';
import { fetchSearchCity } from 'store/slices/city/fetchCity';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export default function AddCourierCityModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const [searching, setSearching] = useState(false);

  const handleAddCity = async (values, actions) => {
    setAddingItem(true);
    const { type, payload } = await dispatch(fetchUpdateItemsInOrder({ body: values }));
    if (type === 'order/updateItems/fetch/fulfilled') {
      dispatch(setMessage({ type: 'success', message: payload?.data?.message || 'Success! Item updated in order' }));
      dispatch(setOrder({ order: payload?.data?.order }));
      onClose();
    } else {
      dispatch(setMessage({ type: 'error', message: payload?.data?.message || 'Error! Item can not updated in order' }));
    }
    setAddingItem(false);
  };

  const handleCitySearch = async (city) => {
    setSearching(true);
    const { type, payload } = await dispatch(fetchSearchCity({ body: { city } }));
    if (type === 'city/search/fetch/fulfilled') {
      console.log(payload.cities);
    } else {
      dispatch(setMessage({ type: 'error', message: payload?.data?.message || 'Error! can not search city, try again!' }));
    }
    setSearching(false);
  };

  return (
    <Modal open={visible} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Formik
          initialValues={{
            city: '',
            mapped: [{ id: '', maped: '', courier: '' }]
          }}
          validationSchema={Yup.object().shape({
            city: Yup.string().min(1).required('Please add city!'),
            mapped: Yup.array()
              .of(
                Yup.object().shape({
                  id: Yup.number(),
                  maped: Yup.string().min(1).required('Please enter courier city!'),
                  courier: Yup.string().min(1).required('Please select courier!')
                })
              )
              .min(1, 'Please select at least one agent!')
          })}
          onSubmit={handleAddCity}
        >
          {(addCourierCity) => (
            <>
              <Grid container spacing={1} justifyContent="center" alignItems="center">
                <Grid item xs={8}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      error={addCourierCity.touched.city && !!addCourierCity.errors.city}
                      value={addCourierCity.city}
                      onChange={addCourierCity.handleChange}
                      type="text"
                      id={`city`}
                      name={`city`}
                      label="City Name"
                      variant="outlined"
                    />
                    <ErrorMessage
                      name={`addCourierCity.city`}
                      render={(msg) => (
                        <FormHelperText sx={{ m: 0 }} error id="helper-text-price">
                          {msg}
                        </FormHelperText>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <Button disable={searching} onClick={() => handleCitySearch(addCourierCity.city)} color="success" variant="outlined">
                    Search
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
                      <Grid item container alignItems="center" justifyContent="center" sx={{ mt: 1 }} xs={2}>
                        <FormControl fullWidth>
                          <InputLabel id="courier-service-type">Courier</InputLabel>
                          <Select
                            labelId="courier-service-type"
                            id="courier-service-type-select"
                            value={addCourierCity.values.mapped[index].maped}
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
                              addCourierCity.touched.mapped[index].id &&
                              !!addCourierCity.errors.mapped &&
                              !!addCourierCity.errors.mapped[index] &&
                              !!addCourierCity.errors.mapped[index].id
                            }
                            value={item.id * item.quantity}
                            onChange={addCourierCity.handleChange}
                            type="number"
                            id={`mapped.${index}.id`}
                            name={`mapped.${index}.id`}
                            label="Courier Id (if any)"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`mapped.${index}.id`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-price">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item alignItems="center" justifyContent="center" display="flex" xs={3}>
                        <Button onClick={() => arrayHelper.push({ id: '', maped: '', courier: 1 })} color="primary" variant="contained">
                          Add other courier
                        </Button>
                      </Grid>
                      <Grid item alignItems="center" justifyContent="center" display="flex" xs={2}>
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
