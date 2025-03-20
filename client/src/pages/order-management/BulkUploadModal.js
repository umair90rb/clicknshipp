import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Stack, ListItemText, InputLabel, Button, Select, MenuItem } from '@mui/material';
import { setMessage } from 'store/slices/util/utilSlice';
import { chanelChanelsSelector, chanelIsLoadingSelector } from 'store/slices/chanel/chanelSelector';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchAllOrder, fetchImportOrder } from 'store/slices/order/fetchOrder';
import {
  orderFiltersSelector,
  orderImportIsLoadingSelector,
  orderPageSelector,
  orderPageSizeSelector,
  orderSortSelector
} from 'store/slices/order/orderSelector';
import FormHelperTextComponent from 'components/FormHelperTextComponent';
import CustomDialog from 'components/CustomDialog';
import CustomFileInput from 'components/CustomFileInput';
import useChannelsFetch from 'hooks/useChannelsFetch';

export default function BulkUploadModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const page = useSelector(orderPageSelector);
  const pageSize = useSelector(orderPageSizeSelector);
  const filters = useSelector(orderFiltersSelector);
  const sortModel = useSelector(orderSortSelector);
  const orderImportIsLoading = useSelector(orderImportIsLoadingSelector);
  const chanels = useSelector(chanelChanelsSelector);
  const chanelsIsLoading = useSelector(chanelIsLoadingSelector);

  useChannelsFetch();

  const createBulkOrders = async (values) => {
    let formData = new FormData();
    formData.append('file', values.file);
    formData.append('chanel_id', values.chanel_id);
    const { type, payload } = await dispatch(fetchImportOrder({ body: formData }));
    if (type === 'order/import/fetch/fulfilled') {
      dispatch(
        fetchAllOrder({ body: { sort: sortModel, page: filters.length ? 0 : page, pageSize: filters.length ? 100 : pageSize, filters } })
      );
      dispatch(setMessage({ message: payload?.data?.message || 'Order created successfully.', type: 'success' }));
      onClose();
      bulkOrderUploadForm.handleReset();
    } else if (type === 'order/import/fetch/rejected') {
      dispatch(setMessage({ message: payload?.error || 'Error! Something goes wrong!', type: 'error' }));
    }
  };

  const bulkOrderUploadForm = useFormik({
    initialValues: {
      file: '',
      chanel_id: ''
    },
    validationSchema: Yup.object({
      file: Yup.mixed().required('Please select file to upload'),
      chanel_id: Yup.number().required('Please select channel!')
    }),
    onSubmit: createBulkOrders
  });

  useEffect(() => {
    if (visible) {
      bulkOrderUploadForm.handleReset();
    }
  }, [visible]);

  return (
    <CustomDialog
      actions={[{ text: 'Upload', onClick: bulkOrderUploadForm.handleSubmit, disable: orderImportIsLoading }]}
      visible={visible}
      onClose={onClose}
      title="Import Orders"
      maxWidth="sm"
    >
      <Grid container gap={1} spacing={1} my={2}>
        <CustomFileInput
          label={bulkOrderUploadForm.values.file && bulkOrderUploadForm.values.file.name}
          error={bulkOrderUploadForm.touched.file && bulkOrderUploadForm.errors.file}
          onChange={(e) => {
            bulkOrderUploadForm.setFieldValue('file', e.target.files[0]);
            e.target.value = '';
          }}
          name="file"
          link="https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=11K1q6jyzBRe1RCGVadk_jv-vN7T8n5tqG-idMIx3Ym0&exportFormat=xlsx"
        />
      </Grid>

      <Grid item xs={12}>
        <Stack spacing={1}>
          <InputLabel htmlFor="chanel_id-signup">Chanel</InputLabel>
          <Select
            fullWidth
            error={Boolean(bulkOrderUploadForm.touched.chanel_id && bulkOrderUploadForm.errors.chanel_id)}
            id="chanel_id-signup"
            value={bulkOrderUploadForm.values.chanel_id}
            name="chanel_id"
            onBlur={bulkOrderUploadForm.handleBlur}
            onChange={bulkOrderUploadForm.handleChange}
            labelId="chanel_id-signup"
          >
            {chanels.map(({ name, id }, index) => (
              <MenuItem key={index} value={id}>
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
          <FormHelperTextComponent
            id="channel_id"
            loading={chanelsIsLoading}
            error={bulkOrderUploadForm.touched.chanel_id && bulkOrderUploadForm.errors.chanel_id}
          />
        </Stack>
      </Grid>
    </CustomDialog>
  );
}
