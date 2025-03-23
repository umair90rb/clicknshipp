import { useEffect, useRef } from 'react';
import { TextareaAutosize, IconButton, FormHelperText, Grid, TextField, FormControl, FormLabel, Select, MenuItem } from '@mui/material';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import * as Yup from 'yup';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllItem } from 'store/slices/item/fetchItem';
import { itemFetchStatusSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import fetchStatus from 'constants/fetchStatuses';
import { toSentence } from 'utils/string-utils';
import CustomDialog from 'components/CustomDialog';
import { fetchCreateSalesOrder } from 'store/slices/salesOrder/fetchSalesOrder';
import { salesOrderCreateCreateModalVisibleSelector } from 'store/slices/salesOrder/salesOrderSelector';
import { setSalesOrderCreateModalVisible } from 'store/slices/salesOrder/salesOrderSlice';
import useItemsFetch from 'hooks/useItemsFetch';
import StoreLocationSelectorInput from 'ui/StoreLocationSelectorInput';
import useResetForm from 'hooks/useResetForm';

export default function AddSalesOrderModal() {
  const dispatch = useDispatch();
  const formRef = useRef();
  const visible = useSelector(salesOrderCreateCreateModalVisibleSelector);
  const items = useSelector(itemItemsSelector);

  useItemsFetch();
  useResetForm(formRef, visible);

  const handleSubmit = (values, _actions) => {
    console.log('values', values);
    dispatch(fetchCreateSalesOrder({ body: values }));
  };

  const onClose = () => {
    dispatch(setSalesOrderCreateModalVisible(false));
  };

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      initialValues={{
        location_id: null,
        name: '',
        comment: '',
        items: [
          {
            item_id: null,
            quantity: 0,
            price: 0
          }
        ]
      }}
      validationSchema={Yup.object().shape({
        location_id: Yup.number().required('Please select store location'),
        name: Yup.string().required(),
        comment: Yup.string(),
        items: Yup.array().of(
          Yup.object().shape({
            item_id: Yup.number().required(),
            quantity: Yup.number().min(1).required('Please enter stock received quantity'),
            price: Yup.number()
          })
        )
      })}
      onSubmit={handleSubmit}
    >
      {(salesOrder) => (
        <CustomDialog
          visible={visible}
          onClose={onClose}
          maxWidth="xl"
          title="Create New Sale Order"
          actions={[
            {
              text: 'Create and Fulfill',
              onClick: () => {
                console.log('salesOrder', salesOrder.errors);
                salesOrder.handleSubmit();
              }
            }
          ]}
        >
          <Grid container spacing={3}>
            <Grid container columnSpacing={1} alignItems="center" justifyContent="center" item sx={12} md={12} lg={12}>
              <Grid item sx={5} md={5} lg={5}>
                <StoreLocationSelectorInput
                  onBlur={salesOrder.handleBlur}
                  onChange={salesOrder.handleChange}
                  error={salesOrder.touched.location_id && salesOrder.errors.location_id}
                  value={salesOrder.values.location_id}
                />
              </Grid>
              <Grid item sx={7} md={7} lg={7}>
                <FormControl fullWidth margin="normal">
                  <FormLabel id="name">Name</FormLabel>
                  <TextField
                    size="small"
                    labelId="name"
                    id="name_select"
                    value={salesOrder.values.name}
                    name="name"
                    onChange={salesOrder.handleChange}
                    error={
                      salesOrder.touched.name &&
                      salesOrder.touched.name &&
                      salesOrder.touched.name &&
                      !!salesOrder.errors.name &&
                      !!salesOrder.errors.name &&
                      !!salesOrder.errors.name
                    }
                  />
                  <ErrorMessage
                    name="name"
                    render={(msg) => (
                      <FormHelperText sx={{ m: 0 }} error id="helper-text-name">
                        {msg}
                      </FormHelperText>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item sx={12} md={12} lg={12}>
                <FormControl fullWidth margin="normal">
                  <FormLabel id="comment">Comment</FormLabel>
                  <TextareaAutosize
                    maxRows={5}
                    minRows={3}
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
                name="items"
                render={(arrayHelper) =>
                  salesOrder.values.items &&
                  salesOrder.values.items.length > 0 &&
                  salesOrder.values.items.map((item, index) => (
                    <Grid key={index} container spacing={1}>
                      <Grid item xs={6}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`items.${index}.item_id`}>Select Item</FormLabel>
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
                              label: item.name,
                              price: item.unit_price
                            }))}
                            error={
                              salesOrder.touched.items &&
                              salesOrder.touched.items[index] &&
                              salesOrder.touched.items[index].item_id &&
                              !!salesOrder.errors.items &&
                              !!salesOrder.errors.items[index] &&
                              !!salesOrder.errors.items[index].item_id
                            }
                            // getOptionLabel={(option) => option.label}
                            value={items.find((item) => item.id === salesOrder.values.items[index].item_id)?.name}
                            // onChange={salesOrder.handleChange}
                            isOptionEqualToValue={(option, value) => option.id === value}
                            onChange={(e, option) => {
                              salesOrder.setFieldValue(`items.${index}.price`, option.price);
                              salesOrder.setFieldValue(`items.${index}.item_id`, option.id);
                            }}
                            type="text"
                            id={`items.${index}.item_id`}
                            name={`items.${index}.item_id`}
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
                            name={`items.${index}.item_id`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-price">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      {/* <Grid item xs={2}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`items.${index}.price`}>Price (for 1 item)</FormLabel>
                          <TextField
                            error={
                              salesOrder.touched.items &&
                              salesOrder.touched.items[index] &&
                              salesOrder.touched.items[index].price &&
                              !!salesOrder.errors.items &&
                              !!salesOrder.errors.items[index] &&
                              !!salesOrder.errors.items[index].price
                            }
                            size="small"
                            value={item.price}
                            onChange={salesOrder.handleChange}
                            type="number"
                            id={`items.${index}.price`}
                            name={`items.${index}.price`}
                            variant="outlined"
                          />
                          <ErrorMessage
                            name={`items.${index}.price`}
                            render={(msg) => (
                              <FormHelperText sx={{ m: 0 }} error id="helper-text-price">
                                {msg}
                              </FormHelperText>
                            )}
                          />
                        </FormControl>
                      </Grid> */}

                      <Grid item xs={2}>
                        <FormControl fullWidth margin="normal">
                          <FormLabel id={`items.${index}.quantity`}>Quantity</FormLabel>
                          <TextField
                            error={
                              salesOrder.touched.items &&
                              salesOrder.touched.items[index] &&
                              salesOrder.touched.items[index].quantity &&
                              !!salesOrder.errors.items &&
                              !!salesOrder.errors.items[index] &&
                              !!salesOrder.errors.items[index].quantity
                            }
                            size="small"
                            value={item.quantity}
                            onChange={salesOrder.handleChange}
                            type="number"
                            id={`items.${index}.quantity`}
                            name={`items.${index}.quantity`}
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

                      <Grid item alignItems="center" justifyContent="center" display="flex" xs={1}>
                        <IconButton
                          onClick={() =>
                            arrayHelper.push({
                              item_id: null,
                              quantity: 1,
                              price: 0
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
                          onClick={() => salesOrder.values.items.length > 1 && arrayHelper.remove(index)}
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
        </CustomDialog>
      )}
    </Formik>
  );
}
