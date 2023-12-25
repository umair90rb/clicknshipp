import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Divider,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  Autocomplete,
  TextField
} from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateOrder } from 'store/slices/order/fetchOrder';
import { orderCreateIsLoadingSelector } from 'store/slices/order/orderSelector';
import { chanelChanelsSelector, chanelFetchStatusSelector } from 'store/slices/chanel/chanelSelector';
import { itemFetchStatusSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllChanel } from 'store/slices/chanel/fetchChanel';
import { fetchAllItem } from 'store/slices/item/fetchItem';
import location from 'utils/location';

const CreateOrderForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderForm = useRef();
  const [items, setItems] = useState([]);
  const orderCreateIsLoading = useSelector(orderCreateIsLoadingSelector);
  const chanels = useSelector(chanelChanelsSelector);
  const chanelsFetchStatus = useSelector(chanelFetchStatusSelector);
  const inventoryItems = useSelector(itemItemsSelector);
  const inventoryItemsFetchStatus = useSelector(itemFetchStatusSelector);

  const handleSubmit = async (values, { setErrors, ...rest }) => {
    if (!items.length) {
      setErrors({ submit: 'Please add item to order first' });
      return;
    }
    delete values.item;
    delete values.quantity;
    delete values.price;
    values.items = items;
    dispatch(fetchCreateOrder({ body: values })).then((action) => {
      if (action.type === 'order/create/fetch/fulfilled') {
        navigate(location.allOrders());
      }
    });
  };

  const addItem = (id, name, quantity, price) => {
    setItems((items) => [...items, { id, name, quantity, price }]);
  };

  useEffect(() => {
    if (chanelsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllChanel());
    }
    if (inventoryItemsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllItem());
    }
  }, []);

  return (
    <>
      <Formik
        innerRef={orderForm}
        initialValues={{
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          note: '',
          chanel: '',
          address1: '',
          address2: '',
          city: '',
          zip: '',
          province: '',
          itemId: '',
          item: '',
          quantity: '',
          price: '',
          sku: '',
          grams: ''
        }}
        validationSchema={Yup.object().shape({
          first_name: Yup.string().max(255).required('First Name is required'),
          last_name: Yup.string().max(255),
          note: Yup.string(),
          chanel: Yup.string().required('Please select sale channel.'),
          phone: Yup.number().min(11).required('Phone is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          address1: Yup.string().required('Address is required'),
          address2: Yup.string(),
          city: Yup.string().required('City is required'),
          zip: Yup.number(),
          province: Yup.string(),
          itemId: Yup.number(),
          item: Yup.string(),
          quantity: Yup.number(),
          price: Yup.number(),
          sku: Yup.string(),
          grams: Yup.number()
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue, setFieldError, setTouched }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Customer start */}
              <Grid item xs={12}>
                <Divider color="error">Customer Details</Divider>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="first_name">First Name</InputLabel>
                      <OutlinedInput
                        id="first_name"
                        type="first_name"
                        value={values.first_name}
                        name="first_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="First Name"
                        fullWidth
                        error={Boolean(touched.first_name && errors.first_name)}
                      />
                      {touched.first_name && errors.first_name && (
                        <FormHelperText error id="helper-text-first_name">
                          {errors.first_name}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="last_name">Last Name</InputLabel>
                      <OutlinedInput
                        id="last_name"
                        type="last_name"
                        value={values.last_name}
                        name="last_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Last Name"
                        fullWidth
                        error={Boolean(touched.last_name && errors.last_name)}
                      />
                      {touched.last_name && errors.last_name && (
                        <FormHelperText error id="helper-text-last_name">
                          {errors.last_name}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="note">Note</InputLabel>
                      <OutlinedInput
                        id="note"
                        type="note"
                        value={values.note}
                        name="note"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Note"
                        fullWidth
                        error={Boolean(touched.note && errors.note)}
                      />
                      {touched.note && errors.note && (
                        <FormHelperText error id="helper-text-note">
                          {errors.note}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="phone">Phone</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.phone && errors.phone)}
                    id="phone"
                    value={values.phone}
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="03001234567"
                    inputProps={{}}
                  />
                  {touched.phone && errors.phone && (
                    <FormHelperText error id="helper-text-phone">
                      {errors.phone}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email">Email Address</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="demo@sukoon.com"
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="chanel">Select Sales Chanel</InputLabel>
                  <Autocomplete
                    options={chanels.map((chanel) => ({ id: chanel.id, label: chanel.name }))}
                    id="chanel"
                    name="chanel"
                    value={values.chanel !== '' ? values.chanel : ''}
                    onBlur={handleBlur}
                    onChange={(event, newValue) => {
                      if (newValue === '' || newValue === null) {
                        setFieldValue('chanel', '');
                        return;
                      }
                      setFieldValue('chanel', newValue.label);
                    }}
                    openOnFocus
                    disableClearable
                    clearOnEscape
                    autoHighlight
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          type: 'search',
                          placeholder: 'Manual',
                          style: {
                            padding: 8
                          }
                        }}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  />
                  {touched.chanel && errors.chanel && (
                    <FormHelperText error id="helper-text-chanel-signup">
                      {errors.chanel}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {/* Customer end */}
              {/* Address start */}
              <Grid item xs={12}>
                <Divider color="error">Address</Divider>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="address1">Address*</InputLabel>
                      <OutlinedInput
                        id="address1"
                        type="address1"
                        value={values.address1}
                        name="address1"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Address"
                        fullWidth
                        error={Boolean(touched.address1 && errors.address1)}
                      />
                      {touched.address1 && errors.address1 && (
                        <FormHelperText error id="helper-text-address1">
                          {errors.address1}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="address2">Special Instructions (Optional)</InputLabel>
                      <OutlinedInput
                        id="address2"
                        type="address2"
                        value={values.address2}
                        name="address2"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Special Instructions (Optional)"
                        fullWidth
                        error={Boolean(touched.address2 && errors.address2)}
                      />
                      {touched.address2 && errors.address2 && (
                        <FormHelperText error id="helper-text-address2">
                          {errors.address2}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="city">City</InputLabel>
                      <OutlinedInput
                        id="city"
                        type="city"
                        value={values.city}
                        name="city"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="City"
                        fullWidth
                        error={Boolean(touched.city && errors.city)}
                      />
                      {touched.city && errors.city && (
                        <FormHelperText error id="helper-text-city">
                          {errors.city}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="zip">Zip Code</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.zip && errors.zip)}
                    id="zip"
                    value={values.zip}
                    name="zip"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="38000"
                    inputProps={{}}
                  />
                  {touched.zip && errors.zip && (
                    <FormHelperText error id="helper-text-zip">
                      {errors.zip}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="province">Province</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.province && errors.province)}
                    id="province"
                    type="province"
                    value={values.province}
                    name="province"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="KPK"
                    inputProps={{}}
                  />
                  {touched.province && errors.province && (
                    <FormHelperText error id="helper-text-province">
                      {errors.province}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {/* Address end */}
              {/* Items start */}
              <Grid item xs={12}>
                <Divider color="error">Add Items</Divider>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={3}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="item">Item Name</InputLabel>
                      <Autocomplete
                        options={inventoryItems.map((item) => ({
                          id: item.id,
                          label: item.name,
                          price: item.unit_price,
                          sku: item.sku,
                          grams: item.grams
                        }))}
                        id="item"
                        name="item"
                        value={values.item !== '' ? values.item : ''}
                        onBlur={handleBlur}
                        onChange={(event, newValue) => {
                          console.log(newValue, event);
                          if (newValue === '' || newValue === null) {
                            setFieldValue('itemId', '');
                            setFieldValue('item', '');
                            setFieldValue('price', '');
                            setFieldValue('sku', '');
                            setFieldValue('grams', '');
                            return;
                          }
                          setFieldValue('itemId', newValue.id);
                          setFieldValue('item', newValue.label);
                          setFieldValue('price', newValue.price);
                          setFieldValue('sku', newValue.sku);
                          setFieldValue('grams', newValue.grams);
                        }}
                        openOnFocus
                        disableClearable
                        clearOnEscape
                        autoHighlight
                        freeSolo
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            InputProps={{
                              ...params.InputProps,
                              type: 'search',
                              placeholder: 'Join On 30ml',
                              style: {
                                padding: 8
                              }
                            }}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      />
                      {touched.item && errors.item && (
                        <FormHelperText error id="helper-text-item">
                          {errors.item}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="quantity">Quantity</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.quantity && errors.quantity)}
                        id="quantity"
                        type="text"
                        value={values.quantity}
                        name="quantity"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="1"
                        inputProps={{}}
                      />
                      {touched.quantity && errors.quantity && (
                        <FormHelperText error id="helper-text-quantity">
                          {errors.quantity}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="price">Price</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.price && errors.price)}
                        id="price"
                        type="text"
                        value={values.price}
                        name="price"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="1"
                        inputProps={{}}
                      />
                      {touched.price && errors.price && (
                        <FormHelperText error id="helper-text-price">
                          {errors.price}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack spacing={1} justifyContent="flex-end">
                      <Button
                        style={{ height: 41 }}
                        onClick={() => {
                          console.log(errors);
                          if (!values.item) {
                            setFieldError('item', 'Please add item name');
                            setTouched({ ...touched, item: true });
                          } else if (!values.quantity) {
                            setFieldError('quantity', 'Please add item quantity');
                            setTouched({ ...touched, quantity: true });
                          } else {
                            addItem(values.itemId, values.item, values.quantity, values.price, values.sku, values.grams);
                            setFieldValue('itemId', '');
                            setFieldValue('item', '');
                            setFieldValue('quantity', '');
                            setFieldValue('price', '');
                            setFieldValue('sku', '');
                            setFieldValue('grams', '');
                            setTouched({ ...touched, quantity: false, item: false });
                          }
                        }}
                        startIcon={<PlusOutlined />}
                        variant="outlined"
                        aria-label="add"
                        color="primary"
                      >
                        Add Item
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider color="error">Items</Divider>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table sx={{ minWidth: 400 }} aria-label="spanning table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Qty.</TableCell>
                        <TableCell align="right">Unit</TableCell>
                        <TableCell align="right">Sum</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell align="right">{row.quantity}</TableCell>
                          <TableCell align="right">{row.price}</TableCell>
                          <TableCell align="right">{row.price * row.quantity}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          Total
                        </TableCell>
                        <TableCell align="right">{items.reduce((pre, item) => item.price * item.quantity + pre, 0)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              {/* Items end */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={orderCreateIsLoading}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Create new Order
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default CreateOrderForm;
