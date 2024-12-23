import { useEffect, useRef } from 'react';
import { IconButton, Button, FormHelperText, Grid, TextField, FormControl, FormLabel, Select, MenuItem } from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import * as Yup from 'yup';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllItem } from 'store/slices/item/fetchItem';
import { itemFetchStatusSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllStock, fetchCreateStock } from 'store/slices/stock/fetchStock';
import { toSentence } from 'utils/string-utils';
import { locationFetchStatusSelector, locationListSelector } from 'store/slices/location/locationSelector';
import { fetchAllLocation } from 'store/slices/location/fetchLocation';
import CustomDialog from 'components/CustomDialog';

export default function AddSalesOrderModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const formRef = useRef();

  const itemFetchStatus = useSelector(itemFetchStatusSelector);
  const items = useSelector(itemItemsSelector);
  const itemsIsLoading = itemFetchStatus === fetchStatus.REQUEST;

  const locationFetchStatus = useSelector(locationFetchStatusSelector);
  const locations = useSelector(locationListSelector);
  const locationIsLoading = locationFetchStatus === fetchStatus.REQUEST;

  useEffect(() => {
    if (itemFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllItem());
    }
    if (locationFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllLocation());
    }
  }, []);

  const handleSubmit = async (values, { setErrors }) => {
    dispatch(fetchCreateStock({ body: values })).then((action) => {
      if (action.type === 'stock/create/fetch/fulfilled') {
        dispatch(fetchAllStock());
        onClose();
      } else {
        setErrors({ submit: action?.payload?.error || 'Something goes wrong, please try again' });
      }
    });
  };

  return (
    <CustomDialog
      visible={visible}
      onClose={onClose}
      maxWidth="xl"
      title="Create New Sale Order"
      actions={[
        <Button key="1" onClick={() => formRef?.current.submitForm()} variant="contained">
          Create and Fulfill
        </Button>
      ]}
    >
      <Formik
        innerRef={formRef}
        enableReinitialize
        initialValues={{
          location_id: null,
          comment: '',
          inventory: [
            {
              item_id: { id: null, label: '' },
              quantity: 0
            }
          ]
        }}
        validationSchema={Yup.object().shape({
          location_id: Yup.number().required('Please select store location'),
          comment: Yup.string(),
          inventory: Yup.array().of(
            Yup.object().shape({
              item_id: Yup.object().shape({
                id: Yup.string().required(),
                label: Yup.string().required()
              }),
              quantity: Yup.number().min(1).required('Please enter stock received quantity')
            })
          )
        })}
        onSubmit={handleSubmit}
      >
        {(salesOrder) => (
          <Grid container spacing={3}>
            <Grid container columnSpacing={1} alignItems="center" justifyContent="center" item sx={12} md={12} lg={12}>
              <Grid item sx={4} md={4} lg={4}>
                <FormControl fullWidth margin="normal">
                  <FormLabel id="location_id">Store Location</FormLabel>
                  <Select
                    size="small"
                    labelId="location_id"
                    id="location_id_select"
                    value={salesOrder.values.location_id}
                    name="location_id"
                    onChange={salesOrder.handleChange}
                    error={
                      salesOrder.touched.location_id &&
                      salesOrder.touched.location_id &&
                      salesOrder.touched.location_id &&
                      !!salesOrder.errors.location_id &&
                      !!salesOrder.errors.location_id &&
                      !!salesOrder.errors.location_id
                    }
                  >
                    {locations.map(({ id, name }, index) => (
                      <MenuItem key={index} value={id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  <ErrorMessage
                    name="location_id"
                    render={(msg) => (
                      <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                        {msg}
                      </FormHelperText>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item sx={8} md={8} lg={8}>
                <FormControl fullWidth margin="normal">
                  <FormLabel id="comment">Comment</FormLabel>
                  <TextField
                    size="small"
                    labelId="comment"
                    id="comment_select"
                    value={salesOrder.values.comment}
                    name="comment"
                    onChange={salesOrder.handleChange}
                    error={
                      salesOrder.touched.comment &&
                      salesOrder.touched.comment &&
                      salesOrder.touched.comment &&
                      !!salesOrder.errors.comment &&
                      !!salesOrder.errors.comment &&
                      !!salesOrder.errors.comment
                    }
                  />
                  <ErrorMessage
                    name="comment"
                    render={(msg) => (
                      <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                        {msg}
                      </FormHelperText>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid item sx={12} md={12}>
              <FieldArray
                validateOnChange={false}
                name="inventory"
                render={(arrayHelper) =>
                  salesOrder.values.inventory &&
                  salesOrder.values.inventory.length > 0 &&
                  salesOrder.values.inventory.map((item, index) => (
                    <Grid key={index} container spacing={1}>
                      <Grid item xs={7}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`inventory.${index}.item_id`}>Select Item</FormLabel>
                          <Autocomplete
                            sx={{
                              height: '100%',
                              [`& .${autocompleteClasses.inputRoot}`]: {
                                padding: '0px 0',
                                height: '100%',
                                '& input': {
                                  padding: '0 0px',
                                  height: '100%'
                                }
                              }
                            }}
                            options={items.map((item) => ({
                              id: item.id,
                              label: item.name
                            }))}
                            error={
                              salesOrder.touched.inventory &&
                              salesOrder.touched.inventory[index] &&
                              salesOrder.touched.inventory[index].item_id &&
                              !!salesOrder.errors.inventory &&
                              !!salesOrder.errors.inventory[index] &&
                              !!salesOrder.errors.inventory[index].item_id
                            }
                            getOptionLabel={(option) => option.label}
                            value={salesOrder.values.inventory[index].item_id}
                            // onChange={salesOrder.handleChange}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(e, option) => {
                              salesOrder.setFieldValue(`inventory.${index}.item_id`, option);
                            }}
                            type="text"
                            id={`inventory.${index}.item_id`}
                            name={`inventory.${index}.item_id`}
                            autoHighlight
                            renderInput={(params) => (
                              <TextField
                                autoFocus
                                fullWidth
                                id={params.id}
                                size="small"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password' // disable autocomplete and autofill
                                }}
                                {...params.InputProps}
                              />
                            )}
                          />
                          <ErrorMessage
                            name={`inventory.${index}.item_id`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-price">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={3}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`inventory.${index}.quantity`}>Quantity</FormLabel>
                          <TextField
                            error={
                              salesOrder.touched.inventory &&
                              salesOrder.touched.inventory[index] &&
                              salesOrder.touched.inventory[index].quantity &&
                              !!salesOrder.errors.inventory &&
                              !!salesOrder.errors.inventory[index] &&
                              !!salesOrder.errors.inventory[index].quantity
                            }
                            size="small"
                            value={item.quantity}
                            onChange={salesOrder.handleChange}
                            type="number"
                            id={`inventory.${index}.quantity`}
                            name={`inventory.${index}.quantity`}
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`inventory.${index}.quantity`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-quantity">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item alignItems="center" justifyContent="center" display="flex" xs={1}>
                        <IconButton
                          onClick={() =>
                            arrayHelper.push({
                              item_id: null,
                              batch_number: '',
                              production_date: null,
                              expiry_date: null,
                              quantity: 0,
                              unit_of_measure: ''
                            })
                          }
                          color="primary"
                          variant="contained"
                        >
                          <AddOutlinedIcon />
                        </IconButton>
                      </Grid>
                      <Grid item alignItems="center" justifyContent="center" display="flex" xs={1}>
                        <IconButton
                          onClick={() => salesOrder.values.inventory.length > 1 && arrayHelper.remove(index)}
                          color="error"
                          variant="outlined"
                        >
                          <CloseOutlinedIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))
                }
              />
            </Grid>
            {salesOrder.errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{toSentence(salesOrder.errors.submit)}</FormHelperText>
              </Grid>
            )}
          </Grid>
        )}
      </Formik>
    </CustomDialog>
  );
}
