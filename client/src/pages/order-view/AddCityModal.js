import { useRef, useEffect } from 'react';
import {
  Grid,
  Stack,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  ListItemText,
  OutlinedInput,
  FormHelperText,
  Modal,
  Box,
  Divider,
  Button
} from '@mui/material';
import fetchStatus from 'constants/fetchStatuses';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import {
  deliveryServiceAccountsFetchStatusSelector,
  deliveryServiceAccountsListSelector
} from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSelector';
import { fetchDeliveryServiceAccounts } from 'store/slices/deliveryServicesAccounts/fetchDeliveryServicesAccounts';
import { fetchCreateCity } from 'store/slices/city/fetchCity';
import { cityCreateErrorSelector, cityCreateFetchStatusSelector, cityCreateIsLoadingSelector } from 'store/slices/city/citySelector';
import { setMessage } from 'store/slices/util/utilSlice';

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

export default function AddCityModal({ service_id, city, visible, onClose }) {
  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const createCityIsLoading = useSelector(cityCreateIsLoadingSelector);
  const createCityFetchStatus = useSelector(cityCreateFetchStatusSelector);
  const createCityError = useSelector(cityCreateErrorSelector);
  const addCityForm = useFormik({
    initialValues: {
      service_id: service_id || '',
      city: city || '',
      maped: '',
      assigned_id: '',
      code: ''
    },
    validationSchema: Yup.object({
      service_id: Yup.number().required('Please select courier service!'),
      city: Yup.string().required('Please add city'),
      maped: Yup.string().required('Please add city same in the courier dashboard!'),
      assigned_id: Yup.number(),
      code: Yup.string()
    }),
    onSubmit: (values) => dispatch(fetchCreateCity({ body: values }))
  });

  const servicesList = useSelector(deliveryServiceAccountsListSelector);
  const servicesListFetchStatus = useSelector(deliveryServiceAccountsFetchStatusSelector);
  const servicesListIsLoading = servicesListFetchStatus === fetchStatus.REQUEST;

  useEffect(() => {
    if (servicesListFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchDeliveryServiceAccounts());
    }
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (createCityFetchStatus === fetchStatus.SUCCESS) {
      dispatch(setMessage({ message: 'City added!', type: 'success' }));
      onClose();
    } else if (createCityFetchStatus === fetchStatus.FAILURE) {
      dispatch(setMessage({ message: createCityError || 'City not added!', type: 'error' }));
    }
  }, [createCityFetchStatus]);

  useEffect(() => {
    if (!visible) {
      addCityForm.handleReset();
    }
  }, [visible]);

  return (
    <Modal open={visible} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography align="center">Add missing city for courier service</Typography>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="service_id-signup">Courier Service {servicesListIsLoading && 'Loading...'}</InputLabel>
              <Select
                fullWidth
                error={Boolean(addCityForm.touched.service_id && addCityForm.errors.service_id)}
                id="service_id-signup"
                value={addCityForm.values.service_id}
                name="service_id"
                onBlur={addCityForm.handleBlur}
                onChange={addCityForm.handleChange}
                inputProps={{}}
                labelId="service_id-signup"
              >
                {servicesList.map(({ name, id }, index) => (
                  <MenuItem key={index} value={id}>
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
              {addCityForm.touched.service_id && addCityForm.errors.service_id && (
                <FormHelperText error id="helper-text-service_id-signup">
                  {addCityForm.errors.service_id}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item sx={{ flexGrow: 1 }}>
            <Stack spacing={1}>
              <InputLabel htmlFor="city">City</InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(addCityForm.touched.city && addCityForm.errors.city)}
                id="city"
                type="text"
                value={addCityForm.values.city}
                name="city"
                onBlur={addCityForm.handleBlur}
                onChange={addCityForm.handleChange}
                placeholder="Dina"
                inputProps={{}}
              />
              {addCityForm.touched.city && addCityForm.errors.city && (
                <FormHelperText error id="helper-text-city">
                  {addCityForm.errors.city}
                </FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item sx={{ flexGrow: 1 }}>
            <Stack spacing={1}>
              <InputLabel htmlFor="maped">City name in courier dashboard</InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(addCityForm.touched.maped && addCityForm.errors.maped)}
                id="maped"
                type="text"
                value={addCityForm.values.maped}
                name="maped"
                onBlur={addCityForm.handleBlur}
                onChange={addCityForm.handleChange}
                placeholder="Dina, DINA"
                inputProps={{}}
              />
              {addCityForm.touched.maped && addCityForm.errors.maped && (
                <FormHelperText error id="helper-text-city">
                  {addCityForm.errors.maped}
                </FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item sx={{ flexGrow: 1 }}>
            <Stack spacing={1}>
              <InputLabel htmlFor="assigned_id">City assigned Id in courier dashboard (if any)</InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(addCityForm.touched.assigned_id && addCityForm.errors.assigned_id)}
                id="assigned_id"
                type="text"
                value={addCityForm.values.assigned_id}
                name="assigned_id"
                onBlur={addCityForm.handleBlur}
                onChange={addCityForm.handleChange}
                placeholder="Dina"
                inputProps={{}}
              />
              {addCityForm.touched.assigned_id && addCityForm.errors.assigned_id && (
                <FormHelperText error id="helper-text-city">
                  {addCityForm.errors.assigned_id}
                </FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item sx={{ flexGrow: 1 }}>
            <Stack spacing={1}>
              <InputLabel htmlFor="code">City code in courier dashboard (if any)</InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(addCityForm.touched.code && addCityForm.errors.code)}
                id="code"
                type="text"
                value={addCityForm.values.code}
                name="code"
                onBlur={addCityForm.handleBlur}
                onChange={addCityForm.handleChange}
                placeholder="Dina"
                inputProps={{}}
              />
              {addCityForm.touched.code && addCityForm.errors.code && (
                <FormHelperText error id="helper-text-city">
                  {addCityForm.errors.code}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item sx={{ flexGrow: 1 }}>
            <Button fullWidth disabled={createCityIsLoading} color="primary" onClick={addCityForm.handleSubmit} variant="contained">
              Add Missing City
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
