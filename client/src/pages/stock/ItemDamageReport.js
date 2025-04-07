import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { formatDateTime, getEndOfDay, getStartOfDay } from 'utils/format-date';
import CustomDialog from 'components/CustomDialog';
import DateRangePicker from 'components/DatePicker';
import { Box, Grid, FormControl, FormLabel, Select, MenuItem, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getIdAndType, getItemsAndRaw } from './util';
import { locationListSelector } from 'store/slices/location/locationSelector';
import { itemItemsSelector } from 'store/slices/item/itemSelector';
import { rawMaterialListSelector } from 'store/slices/rawMaterial/RawMaterialSelector';
import CustomButton from 'components/CustomButton';
import { fetchItemDamageReport } from 'store/slices/stock/fetchStock';
import CustomRadioGroup from 'components/CustomRadioGroup';
import useRawMaterialsFetch from 'hooks/useRawMaterialsFetch';
import useItemsFetch from 'hooks/useItemsFetch';
import useStoreLocationFetch from 'hooks/useStoreLocationFetch';
import CustomGrid from 'components/CustomGrid';

const columns = [
  {
    field: 'quantity',
    headerName: 'Quantity',
    flex: 1.25
  },
  {
    field: 'movement_type',
    headerName: 'Movement',
    flex: 0.5
  },
  {
    field: 'location',
    headerName: 'Store',
    valueGetter: (value) => value?.row?.location?.name,
    flex: 1.25
  },
  // {
  //   field: 'gate_pass_no',
  //   headerName: 'IGP No',
  //   flex: 1,
  // },
  // {
  //   field: 'gate_pass_date',
  //   headerName: 'IGP Date',
  //   flex: 1,
  //   valueFormatter: ({ value }) => (value ? parseTimestampToDate(value) : value)
  // },
  {
    field: 'comment',
    headerName: 'Comment',
    flex: 1.25
  },
  {
    field: 'createdAt',
    headerName: 'Date',
    valueGetter: (value) => formatDateTime(value?.row?.createdAt),
    flex: 1
  }
];

