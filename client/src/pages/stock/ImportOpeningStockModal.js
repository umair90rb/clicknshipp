import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { setMessage } from 'store/slices/util/utilSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchAllOrder, fetchImportOrder } from 'store/slices/order/fetchOrder';
import CustomDialog from 'components/CustomDialog';
import CustomFileInput from 'components/CustomFileInput';
import CustomSelect from 'components/CustomSelect';
import useStoreLocationFetch from 'hooks/useStoreLocationFetch';
import { locationIsLoadingSelector, locationListSelector } from 'store/slices/location/locationSelector';
import CustomRadioGroup from 'components/CustomRadioGroup';
import useResetForm from 'hooks/useResetForm';
import { fetchImportOpeningStock } from 'store/slices/stock/fetchStock';

export default function ImportOpeningStockModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const storeLocations = useSelector(locationListSelector);
  const storeLocationsIsLoading = useSelector(locationIsLoadingSelector);

  useStoreLocationFetch();

  const createBulkOrders = async (values) => {
    let formData = new FormData();
    formData.append('file', values.file);
    formData.append('location_id', values.location_id);
    formData.append('item_type', values.item_type);
    const { type, payload } = await dispatch(fetchImportOpeningStock({ body: formData }));
    if (type === 'stock/import/fetch/fulfilled') {
      dispatch(setMessage({ message: payload?.data?.message || 'Order created successfully.', type: 'success' }));
      onClose();
      importOpeningStockForm.handleReset();
    } else if (type === 'stock/import/fetch/rejected') {
      dispatch(setMessage({ message: payload?.error || 'Error! Something goes wrong!', type: 'error' }));
    }
  };

  const importOpeningStockForm = useFormik({
    initialValues: {
      file: '',
      location_id: '',
      item_type: 'raw_material'
    },
    validationSchema: Yup.object({
      file: Yup.mixed().required('Please select file to upload'),
      location_id: Yup.number().required('Please select store'),
      item_type: Yup.string().required('Please select type')
    }),
    onSubmit: createBulkOrders
  });

  useResetForm(importOpeningStockForm, visible, false);

  return (
    <CustomDialog
      actions={[{ text: 'Upload', onClick: importOpeningStockForm.handleSubmit }]}
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
            //https://docs.google.com/spreadsheets/d/1AebJIoT1NBnGxoEXn7G-pFW6-QV9sTm4MY27RQqOzo8/edit?usp=sharing
            link="https://spreadsheets.google.com/feeds/download/spreadsheets/Export?key=1AebJIoT1NBnGxoEXn7G-pFW6-QV9sTm4MY27RQqOzo8&exportFormat=xlsx"
          />
        </Grid>

        <Grid item xs={12}>
          <CustomRadioGroup
            row
            label="Select Stock Type"
            name="item_type"
            value={importOpeningStockForm.values.item_type}
            onChange={importOpeningStockForm.handleChange}
            error={importOpeningStockForm.touched.item_type && importOpeningStockForm.errors.item_type}
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
            name="location_id"
            error={importOpeningStockForm.touched.location_id && importOpeningStockForm.errors.location_id}
            value={importOpeningStockForm.values.location_id}
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
