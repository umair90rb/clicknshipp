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
import CustomSelect from 'components/CustomSelect';
import useStoreLocationFetch from 'hooks/useStoreLocationFetch';
import { locationIsLoadingSelector, locationListSelector } from 'store/slices/location/locationSelector';
import CustomRadioGroup from 'components/CustomRadioGroup';

export default function ImportOpeningStockModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const storeLocations = useSelector(locationListSelector);
  const storeLocationsIsLoading = useSelector(locationIsLoadingSelector);

  useStoreLocationFetch();

  const createBulkOrders = async (values) => {
    let formData = new FormData();
    formData.append('file', values.file);
    formData.append('store_id', values.store_id);
    formData.append('stock_type', values.stock_type);
    const { type, payload } = await dispatch(fetchImportOrder({ body: formData }));
    if (type === 'order/import/fetch/fulfilled') {
      dispatch(
        fetchAllOrder({ body: { sort: sortModel, page: filters.length ? 0 : page, pageSize: filters.length ? 100 : pageSize, filters } })
      );
      dispatch(setMessage({ message: payload?.data?.message || 'Order created successfully.', type: 'success' }));
      onClose();
      importOpeningStockForm.handleReset();
    } else if (type === 'order/import/fetch/rejected') {
      dispatch(setMessage({ message: payload?.error || 'Error! Something goes wrong!', type: 'error' }));
    }
  };

  const importOpeningStockForm = useFormik({
    initialValues: {
      file: '',
      store_id: '',
      stock_type: 'raw_material'
    },
    validationSchema: Yup.object({
      file: Yup.mixed().required('Please select file to upload'),
      store_id: Yup.number().required('Please select store'),
      stock_type: Yup.string().required('Please select type')
    }),
    onSubmit: createBulkOrders
  });

  useEffect(() => {
    if (visible) {
      importOpeningStockForm.handleReset();
    }
  }, [visible]);

  return (
    <CustomDialog
      actions={[
        <Button key="1" onClick={importOpeningStockForm.handleSubmit} variant="contained">
          Upload
        </Button>
      ]}
      visible={visible}
      onClose={onClose}
      title="Import Opening Stock"
      maxWidth="sm"
    >
      <Grid container gap={1} spacing={1}>
        <Grid item xs={12}>
          <CustomFileInput
            label={importOpeningStockForm.values.file && importOpeningStockForm.values.file.name}
            error={importOpeningStockForm.touched.file && importOpeningStockForm.errors.file}
            onChange={(e) => {
              importOpeningStockForm.setFieldValue('file', e.target.files[0]);
              e.target.value = '';
            }}
            name="file"
            link="https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=11K1q6jyzBRe1RCGVadk_jv-vN7T8n5tqG-idMIx3Ym0&exportFormat=xlsx"
          />
        </Grid>

        <Grid item xs={12}>
          <CustomRadioGroup
            row
            label="Select Stock Type"
            name="stock_type"
            value={importOpeningStockForm.values.stock_type}
            onChange={importOpeningStockForm.handleChange}
            error={importOpeningStockForm.touched.stock_type && importOpeningStockForm.errors.stock_type}
            radios={[
              { label: 'Finished Products', value: 'finished_product' },
              { label: 'Raw Material', value: 'raw_material' },
              { label: 'Packaging Material', value: 'packaging_material' }
            ]}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomSelect
            label="Select Store"
            name="store_id"
            error={importOpeningStockForm.touched.store_id && importOpeningStockForm.errors.store_id}
            value={importOpeningStockForm.values.store_id}
            options={storeLocations.map(({ name, id }) => ({ label: name, value: id }))}
            onBlur={importOpeningStockForm.handleBlur}
            onChange={importOpeningStockForm.handleChange}
            loading={storeLocationsIsLoading}
          />
        </Grid>
      </Grid>
    </CustomDialog>
  );
}
