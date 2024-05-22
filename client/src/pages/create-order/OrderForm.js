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
  TextField,
  IconButton,
  InputAdornment,
  Modal,
  Box
} from '@mui/material';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { PlusOutlined, CloseOutlined, MinusOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCreateOrder, fetchUpdateOrder } from 'store/slices/order/fetchOrder';
import { orderCreateIsLoadingSelector } from 'store/slices/order/orderSelector';
import { chanelChanelsSelector, chanelFetchStatusSelector } from 'store/slices/chanel/chanelSelector';
import { itemFetchStatusSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllChanel } from 'store/slices/chanel/fetchChanel';
import { fetchAllItem } from 'store/slices/item/fetchItem';
import location from 'utils/location';
import { useLocation } from '../../../node_modules/react-router-dom/dist/index';
import { setMessage } from 'store/slices/util/utilSlice';
import { fetchSearchCustomer } from 'store/slices/customer/fetchCustomer';
import { cityCitiesSelector, cityFetchStatusSelector } from 'store/slices/city/citySelector';
import { fetchAllCities } from 'store/slices/city/fetchCity';
import TransactionModal from './TransactionModal';
import UpdateItemPriceModal from './UpdateItemPriceModal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

const CreateOrderForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderForm = useRef();
  const { state } = useLocation();
  const { order } = state || {};
  const { items: orderItems, customer, address, id, chanel, brand_id, remarks } = order || {};
  const { first_name, last_name, email, phone, note, id: customerId } = customer || {};
  const { address1, address2, city, zip, province, id: addressId } = address || {};
  const { id: chanel_id } = chanel || {};
  const [items, setItems] = useState(orderItems || []);
  const [payments, setPayments] = useState([]);
  const [itemForUpdate, setItemForUpdate] = useState({ index: null, item: null });

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const showAddTranscationModal = () => setShowTransactionModal(true);
  const hideAddTranscationModal = () => setShowTransactionModal(false);

  const [updatePriceModal, setUpdatePriceModal] = useState(false);
  const showUpdatePriceModal = (index, item) => {
    setItemForUpdate({ index, item });
    setUpdatePriceModal(true);
  };
  const hideUpdatePriceModal = () => setUpdatePriceModal(false);

  const [customerLoading, setCustomerLoading] = useState(false);

  const orderCreateIsLoading = useSelector(orderCreateIsLoadingSelector);
  const chanels = useSelector(chanelChanelsSelector);
  const chanelsFetchStatus = useSelector(chanelFetchStatusSelector);
  const inventoryItems = useSelector(itemItemsSelector);
  const inventoryItemsFetchStatus = useSelector(itemFetchStatusSelector);
  const cities = useSelector(cityCitiesSelector);
  const citiesFetchStatus = useSelector(cityFetchStatusSelector);

  const handleAddPayment = (payment) => {
    setPayments((payments) => [...payments, { ...payment }]);
    hideAddTranscationModal();
  };

  const updateItemPrice = (index, item) => {
    console.log(index, item, 'index, item');
    const itemsCopy = [...items];
    itemsCopy[index] = item;
    setItems(itemsCopy);
  };

  const handleSubmit = async (values, { setErrors }) => {
    console.log(values, 'order fields');
    if (!items.length) {
      setErrors({ submit: 'Please add atleast one item' });
      return;
    }
    delete values.item;
    delete values.itemId;
    delete values.quantity;
    delete values.price;
    delete values.sku;
    delete values.grams;
    values.items = items;
    if (order) {
      return dispatch(fetchUpdateOrder({ id, body: { ...values, addressId, customerId, payments } })).then((action) => {
        if (action.type === 'order/update/fetch/fulfilled') {
          dispatch(setMessage({ message: 'Order updated successfully!' }));
          navigate(-1);
        }
      });
    } else {
      return dispatch(fetchCreateOrder({ body: { ...values, payments } })).then((action) => {
        if (action.type === 'order/create/fetch/fulfilled') {
          navigate(location.allOrders());
        }
      });
    }
  };

  const addItem = (id, name, quantity, unit, price, discount, sku, grams) => {
    setItems((items) => [...items, { id, name, quantity, unit, price, discount, sku, grams }]);
  };

  const searchCustomer = (phone) => {
    if (phone === '') return;
    console.log(phone);
    setCustomerLoading(true);
    return dispatch(fetchSearchCustomer({ body: { phone } })).then(({ type, payload }) => {
      if (type === 'customer/search/fetch/fulfilled') {
        const { data } = payload;
        if ('email' in data) {
          const { first_name, last_name, email, note, id, address } = data;
          const { id: addressId, address1, address2, city, zip, province } = address || {};
          orderForm.current.setFieldValue('first_name', first_name || '');
          orderForm.current.setFieldValue('last_name', last_name || '');
          orderForm.current.setFieldValue('email', email || '');
          orderForm.current.setFieldValue('note', note || '');
          orderForm.current.setFieldValue('customerId', id || '');
          if (address) {
            orderForm.current.setFieldValue('addressId', addressId || '');
            orderForm.current.setFieldValue('address1', address1 || '');
            orderForm.current.setFieldValue('address2', address2 || '');
            orderForm.current.setFieldValue('city', city || '');
            orderForm.current.setFieldValue('zip', zip || '');
            orderForm.current.setFieldValue('province', province || '');
          }
        } else {
          dispatch(setMessage({ message: 'Customer not found!', type: 'error' }));
        }
      } else {
        dispatch(setMessage({ message: 'Customer not found!', type: 'error' }));
      }
      setCustomerLoading(false);
    });
  };

  useEffect(() => {
    if (chanelsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllChanel());
    }
    if (inventoryItemsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllItem());
    }
    if (citiesFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllCities());
    }
  }, []);

  return (
    <>
      <Formik
        innerRef={orderForm}
        initialValues={{
          customerId: '',
          first_name: first_name || '',
          last_name: last_name || '',
          email: email || '',
          phone: phone || '',
          note: note || '',
          remarks: remarks || '',
          chanel_id: chanel_id || '',
          brand_id: brand_id || '',
          addressId: '',
          address1: address1 || '',
          address2: address2 || '',
          city: city || '',
          zip: zip || '',
          province: province || '',
          itemId: '',
          item: '',
          quantity: '',
          price: '',
          discount: '',
          sku: '',
          grams: ''
        }}
        validationSchema={Yup.object().shape({
          first_name: Yup.string().max(255).required('First Name is required'),
          last_name: Yup.string().max(255),
          note: Yup.string(),
          remarks: Yup.string(),
          chanel_id: Yup.string().required('Please select sale channel.'),
          phone: Yup.number().min(11).required('Phone is required'),
          email: Yup.string().email('Must be a valid email').max(255),
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
        {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue, setFieldError, setTouched }) => (
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
                        endAdornment={
                          <InputAdornment>
                            <IconButton
                              aria-label="search customer"
                              onClick={() => searchCustomer(values.phone)}
                              onMouseDown={() => searchCustomer(values.phone)}
                            >
                              {customerLoading ? <LoadingOutlined /> : <SearchOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
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
                      <InputLabel htmlFor="chanel_id">Select Sales Chanel</InputLabel>
                      <Autocomplete
                        options={chanels.map((chanel) => ({ id: chanel.id, label: chanel.name, brand_id: chanel?.brand?.id }))}
                        id="chanel_id"
                        name="chanel_id"
                        value={values.chanel_id !== '' ? chanels.find((c) => c.id === values.chanel_id)?.name : ''}
                        onBlur={handleBlur}
                        onChange={(event, newValue) => {
                          if (newValue === '' || newValue === null) {
                            setFieldValue('chanel_id', '');
                            setFieldValue('brand_id', '');
                            return;
                          }
                          setFieldValue('chanel_id', newValue.id);
                          setFieldValue('brand_id', newValue.brand_id);
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
                      {touched.chanel_id && errors.chanel_id && (
                        <FormHelperText error id="helper-text-chanel_id-signup">
                          {errors.chanel_id}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
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
                      <InputLabel htmlFor="city">Select City {`${values.city !== '' ? '(' + values.city + ')' : ''}`}</InputLabel>
                      <Autocomplete
                        options={cities}
                        id="city"
                        name="city"
                        value={values.city !== '' ? values.city : ''}
                        onBlur={handleBlur}
                        onChange={(event, newValue) => {
                          if (newValue === '' || newValue === null) {
                            setFieldValue('city', '');
                            return;
                          }
                          setFieldValue('city', newValue);
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
                              placeholder: 'Lahore',
                              style: {
                                padding: 8
                              }
                            }}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      />
                      {touched.city && errors.city && (
                        <FormHelperText error id="helper-text-city-signup">
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
              {/* Other detail start */}
              <Grid item xs={12}>
                <Divider color="error">Other Details</Divider>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="remarks">Remarks</InputLabel>
                      <OutlinedInput
                        multiline
                        rows={2}
                        id="remarks"
                        type="remarks"
                        value={values.remarks}
                        name="remarks"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Any remarks"
                        fullWidth
                        error={Boolean(touched.remarks && errors.remarks)}
                      />
                      {touched.remarks && errors.remarks && (
                        <FormHelperText error id="helper-text-remarks">
                          {errors.remarks}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              {/* Other details end */}
              {/* Payment start */}
              <Grid item xs={12}>
                <Divider color="error">
                  <Button
                    style={{ height: 41 }}
                    onClick={showAddTranscationModal}
                    startIcon={<PlusOutlined />}
                    variant="outlined"
                    aria-label="add"
                    color="primary"
                  >
                    Add Advanced Payments
                  </Button>
                </Divider>
              </Grid>
              {payments.length > 0 && (
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <TableContainer>
                        <Table sx={{ minWidth: 400 }} aria-label="spanning table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="right">Type</TableCell>
                              <TableCell align="right">Bank</TableCell>
                              <TableCell align="right">Transcation Id</TableCell>
                              <TableCell align="right">Amount</TableCell>
                              <TableCell align="right">Note</TableCell>
                              <TableCell align="right">Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {payments.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell align="right">{row.type}</TableCell>
                                <TableCell align="right">{row.bank}</TableCell>
                                <TableCell align="right">{row.tid}</TableCell>
                                <TableCell align="right">{row.amount}</TableCell>
                                <TableCell align="right">{row.note}</TableCell>
                                <TableCell align="right">
                                  <IconButton
                                    onClick={() => setPayments((payments) => payments.filter((payment) => payment.id !== row.id))}
                                    aria-label="delete"
                                  >
                                    <CloseOutlined />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {/* Payment end */}
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
                          if (newValue === '' || newValue === null) {
                            setFieldValue('itemId', '');
                            setFieldValue('item', '');
                            setFieldValue('price', '');
                            setFieldValue('sku', '');
                            setFieldValue('grams', '');
                            setFieldValue('discount', '');
                            return;
                          }
                          setFieldValue('itemId', newValue.id);
                          setFieldValue('item', newValue.label);
                          setFieldValue('price', newValue.price);
                          setFieldValue('sku', newValue.sku);
                          setFieldValue('grams', newValue.grams);
                          setFieldValue('discount', 0);
                          setFieldValue('quantity', 1);
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
                  <Grid item xs={2}>
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
                  <Grid item xs={2}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="price">Price</InputLabel>
                      <OutlinedInput
                        fullWidth
                        disabled
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
                  <Grid item xs={2}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="discount">Discount</InputLabel>
                      <OutlinedInput
                        endAdornment={<InputAdornment>%</InputAdornment>}
                        fullWidth
                        error={Boolean(touched.discount && errors.discount)}
                        id="discount"
                        type="text"
                        value={values.discount}
                        name="discount"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="10"
                        inputProps={{}}
                      />
                      {touched.discount && errors.discount && (
                        <FormHelperText error id="helper-text-discount">
                          {errors.discount}
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
                          console.log(touched.quantity, errors.quantity);
                          console.log(touched.item, errors.item);
                          if (!values.item) {
                            setFieldError('item', 'Please add item name');
                            return;
                          } else if (!values.quantity) {
                            setFieldError('quantity', 'Please add item quantity');
                            return;
                          } else {
                            let price = values.price;
                            if (values?.discount > 0) {
                              const discount = (values.discount / 100) * values.price;
                              price -= discount;
                            }
                            addItem(
                              values.itemId,
                              values.item,
                              values.quantity,
                              values.price,
                              price,
                              values.discount,
                              values.sku,
                              values.grams
                            );
                            setFieldValue('itemId', '');
                            setFieldValue('item', '');
                            setFieldValue('quantity', '');
                            setFieldValue('price', '');
                            setFieldValue('sku', '');
                            setFieldValue('grams', '');
                            setFieldValue('discount', '');
                            // setTouched({ ...touched, quantity: false, item: false, discount: false });
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
              <Grid item mt={5} xs={12}>
                <Divider color="error">Items</Divider>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table sx={{ minWidth: 400 }} aria-label="spanning table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Qty.</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Disc</TableCell>
                        <TableCell align="right">Net</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={() => {
                                const i = items[index];
                                i.quantity > 1 ? i.quantity-- : null;
                                const updateItems = items.toSpliced(index, 1, i);
                                setItems(updateItems);
                              }}
                              color="error"
                              aria-label="delete"
                            >
                              <MinusOutlined />
                            </IconButton>{' '}
                            {row.quantity}{' '}
                            <IconButton
                              onClick={() => {
                                const i = items[index];
                                i.quantity++;
                                const updateItems = items.toSpliced(index, 1, i);
                                setItems(updateItems);
                              }}
                              color="success"
                              aria-label="delete"
                            >
                              <PlusOutlined />
                            </IconButton>
                          </TableCell>
                          <TableCell align="right">{row.unit || row.price}</TableCell>
                          <TableCell align="right">{row.discount}%</TableCell>
                          <TableCell align="right">{(row.price * row.quantity).toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => showUpdatePriceModal(index, row)} aria-label="update price">
                              <PriceChangeIcon />
                            </IconButton>
                            <IconButton onClick={() => setItems((items) => items.filter((item) => item.id !== row.id))} aria-label="delete">
                              <CloseOutlined />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell colSpan={3} align="right">
                          Total
                        </TableCell>
                        <TableCell align="right">
                          {items.reduce((pre, item) => parseFloat((item.unit || item.price) * item.quantity) + pre, 0)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell colSpan={3} align="right">
                          Discount
                        </TableCell>
                        <TableCell align="right">
                          {items.reduce((pre, item) => ((item.discount || 0) / 100) * (item.unit || item.price) + pre, 0).toFixed(2)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell colSpan={3} align="right">
                          Net Total
                        </TableCell>
                        <TableCell align="right">{items.reduce((pre, item) => item.price * item.quantity + pre, 0).toFixed(2)}</TableCell>
                        <TableCell></TableCell>
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
                    {order ? 'Update Order' : 'Create new order'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      <Modal
        open={showTransactionModal}
        onClose={hideAddTranscationModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TransactionModal addPayment={handleAddPayment} />
        </Box>
      </Modal>
      <Modal
        open={updatePriceModal}
        onClose={hideUpdatePriceModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <UpdateItemPriceModal itemForUpdate={itemForUpdate} updateItem={updateItemPrice} hideModal={hideUpdatePriceModal} />
        </Box>
      </Modal>
    </>
  );
};

export default CreateOrderForm;