export default function ItemDamageReport({ item, visible, onClose }) {
  const dispatch = useDispatch();
  const locations = useSelector(locationListSelector);
  const items = useSelector(itemItemsSelector);
  const rawMaterials = useSelector(rawMaterialListSelector);

  useRawMaterialsFetch();
  useItemsFetch();
  useStoreLocationFetch();

  const [report, setReport] = useState({
    error: null,
    rows: []
  });

  const fetchDamageReport = (body) => {
    return dispatch(fetchItemDamageReport({ body })).then((action) => {
      if (action.type === 'itemDamageReport/fetch/fulfilled') {
        setReport({
          rows: [
            ...action.payload.data.history,
            { id: 'total', movement_type: 'Total', quantity: action.payload.data.history.reduce((t, c) => parseFloat(c.quantity) + t, 0) }
          ],
          error: null
        });

        return;
      } else {
        setReport({ rows: [], error: action.payload.error });
        return;
      }
    });
  };

  const itemDamageReportForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      location_id: null,
      item_id: null,
      item_type: '',
      from: null,
      to: null
    },
    validationSchema: Yup.object().shape({
      item_id: Yup.string().required(),
      item_type: Yup.string().required('Please select inventory type'),
      location_id: Yup.number().required('Please select store location'),
      from: Yup.date().required('Please select start date'),
      to: Yup.date().required('Please select end date')
    }),
    onSubmit: fetchDamageReport
  });

  useEffect(() => {
    if (visible && item) {
      itemDamageReportForm.setValues({ ...getIdAndType(item), location_id: item?.location?.id, from: getStartOfDay(), to: getEndOfDay() });
    }
    return () => {
      setReport({ loading: false, error: null, rows: [] });
    };
  }, [visible]);

  return (
    <CustomDialog printable enableBackdrop visible={visible} onClose={onClose} maxWidth="lg" dividers={false} title="Damage Report">
      <Grid container alignItems="center" spacing={1}>
        <Grid item sx={2} md={2} lg={2}>
          <CustomRadioGroup
            label="Inventory Type"
            name="item_type"
            value={itemDamageReportForm.values.item_type}
            onChange={itemDamageReportForm.handleChange}
            radios={[
              { label: 'Finished Products', value: 'finished_product' },
              { label: 'Raw Material', value: 'raw_material' },
              { label: 'Packaging Material', value: 'packaging_material' }
            ]}
          />
        </Grid>
        <Grid item sx={3} md={3} lg={3}>
          <FormControl fullWidth margin="normal">
            <FormLabel id="item_id">
              {itemDamageReportForm.values.item_type === 'finished_product' ? 'Select Product' : 'Select Material'}
            </FormLabel>
            <Autocomplete
              sx={{
                height: '100%',
                [`& .${autocompleteClasses.inputRoot}`]: {
                  padding: '0px 0px',
                  height: '100%',
                  '& input': {
                    padding: '0px 0px',
                    height: '100%'
                  }
                }
              }}
              options={getItemsAndRaw(itemDamageReportForm.values.item_type, items, rawMaterials)}
              error={
                itemDamageReportForm.touched.item_id &&
                itemDamageReportForm.touched.item_id &&
                itemDamageReportForm.touched.item_id &&
                !!itemDamageReportForm.errors.item_id &&
                !!itemDamageReportForm.errors.item_id &&
                !!itemDamageReportForm.errors.item_id
              }
              getOptionLabel={(option) =>
                getItemsAndRaw(itemDamageReportForm.values.item_type, items, rawMaterials)?.find((item) => item?.id === option)?.label
              }
              renderOption={(prop, option, state, ownerState) => <li {...prop}>{option.label}</li>}
              value={itemDamageReportForm.values.item_id}
              // onChange={itemDamageReportForm.handleChange}
              isOptionEqualToValue={(option, value) => option === value}
              onChange={(e, option) => {
                if (option && 'id' in option) {
                  itemDamageReportForm.setFieldValue(`item_id`, option?.id);
                }
              }}
              type="text"
              id="item_id"
              name="item_id"
              autoHighlight
              renderInput={(params) => (
                <TextField
                  autoFocus
                  fullWidth
                  id={params.id}
                  size="small"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password'
                  }}
                  {...params.InputProps}
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item sx={2.5} md={2.5} lg={2.5}>
          <FormControl fullWidth margin="normal">
            <FormLabel id="date_range">Select Date Range</FormLabel>
            <DateRangePicker
              startPeriod={itemDamageReportForm.initialValues.from}
              endPeriod={itemDamageReportForm.initialValues.to}
              onStartDateSelect={(date) => {
                itemDamageReportForm.setFieldValue(`from`, date);
                itemDamageReportForm.setFieldTouched('from', true);
              }}
              onEndDateSelect={(date) => {
                itemDamageReportForm.setFieldValue(`to`, date);
                itemDamageReportForm.setFieldTouched('to', true);
              }}
            />
          </FormControl>
        </Grid>
        <Grid item sx={3} md={3} lg={3}>
          <FormControl fullWidth margin="normal">
            <FormLabel id="location_id">Store Location</FormLabel>
            <Select
              size="small"
              labelId="location_id"
              id="location_id_select"
              value={itemDamageReportForm.values.location_id}
              name="location_id"
              onChange={itemDamageReportForm.handleChange}
              error={
                itemDamageReportForm.touched.location_id &&
                itemDamageReportForm.touched.location_id &&
                itemDamageReportForm.touched.location_id &&
                !!itemDamageReportForm.errors.location_id &&
                !!itemDamageReportForm.errors.location_id &&
                !!itemDamageReportForm.errors.location_id
              }
            >
              {locations.map(({ id, name }, index) => (
                <MenuItem key={index} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item sx={1.5} md={1.5} lg={1.5}>
          <FormControl fullWidth margin="normal">
            <Box sx={{ marginTop: 2 }} />
            <CustomButton
              text="Get Report"
              onClick={() => {
                itemDamageReportForm.handleSubmit();
              }}
              disabled={itemDamageReportForm.isSubmitting}
            />
          </FormControl>
        </Grid>
      </Grid>

      {report?.rows.length > 0 && (
        <Grid container>
          <Grid item>
            <Typography variant="h5">
              Total Damaged Quantity:{' '}
              {report?.rows.reduce((t, c) => {
                if (c.id === 'total') {
                  return t;
                }
                return parseFloat(c.quantity) + t;
              }, 0)}
            </Typography>
          </Grid>
        </Grid>
      )}

      <CustomGrid
        getRowHeight={() => 'auto'}
        toolbar={false}
        loading={itemDamageReportForm.isSubmitting}
        pagination={false}
        rows={report?.rows}
        columns={columns}
        showQuickFilter={false}
      />
    </CustomDialog>
  );
}
