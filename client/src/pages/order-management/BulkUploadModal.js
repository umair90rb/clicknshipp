import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Stack, FormHelperText, ListItemText, InputLabel, Button, Select, MenuItem, Box, Modal, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { setMessage } from 'store/slices/util/utilSlice';
import { fetchAllChanel } from 'store/slices/chanel/fetchChanel';
import { chanelChanelsSelector, chanelFetchStatusSelector, chanelIsLoadingSelector } from 'store/slices/chanel/chanelSelector';
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
import { brandBrandsSelector, brandFetchStatusSelector, brandIsLoadingSelector } from 'store/slices/brand/brandSelector';
import FormHelperTextComponent from 'components/LoadingHelperText';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllBrand } from 'store/slices/brand/fetchBrand';

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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});

export default function BulkUploadModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const page = useSelector(orderPageSelector);
  const pageSize = useSelector(orderPageSizeSelector);
  const filters = useSelector(orderFiltersSelector);
  const sortModel = useSelector(orderSortSelector);
  const orderImportIsLoading = useSelector(orderImportIsLoadingSelector);
  const chanels = useSelector(chanelChanelsSelector);
  const chanelsIsLoading = useSelector(chanelIsLoadingSelector);
  const chanelFetchStatus = useSelector(chanelFetchStatusSelector);

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
      if (chanelFetchStatus !== fetchStatus.SUCCESS) {
        dispatch(fetchAllChanel());
      }
    }
  }, [visible]);

  return (
    <Modal open={visible} onClose={onClose}>
      <Box sx={style}>
        <Typography display="flex" justifyContent="center" alignItems="center">
          Add Bulk Orders
        </Typography>
        <Grid container gap={1} spacing={1} my={2}>
          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Button sx={{ flexGrow: 1 }} component="label" variant="contained">
              {(bulkOrderUploadForm.values.file && bulkOrderUploadForm.values.file.name) || 'Select file (Not Selected)'}
              <VisuallyHiddenInput
                type="file"
                name="file"
                onChange={(e) => {
                  bulkOrderUploadForm.setFieldValue('file', e.target.files[0]);
                  e.target.value = '';
                }}
              />
            </Button>
            {bulkOrderUploadForm.touched.file && bulkOrderUploadForm.errors.file && (
              <FormHelperText error id="helper-text-file-signup">
                {bulkOrderUploadForm.errors.file}
              </FormHelperText>
            )}
          </Stack>
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
            <FormHelperTextComponent loading={chanelsIsLoading} />
            {bulkOrderUploadForm.touched.chanel_id && bulkOrderUploadForm.errors.chanel_id && (
              <FormHelperText error id="helper-text-chanel_id-signup">
                {bulkOrderUploadForm.errors.chanel_id}
              </FormHelperText>
            )}
          </Stack>
        </Grid>

        <Grid container spacing={1} mt={5}>
          <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
            <Button onClick={bulkOrderUploadForm.handleSubmit} sx={{ flexGrow: 1 }} disable={orderImportIsLoading} variant="contained">
              Upload
            </Button>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
            <Link
              target="_blank"
              href="https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=11K1q6jyzBRe1RCGVadk_jv-vN7T8n5tqG-idMIx3Ym0&exportFormat=xlsx"
            >
              Download Bulk Order Upload Excel Format
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
