import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { formatDateTime, getEndOfDay, getStartOfDay } from 'utils/format-date';
import CustomDialog from 'components/CustomDialog';
import DateRangePicker from 'components/DatePicker';
import { Box, Grid, FormControl, FormLabel, Select, MenuItem, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getIdAndType, getItemsAndRaw } from './util';
import { locationFetchStatusSelector, locationListSelector } from 'store/slices/location/locationSelector';
import fetchStatus from 'constants/fetchStatuses';
import { itemFetchStatusSelector, itemItemsSelector } from 'store/slices/item/itemSelector';
import { rawMaterialFetchStatusSelector, rawMaterialListSelector } from 'store/slices/rawMaterial/RawMaterialSelector';
import CButton from 'components/Button';
import { fetchItemDamageReport } from 'store/slices/stock/fetchStock';

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

  const locationFetchStatus = useSelector(locationFetchStatusSelector);
  const locations = useSelector(locationListSelector);
  const locationIsLoading = locationFetchStatus === fetchStatus.REQUEST;

  const itemFetchStatus = useSelector(itemFetchStatusSelector);
  const items = useSelector(itemItemsSelector);
  const itemsIsLoading = itemFetchStatus === fetchStatus.REQUEST;

  const rawMaterialFetchStatus = useSelector(rawMaterialFetchStatusSelector);
  const rawMaterials = useSelector(rawMaterialListSelector);
  const rawMaterialIsLoading = rawMaterialFetchStatus === fetchStatus.REQUEST;

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
      itemDamageReportForm.setValues({ ...getIdAndType(item), location_id: item.location.id, from: getStartOfDay(), to: getEndOfDay() });
    }

    if (visible && locationFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllLocation());
    }

    if (visible && itemFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllItem());
    }

    if (visible && rawMaterialFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllRawMaterial());
    }

    return () => {
      setReport({ loading: false, error: null, rows: [] });
    };
  }, [visible]);

  return (
    <CustomDialog
      printable
      enableBackdrop
      visible={visible}
      onClose={onClose}
      maxWidth="lg"
      dividers={false}
      title={`Damage Report ${item && 'of'} ${item?.item?.name || item?.raw?.name || ''}`}
    >
      <Grid container alignItems="center" spacing={1}>
        <Grid item sx={4} md={4} lg={4}>
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
                getItemsAndRaw(itemDamageReportForm.values.item_type, items, rawMaterials).find((item) => item.id === option).label
              }
              value={itemDamageReportForm.values.item_id}
              // onChange={itemDamageReportForm.handleChange}
              isOptionEqualToValue={(option, value) => option.id === value}
              onChange={(e, option) => {
                itemDamageReportForm.setFieldValue(`item_id`, option.id);
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
        <Grid item sx={3.5} md={3.5} lg={3.5}>
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
            <CButton
              text="Get Report"
              onClick={() => {
                // itemDamageReportForm.validateForm();
                // const errors = Object.values(itemDamageReportForm.errors);
                // if (errors.length) {
                //   alert(errors.join('\n'));
                // }
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

      <DataGrid
        autoHeight
        getRowHeight={() => 'auto'}
        hideFooterPagination={true}
        loading={itemDamageReportForm.isSubmitting}
        hidePagination={true}
        rows={report?.rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
      />
    </CustomDialog>
  );
}
