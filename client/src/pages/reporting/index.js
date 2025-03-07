import { useEffect, useMemo, useState } from 'react';
import { Grid, FormGroup, Checkbox, FormControlLabel, FormControl, Select, InputLabel, MenuItem, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DateRangePicker from 'components/DatePicker';
import DateTimePicker from 'components/DateTimePicker';
import {
  reportBrandSelector,
  reportChanelSelector,
  reportEndPeriodSelector,
  reportIsLoadingSelector,
  reportStartPeriodSelector,
  reportTypeSelector
} from 'store/slices/report/reportSelector';
import { setReportBrand, setReportChanel, setReportPeriod, setReportType } from 'store/slices/report/reportSlice';
import { fetchReport } from 'store/slices/report/fetchReport';
import { brandBrandsSelector, brandFetchStatusSelector } from 'store/slices/brand/brandSelector';
import { fetchAllBrand } from 'store/slices/brand/fetchBrand';
import fetchStatus from 'constants/fetchStatuses';
import UnitReport from './UnitReport';
import ChannelReport from './ChannelReport';
import AgentsReports from './AgentsReport';
import IncentiveReport from './IncentiveReport';
import { chanelChanelsSelector, chanelFetchStatusSelector } from 'store/slices/chanel/chanelSelector';
import { fetchAllChanel } from 'store/slices/chanel/fetchChanel';
import BookingUnitReport from './BookingUnitReport';
import FOCReport from './FOCReport';
import DeliveryReport from './DeliveryReport';
import StockReport from './StockReport';
import useAccess from 'hooks/useAccess';
import { PERMISSIONS } from 'constants/permissions-and-roles';

const Reporting = () => {
  const dispatch = useDispatch();
  const { hasPermission } = useAccess();
  const startPeriod = useSelector(reportStartPeriodSelector);
  const endPeriod = useSelector(reportEndPeriodSelector);
  const reportIsLoading = useSelector(reportIsLoadingSelector);
  const reportType = useSelector(reportTypeSelector);
  const reportBrand = useSelector(reportBrandSelector);
  const reportChanel = useSelector(reportChanelSelector);
  const brands = useSelector(brandBrandsSelector);
  const brandsFetchStatus = useSelector(brandFetchStatusSelector);
  const chanels = useSelector(chanelChanelsSelector);
  const chanelsFetchStatus = useSelector(chanelFetchStatusSelector);
  const [filteredChanels, setFilteredChanels] = useState([]);
  const [withTime, setWithTime] = useState(false);

  const REPORT_TYPES = useMemo(
    () => [
      ...(hasPermission(PERMISSIONS.PERMISSIONS_GET_AGENT_REPORT) ? [{ label: 'Agent Report', value: 'Agent Report' }] : []),
      ...(hasPermission(PERMISSIONS.PERMISSIONS_GET_PRODUCT_REPORT) ? [{ label: 'Product Report', value: 'Unit Report' }] : []),
      ...(hasPermission(PERMISSIONS.PERMISSIONS_GET_BOOKING_REPORT) ? [{ label: 'Booking Report', value: 'Booking Unit Report' }] : []),
      ...(hasPermission(PERMISSIONS.PERMISSIONS_GET_FOC_REPORT) ? [{ label: 'FOC Report', value: 'FOC Report' }] : []),
      ...(hasPermission(PERMISSIONS.PERMISSIONS_GET_CHANNEL_REPORT) ? [{ label: 'Channel Report', value: 'Channel Report' }] : []),
      ...(hasPermission(PERMISSIONS.PERMISSIONS_GET_INCENTIVE_REPORT) ? [{ label: 'Incentive Report', value: 'Incentive Report' }] : []),
      ...(hasPermission(PERMISSIONS.PERMISSIONS_GET_COURIER_DELIVERY_REPORT)
        ? [{ label: 'Courier Delivery Report', value: 'Delivery Report' }]
        : []),
      ...(hasPermission(PERMISSIONS.PERMISSIONS_GET_STOCK_REPORT) ? [{ label: 'Stock Report', value: 'Stock Report' }] : [])
    ],
    []
  );

  const handleFetchReport = () => {
    if (!reportType) {
      return;
    }
    dispatch(fetchReport({ body: { reportBrand, reportChanel, reportType, startPeriod, endPeriod } }));
  };

  useEffect(() => {
    if (brandsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllBrand());
    }
    if (chanelsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllChanel());
    }
  }, []);

  useEffect(() => {
    setFilteredChanels(
      chanels.filter((c) => {
        return reportBrand.includes(c.brand.id);
      })
    );
    dispatch(setReportChanel([]));
  }, [reportBrand]);

  const renderReport = () => {
    switch (reportType) {
      case 'Agent Report':
        return <AgentsReports />;
      case 'Unit Report':
        return <UnitReport />;
      case 'Booking Unit Report':
        return <BookingUnitReport />;
      case 'FOC Report':
        return <FOCReport />;
      case 'Channel Report':
        return <ChannelReport />;
      case 'Incentive Report':
        return <IncentiveReport />;
      case 'Delivery Report':
        return <DeliveryReport />;
      case 'Stock Report':
        return <StockReport />;
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} mb={2}>
        <Typography variant="h5">Reporting</Typography>
      </Grid>

      <Grid container xs={12} gap={0.25} justifyContent="start" alignItems="center">
        <Grid item xs={1} md={1} lg={1}>
          <Button variant="contained" color="primary" size="small" onClick={handleFetchReport}>
            Get Report
          </Button>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-select-small-label">Select report</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={reportType}
              label="Select report"
              onChange={(e) => dispatch(setReportType(e.target.value))}
            >
              {REPORT_TYPES.map(({ label, value }, index) => (
                <MenuItem key={index} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-select-small-label">Select Brands</InputLabel>
            <Select
              multiple
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={reportBrand}
              label="Select Brand"
              onChange={(e) => {
                const val = e.target.value;
                console.log(val);
                if (val.length === 1 && val[0] === 'all') {
                  dispatch(setReportBrand(brands.map((br) => br.id)));
                } else if (val.includes('none')) {
                  dispatch(setReportBrand([]));
                } else {
                  dispatch(setReportBrand(val));
                }
              }}
            >
              {[
                {
                  name: brands.length === reportBrand.length ? 'Unselect all' : 'Select all',
                  id: brands.length === reportBrand.length ? 'none' : 'all'
                },
                ...brands
              ].map((br, index) => (
                <MenuItem key={index} value={br.id}>
                  {br.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-select-small-label">Select Chanel</InputLabel>
            <Select
              multiple
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={reportChanel}
              label="Select Brand"
              onChange={(e) => {
                const val = e.target.value;
                if (val.length === 1 && val[0] === 'all') {
                  dispatch(setReportChanel(filteredChanels.map((br) => br.id)));
                } else if (val.includes('none')) {
                  dispatch(setReportChanel([]));
                } else {
                  dispatch(setReportChanel(val));
                }
              }}
            >
              {[
                {
                  name: chanels.length === reportChanel.length ? 'Unselect all' : 'Select all',
                  id: chanels.length === reportChanel.length ? 'none' : 'all'
                },
                ...filteredChanels
              ].map((ch, index) => (
                <MenuItem key={index} value={ch.id}>
                  {ch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1} md={1} lg={1}>
          <FormGroup>
            <FormControlLabel control={<Checkbox onChange={() => setWithTime((wT) => !wT)} />} label="With Time" />
          </FormGroup>
        </Grid>
        <Grid item xs={3.5} md={3.5} lg={3.5}>
          {withTime ? (
            <DateTimePicker
              startPeriod={startPeriod}
              endPeriod={endPeriod}
              onStartDateSelect={(date) => dispatch(setReportPeriod({ period: 'startPeriod', value: date }))}
              onEndDateSelect={(date) => dispatch(setReportPeriod({ period: 'endPeriod', value: date }))}
            />
          ) : (
            <DateRangePicker
              startPeriod={startPeriod}
              endPeriod={endPeriod}
              onStartDateSelect={(date) => dispatch(setReportPeriod({ period: 'startPeriod', value: date }))}
              onEndDateSelect={(date) => dispatch(setReportPeriod({ period: 'endPeriod', value: date }))}
            />
          )}
        </Grid>
      </Grid>
      {reportIsLoading ? (
        'Loading...'
      ) : (
        <Grid item xs={12} md={12} lg={12}>
          {renderReport()}
        </Grid>
      )}
    </Grid>
  );
};

export default Reporting;
