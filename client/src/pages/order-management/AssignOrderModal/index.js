import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilteredUsers } from 'store/slices/user/fetchUser';
import { Modal, Box, Grid, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Chip } from '@mui/material';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import { fetchAssignOrders, fetchFilteredOrder } from 'store/slices/order/fetchOrder';
import { setMessage } from 'store/slices/util/utilSlice';
// import useAssignOrderForm from './useAssignOrderForm';
import { brandBrandsSelector, brandIsLoadingSelector } from 'store/slices/brand/brandSelector';
import { fetchAllBrand } from 'store/slices/brand/fetchBrand';
import { fetchFilteredChanel } from 'store/slices/chanel/fetchChanel';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// import moment from '../../../../node_modules/moment/moment';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

export default function AssignOrderModal({ visible, onClose }) {
  const dispatch = useDispatch();
  // const assignOrderForm = useAssignOrderForm();
  const brands = useSelector(brandBrandsSelector);
  const brandsIsLoading = useSelector(brandIsLoadingSelector);

  const [chanelsLoading, setChanelsLoading] = useState(false);
  const [chanelError, setChaneError] = useState(null);
  const [chanels, setChanels] = useState([]);

  const [assigneelsLoading, setAssigneelsLoading] = useState(false);
  const [assigneeError, setAssigneeError] = useState(null);
  const [assignee, setAssignee] = useState([]);

  const [orderToAssignIsLoading, setOrderToAssignlsLoading] = useState(false);

  const [assigning, setAssigning] = useState(false);

  const assignOrderForm = useFormik({
    initialValues: {
      brand: null,
      chanel: null,
      users: [],
      type: '',
      orders: [],
      assignee: []
    },
    validationSchema: Yup.object().shape({
      brand: Yup.mixed()
        .test('is-number-or-string', 'Must be a number or a string!', (value) => typeof value === 'number' || typeof value === 'string')
        .required('Please select brand!'),
      chanel: Yup.mixed()
        .test('is-number-or-string', 'Must be a number or a string!', (value) => typeof value === 'number' || typeof value === 'string')
        .required('Please select chanel!'),
      type: Yup.string().required('Please select orders type that need to assign/reassign!'),
      users: Yup.array().of(
        Yup.mixed().test(
          'is-number-or-string',
          'Must be a number or a string!',
          (value) => typeof value === 'number' || typeof value === 'string'
        )
      ),
      orders: Yup.array().of(Yup.number()).min(1, 'Please add at least one order to be assigned!'),
      assignee: Yup.array()
        .of(
          Yup.mixed().test(
            'is-number-or-string',
            'Must be a number or a string!',
            (value) => typeof value === 'number' || typeof value === 'string'
          )
        )
        .min(1, 'Please add at least one agent to assign order!')
    }),
    onSubmit: async (values) => {
      setAssigning(true);
      const _assignee = values.assignee.length === 1 && values.assignee[0] === 'All' ? assignee.map((a) => a.id) : values.assignee;
      const { type, payload } = await dispatch(fetchAssignOrders({ body: { agentIds: _assignee, orderIds: values.orders } }));
      if (type === 'assign/orders/fetch/fulfilled') {
        onClose();
        dispatch(setMessage({ type: 'success', message: payload?.data?.message }));
      } else {
        dispatch(setMessage({ type: 'error', message: payload?.error?.message || 'Something goes wrong!' }));
      }
      setAssigning(false);
    }
  });

  const getAssignee = async (brand) => {
    setAssigneelsLoading(true);
    const body = {
      permissions: [PERMISSIONS.PERMISSION_ASSIGN_ORDERS]
    };

    if (brand && brand !== 'All') {
      body['brand'] = [brand];
    }

    const { type, payload } = await dispatch(
      fetchFilteredUsers({
        body
      })
    );
    if (type === 'users/filtered/fetch/fulfilled') {
      setAssignee(payload?.data.users);
      setAssigneeError(null);
    } else {
      setAssigneeError(payload?.data.error || 'Error in loading assignee');
    }
    setAssigneelsLoading(false);
  };

  const getOrdersToAssign = async (brand, chanel, users, orderType) => {
    setOrderToAssignlsLoading(true);
    const { type, payload } = await dispatch(
      fetchFilteredOrder({
        body: {
          brand: brand && brand !== 'All' ? [brand] : [],
          chanel: chanel && chanel !== 'All' ? [chanel] : [],
          // startPeriod: moment(new Date()).startOf('day').format('YYYY-MM-DDTHH:MM'),
          // endPeriod: moment(new Date()).format('YYYY-MM-DDTHH:MM'),
          users: users && users.length === 1 && users[0] === 'All' ? [] : users,
          type: orderType
        }
      })
    );
    if (type === 'orders/filtered/fetch/fulfilled') {
      assignOrderForm.setFieldValue('orders', payload?.data.orders);
      assignOrderForm.setFieldError('orders', null);
    } else {
      assignOrderForm.setFieldError('orders', payload?.data.error || 'Error in loading orders');
    }
    setOrderToAssignlsLoading(false);
  };

  const fetchChannels = async (id) => {
    setChanelsLoading(true);
    const { type, payload } = await dispatch(fetchFilteredChanel({ body: { brand: id && id !== 'All' ? [id] : [] } }));
    if (type === 'chanel/filtered/fetch/fulfilled') {
      setChanels(payload?.data.chanel);
      setChaneError('');
    } else {
      setChaneError(payload?.data.error || 'Error in loading chanels');
    }
    setChanelsLoading(false);
  };

  useEffect(() => {
    setAssignee([]);
    setChanels([]);
    dispatch(fetchAllBrand());
  }, []);

  useEffect(() => {
    if (assignOrderForm?.values?.brand) {
      fetchChannels(assignOrderForm?.values?.brand);
      assignOrderForm.setFieldValue('users', []);
      setAssignee([]);
      getAssignee(assignOrderForm?.values?.brand);
    }
  }, [assignOrderForm?.values?.brand]);

  useEffect(() => {
    if (assignOrderForm.values.brand && assignOrderForm.values.chanel && assignOrderForm.values.users && assignOrderForm.values.type) {
      getOrdersToAssign(
        assignOrderForm.values.brand,
        assignOrderForm.values.chanel,
        assignOrderForm.values.users,
        assignOrderForm.values.type
      );
    }
  }, [assignOrderForm.values.type]);

  useEffect(() => {
    if (!visible) {
      assignOrderForm.resetForm();
      setAssigneeError(null);
      setChaneError(null);
    }
  }, [visible]);

  return (
    <Modal open={visible} onClose={onClose} aria-labelledby="assign-order-modal" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="brand-label">Select Brand</InputLabel>
          <Select
            labelId="brand-label"
            id="brand"
            name="brand"
            label="Select Brand"
            value={assignOrderForm.values?.brand}
            error={assignOrderForm.touched.brand && assignOrderForm.errors.brand}
            onBlur={assignOrderForm.handleBlur}
            onChange={assignOrderForm.handleChange}
          >
            <MenuItem key={0} value="All">
              All
            </MenuItem>
            {brands.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
          {brandsIsLoading && <FormHelperText sx={{ m: 0 }}>Loading...</FormHelperText>}
          {assignOrderForm.touched.brand && !!assignOrderForm.errors.brand && (
            <FormHelperText sx={{ m: 0 }} error id="helper-text-brand">
              {assignOrderForm.errors.brand}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="chanel-label">Select Chanel</InputLabel>
          <Select
            labelId="chanel-label"
            id="chanel"
            name="chanel"
            label="Select Chanel"
            value={assignOrderForm.values?.chanel}
            error={assignOrderForm.touched.chanel && assignOrderForm.errors.chanel}
            onBlur={assignOrderForm.handleBlur}
            onChange={assignOrderForm.handleChange}
          >
            <MenuItem key={0} value={chanels?.length ? 'All' : null}>
              {chanels?.length ? 'All' : 'No item'}
            </MenuItem>
            {chanels.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
          {chanelsLoading && <FormHelperText sx={{ m: 0 }}>Loading...</FormHelperText>}
          {(chanelError || (assignOrderForm.touched.chanel && !!assignOrderForm.errors.chanel)) && (
            <FormHelperText sx={{ m: 0 }} error id="helper-text-chanel">
              {chanelError || assignOrderForm.errors.chanel}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="users-label">Select Agents</InputLabel>
          <Select
            labelId="users-label"
            id="users"
            name="users"
            label="Select users"
            multiple
            value={assignOrderForm.values?.users}
            error={assignOrderForm.touched.users && assignOrderForm.errors.users}
            onBlur={assignOrderForm.handleBlur}
            onChange={assignOrderForm.handleChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 5 }}
                    key={value}
                    label={value === 'All' ? 'All' : assignee.find((a) => a.id === value)?.name}
                  />
                ))}
              </Box>
            )}
          >
            <MenuItem key={0} value={assignee?.length ? 'All' : null}>
              {assignee?.length ? 'All' : 'No item'}
            </MenuItem>
            {assignee.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
          {assigneelsLoading && <FormHelperText sx={{ m: 0 }}>Loading...</FormHelperText>}
          {(assigneeError || (assignOrderForm.touched.users && !!assignOrderForm.errors.users)) && (
            <FormHelperText sx={{ m: 0 }} error id="helper-text-chanel">
              {assigneeError || assignOrderForm.errors.users}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="type-label">Select Order Type</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            name="type"
            label="Select Order Type"
            value={assignOrderForm.values.type}
            error={assignOrderForm.touched.type && assignOrderForm.errors.type}
            onBlur={assignOrderForm.handleBlur}
            onChange={assignOrderForm.handleChange}
          >
            {assignOrderForm.values.brand &&
              assignOrderForm.values.chanel &&
              assignOrderForm.values.users && [
                <MenuItem key={0} value="All">
                  All
                </MenuItem>,
                <MenuItem key={1} value="unassigned">
                  Unassigned
                </MenuItem>,
                <MenuItem key={2} value="assigned_not_confirmed">
                  Assigned not confirmed yet!
                </MenuItem>
                // <MenuItem key={3} value="today_no_pick">
                //   Today No Pick!
                // </MenuItem>
              ]}
          </Select>
          {assignOrderForm.touched.type && !!assignOrderForm.errors.type && (
            <FormHelperText sx={{ m: 0 }} error id="helper-text-type">
              {assignOrderForm.errors.type}
            </FormHelperText>
          )}
        </FormControl>

        <FormHelperText sx={{ m: 0 }} id="helper-text-orders">
          {orderToAssignIsLoading ? 'Loading...' : `${assignOrderForm.values.orders.length} orders found with this criteria.`}
        </FormHelperText>

        {assignOrderForm.touched.orders && !!assignOrderForm.errors.orders && (
          <FormHelperText sx={{ m: 0 }} error id="helper-text-orders">
            {assignOrderForm.errors.orders}
          </FormHelperText>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel id="assignee-label">Select Agents</InputLabel>
          <Select
            labelId="assignee-label"
            id="assignee"
            name="assignee"
            label="Select assignee"
            multiple
            value={assignOrderForm.values?.assignee}
            error={assignOrderForm.touched.assignee && assignOrderForm.errors.assignee}
            onBlur={assignOrderForm.handleBlur}
            onChange={assignOrderForm.handleChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 5 }}
                    key={value}
                    label={value === 'All' ? 'All' : assignee.find((a) => a.id === value)?.name}
                  />
                ))}
              </Box>
            )}
          >
            <MenuItem key={0} value={assignee?.length ? 'All' : null}>
              {assignee?.length ? 'All' : 'No item'}
            </MenuItem>
            {assignee.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
          {assigneelsLoading && <FormHelperText sx={{ m: 0 }}>Loading...</FormHelperText>}
          {(assigneeError || (assignOrderForm.touched.assignee && !!assignOrderForm.errors.assignee)) && (
            <FormHelperText sx={{ m: 0 }} error id="helper-text-assignee">
              {assigneeError || assignOrderForm.errors.assignee}
            </FormHelperText>
          )}
        </FormControl>

        <Grid container sx={{ flexGrow: 1, mt: 1 }}>
          <Grid xs display="flex" justifyContent="center" alignItems="center">
            <Button onClick={assignOrderForm.handleSubmit} disabled={assigning} sx={{ flexGrow: 1 }} variant="contained">
              Assign
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
