import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputBase, Modal, Box, Grid, Button, TextField, FormControl, FormHelperText, InputLabel } from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { Field, Formik, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { itemFetchStatusSelector, itemIsLoadingSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllItem } from 'store/slices/item/fetchItem';
import { fetchAddItemInOrder } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';
import { setOrder } from 'store/slices/order/orderSlice';

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

export default function GridAddItemModal({ visible, onClose, orderId }) {
  const dispatch = useDispatch();
  const items = useSelector(itemItemsSelector);
  const itemsIsLoading = useSelector(itemIsLoadingSelector);
  const itemsFetchStatus = useSelector(itemFetchStatusSelector);
  const [addingItem, setAddingItem] = useState(false);

  useEffect(() => {
    if (visible && itemsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllItem());
    }
  }, [visible]);

  const handleAddItem = async (values, actions) => {
    setAddingItem(true);
    const { type, payload } = await dispatch(fetchAddItemInOrder({ body: values }));
    if (type === 'order/addItem/fetch/fulfilled') {
      dispatch(setMessage({ type: 'success', message: payload.data.message || 'Success! Item added in order' }));
      dispatch(setOrder({ order: payload.data.order }));
      onClose();
    } else {
      dispatch(setMessage({ type: 'error', message: payload.data.message || 'Error! Item can not added in order' }));
    }
    setAddingItem(false);
  };

  return (
    <Modal open={visible} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Formik
          initialValues={{
            items: [{ id: '', name: '', quantity: 1 }],
            orderId
          }}
          validationSchema={Yup.object().shape({
            items: Yup.array()
              .of(
                Yup.object().shape({
                  id: Yup.mixed()
                    .test(
                      'is-number-or-string',
                      'Must be a number or a string!',
                      (value) => typeof value === 'number' || typeof value === 'string'
                    )
                    .required('Please select item again!'),
                  price: Yup.mixed()
                    .test(
                      'is-number-or-string',
                      'Must be a number or a string!',
                      (value) => typeof value === 'number' || typeof value === 'string'
                    )
                    .required('Please select item again!'),
                  name: Yup.string().min(1).required('Please select item!'),
                  quantity: Yup.number().min(1, 'Quantity must be greater than 0!').required('Please add item quantity!')
                })
              )
              .min(1, 'Please select at least one agent!'),
            orderId: Yup.number().required('Order not selected!, Please select order and add again!')
          })}
          onSubmit={handleAddItem}
        >
          {(addItemForm) => (
            <>
              <FieldArray
                validateOnChange={false}
                name="items"
                render={(arrayHelper) =>
                  addItemForm.values.items &&
                  addItemForm.values.items.length > 0 &&
                  addItemForm.values.items.map((item, index) => (
                    <Grid key={index} container spacing={1}>
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
                          name={`items.${index}.name`}
                          value={item.name}
                          error={
                            addItemForm.touched.items &&
                            addItemForm.touched.items[index] &&
                            addItemForm.touched.items[index].name &&
                            !!addItemForm.errors.items &&
                            !!addItemForm.errors.items[index] &&
                            !!addItemForm.errors.items[index].name
                          }
                          onChange={(e, value) => {
                            addItemForm.setFieldValue(`items.${index}.name`, value.label);
                            addItemForm.setFieldValue(`items.${index}.id`, value.id);
                            addItemForm.setFieldValue(`items.${index}.price`, value.price);
                          }}
                          options={items.map((item) => ({
                            id: item.id,
                            label: item.name,
                            price: item.unit_price
                          }))}
                          autoHighlight
                          fullWidth
                          disableClearable
                          renderInput={(params) => (
                            <InputBase
                              autoFocus
                              fullWidth
                              id={params.id}
                              inputProps={{
                                ...params.inputProps,
                                tabIndex: 0,
                                placeholder: 'Joint on',
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }}
                              {...params.InputProps}
                            />
                          )}
                        />
                        {itemsIsLoading && (
                          <FormHelperText sx={{ m: 0 }} error id="helper-text-items">
                            Loading...
                          </FormHelperText>
                        )}
                        <ErrorMessage
                          name={`items.${index}.name`}
                          render={(msg) => (
                            <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                              {msg}
                            </FormHelperText>
                          )}
                        />
                        {/* {addItemForm.touched.items && !!addItemForm.errors.items && (
                          <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                            {JSON.stringify(addItemForm.errors.items)}
                          </FormHelperText>
                        )} */}
                      </Grid>
                      <Grid item xs={2}>
                        <FormControl fullWidth margin="normal">
                          <TextField
                            error={
                              addItemForm.touched.items &&
                              addItemForm.touched.items[index] &&
                              addItemForm.touched.items[index].quantity &&
                              !!addItemForm.errors.items &&
                              !!addItemForm.errors.items[index] &&
                              !!addItemForm.errors.items[index].quantity
                            }
                            value={item.quantity}
                            onChange={addItemForm.handleChange}
                            type="number"
                            id={`items.${index}.quantity`}
                            name={`items.${index}.quantity`}
                            label="Quantity"
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`items.${index}.quantity`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-quantity">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item alignItems="center" justifyContent="center" display="flex" xs={3}>
                        <Button onClick={() => arrayHelper.push({ id: '', name: '', quantity: 1 })} color="primary" variant="contained">
                          Add more item
                        </Button>
                      </Grid>
                      <Grid item alignItems="center" justifyContent="center" display="flex" xs={2}>
                        <Button
                          onClick={() => addItemForm.values.items.length > 1 && arrayHelper.remove(index)}
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
                    disabled={addingItem}
                    // onClick={() => console.log(addItemForm)}
                    onClick={addItemForm.handleSubmit}
                    sx={{ flexGrow: 1 }}
                    variant="contained"
                  >
                    Add item to order
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
