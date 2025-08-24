import { Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material';
import CustomAutocomplete from 'components/CustomAutocomplete';
import CustomSelect from 'components/CustomSelect';
import DateRangePicker from 'components/DatePicker';
import DateTimePicker from 'components/DateTimePicker';
import { dateFormatForDateTimeField } from 'constants/index';
import { PERMISSIONS } from 'constants/permissions-and-roles';
import useAccess from 'hooks/useAccess';
import useBrandsFetch from 'hooks/useBrandsFetch';
import useChannelsFetch from 'hooks/useChannelsFetch';
import useCitiesFetch from 'hooks/useCitiesFetch';
import useDeliveryServicesAccountFetch from 'hooks/useDeliveryServicesAccountFetch';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { brandBrandsSelector } from 'store/slices/brand/brandSelector';
import { chanelChanelsSelector } from 'store/slices/chanel/chanelSelector';
import { cityCitiesSelector } from 'store/slices/city/citySelector';
import { deliveryServiceAccountsListSelector } from 'store/slices/deliveryServicesAccounts/deliveryServicesAccountsSelector';
import { fetchReport } from 'store/slices/report/fetchReport';
import {
  reportBrandSelector,
  reportChanelSelector,
  reportCitiesSelector,
  reportDeliveryServicesAccountsSelector,
  reportEndPeriodSelector,
  reportStartPeriodSelector,
  reportTypeSelector
} from 'store/slices/report/reportSelector';
import {
  setReportBrand,
  setReportChanel,
  setReportCities,
  setReportDeliveryServicesAccount,
  setReportPeriod,
  setReportType
} from 'store/slices/report/reportSlice';
import { formatDate } from 'utils/format-date';
import AgentsReports from './AgentsReport';
import BookingProductsValueReport from './BookingProductsValueReport';
import BookingUnitReport from './BookingUnitReport';
import ChannelOrderReport from './ChannelOrderReport';
import ChannelReport from './ChannelReport';
import DamageStockReport from './DamageStockReport';
import DeliveryReport from './DeliveryReport';
import DispatchReport from './DispatchReport';
import FOCReport from './FOCReport';
import IncentiveReport from './IncentiveReport';
import OrderGenerationReport from './OrderGenerationReport';
import StockReport from './StockReport';
import UnitReport from './UnitReport';

const reportConfig = [
  { permission: PERMISSIONS.PERMISSIONS_GET_AGENT_REPORT, label: 'Agent Order Report', value: 'Agent Report' },
  { permission: PERMISSIONS.PERMISSIONS_GET_PRODUCT_REPORT, label: 'Product Unit Report', value: 'Unit Report' },
  { permission: PERMISSIONS.PERMISSIONS_GET_BOOKING_REPORT, label: 'Booking Unit Report', value: 'Booking Unit Report' },
  { permission: PERMISSIONS.PERMISSIONS_GET_FOC_REPORT, label: 'Courier FOC Unit Report', value: 'FOC Report' },
  { permission: PERMISSIONS.PERMISSIONS_GET_CHANNEL_REPORT, label: 'Agent Channel Report', value: 'Channel Report' },
  { permission: PERMISSIONS.PERMISSIONS_GET_CHANNEL_ORDER_REPORT, label: 'Channel Order Report', value: 'Channel Order Report' },
  { permission: PERMISSIONS.PERMISSIONS_GET_INCENTIVE_REPORT, label: 'Agent Incentive Unit Report', value: 'Incentive Report' },
  { permission: PERMISSIONS.PERMISSIONS_GET_COURIER_DELIVERY_REPORT, label: 'Courier Delivery Report', value: 'Delivery Report' },
  { permission: PERMISSIONS.PERMISSIONS_GET_STOCK_REPORT, label: 'Stock Report', value: 'Stock Report' },
  { permission: PERMISSIONS.PERMISSIONS_GET_STOCK_DAMAGE_REPORT, label: 'Damage Stock Report', value: 'Damage Stock Report' },
  { permission: PERMISSIONS.PERMISSIONS_GET_DISPATCH_REPORT, label: 'Dispatch Report', value: 'Dispatch Report' },
  { permission: PERMISSIONS.PERMISSIONS_GET_DISPATCH_REPORT, label: 'Order Generation Report', value: 'Order Generation Report' },
  {
    permission: PERMISSIONS.PERMISSIONS_GET_BOOKING_PRODUCTS_VALUE_REPORT,
    label: 'Booking Products Value Report',
    value: 'Booking Products Value Report'
  }
];

const Reporting = () => {
  const dispatch = useDispatch();
  const { hasPermission } = useAccess();
  const startPeriod = useSelector(reportStartPeriodSelector);
  const endPeriod = useSelector(reportEndPeriodSelector);
  const reportType = useSelector(reportTypeSelector);
  const reportBrand = useSelector(reportBrandSelector);
  const reportChanel = useSelector(reportChanelSelector);
  const reportCities = useSelector(reportCitiesSelector);
  const reportDeliveryServicesAccounts = useSelector(reportDeliveryServicesAccountsSelector);

  const brands = useSelector(brandBrandsSelector);
  const cities = useSelector(cityCitiesSelector);
  const chanels = useSelector(chanelChanelsSelector);
  const deliveryServiceAccounts = useSelector(deliveryServiceAccountsListSelector);

  const [filteredChanels, setFilteredChanels] = useState([]);
  const [withTime, setWithTime] = useState(false);

  const REPORT_TYPES = useMemo(() => reportConfig.filter(({ permission }) => hasPermission(permission)), []);

  const handleFetchReport = () => {
    if (!reportType) {
      return;
    }
    dispatch(
      fetchReport({ body: { reportBrand, reportChanel, reportType, startPeriod, endPeriod, reportCities, reportDeliveryServicesAccounts } })
    );
  };

  useCitiesFetch();
  useBrandsFetch();
  useChannelsFetch();
  useDeliveryServicesAccountFetch();

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
      case 'Channel Order Report':
        return <ChannelOrderReport />;
      case 'Incentive Report':
        return <IncentiveReport />;
      case 'Delivery Report':
        return <DeliveryReport />;
      case 'Stock Report':
        return <StockReport />;
      case 'Damage Stock Report':
        return <DamageStockReport />;
      case 'Dispatch Report':
        return <DispatchReport />;
      case 'Booking Products Value Report':
        return <BookingProductsValueReport />;
      case 'Order Generation Report':
        return <OrderGenerationReport />;
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
          <CustomSelect
            name="report_selector"
            label="Select Report"
            options={REPORT_TYPES}
            value={reportType}
            onChange={(e) => dispatch(setReportType(e.target.value))}
          />
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <CustomSelect
            multiple
            withAllOption
            value={reportBrand}
            label="Select Brand"
            options={brands.map((br) => ({ label: br.name, value: br.id }))}
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
          />
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <CustomSelect
            multiple
            withAllOption
            name="channel_filter"
            label="Select Chanel"
            options={filteredChanels.map((flt) => ({ value: flt.id, label: flt.name }))}
            value={reportChanel}
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
          />
        </Grid>
        <Grid item xs={1} md={1} lg={1}>
          <FormGroup>
            <FormControlLabel control={<Checkbox onChange={() => setWithTime((wT) => !wT)} />} label="With Time" />
          </FormGroup>
        </Grid>
        <Grid item xs={3} md={3} lg={3}>
          {withTime ? (
            <DateTimePicker
              startPeriod={formatDate(dateFormatForDateTimeField, startPeriod)}
              endPeriod={formatDate(dateFormatForDateTimeField, endPeriod)}
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

      <Grid container xs={12} gap={0.25} justifyContent="start" alignItems="center">
        <Grid xs={1} md={1} lg={1} />
        {reportType === 'Booking Unit Report' && (
          <Grid item xs={2.5} md={2.5} lg={2.5}>
            <CustomAutocomplete
              label="Select City"
              options={cities}
              value={reportCities}
              onChange={(e, option) => {
                if (!option) {
                  return dispatch(setReportCities(''));
                }
                dispatch(setReportCities(option));
              }}
            />
          </Grid>
        )}
        {(reportType === 'Booking Unit Report' || reportType === 'Booking Products Value Report') && (
          <Grid item xs={2.5} md={2.5} lg={2.5}>
            <Box sx={{ marginTop: 1 }} />
            <CustomSelect
              multiple
              options={deliveryServiceAccounts.map((dsa) => ({ value: dsa.id, label: dsa.name }))}
              name="delivery_service_account"
              label="Select Delivery Service Account"
              value={reportDeliveryServicesAccounts}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length === 1 && val[0] === 'all') {
                  dispatch(setReportDeliveryServicesAccount(deliveryServiceAccounts.map((ac) => ac.id)));
                } else if (val.includes('none')) {
                  dispatch(setReportDeliveryServicesAccount([]));
                } else {
                  dispatch(setReportDeliveryServicesAccount(val));
                }
              }}
            />
          </Grid>
        )}
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        {renderReport()}
      </Grid>
    </Grid>
  );
};

export default Reporting;
