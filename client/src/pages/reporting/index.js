import { Grid, FormControl, Select, InputLabel, MenuItem, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import AgentsReports from './AgentsReport';
import { useDispatch, useSelector } from 'react-redux';
import {
  reportBrandSelector,
  reportEndPeriodSelector,
  reportStartPeriodSelector,
  reportTypeSelector
} from 'store/slices/report/reportSelector';
import { setReportBrand, setReportPeriod, setReportType } from 'store/slices/report/reportSlice';
import ItemsByOrders from './ItemsByOrders';
import DateRangePicker from 'components/DatePicker';
import { fetchAgentReport } from 'store/slices/report/fetchReport';
import { Button } from '../../../node_modules/@mui/material/index';
import { useEffect } from 'react';
import { brandBrandsSelector, brandFetchStatusSelector } from 'store/slices/brand/brandSelector';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllBrand } from 'store/slices/brand/fetchBrand';
import ChannelReport from './ChannelReport';

const REPORT_TYPES = ['Agent Report', 'Unit Report', 'Channel Report'];

const Reporting = () => {
  const dispatch = useDispatch();
  const startPeriod = useSelector(reportStartPeriodSelector);
  const endPeriod = useSelector(reportEndPeriodSelector);
  const reportType = useSelector(reportTypeSelector);
  const reportBrand = useSelector(reportBrandSelector);
  const brands = useSelector(brandBrandsSelector);
  const brandsFetchStatus = useSelector(brandFetchStatusSelector);

  const fetchReport = () => dispatch(fetchAgentReport({ body: { reportBrand, reportType, startPeriod, endPeriod } }));

  useEffect(() => {
    if (brandsFetchStatus !== fetchStatus.SUCCESS) {
      dispatch(fetchAllBrand());
    }
  }, []);

  const renderReport = () => {
    switch (reportType) {
      case 'Agent Report':
        return <AgentsReports />;
      case 'Unit Report':
        return <ItemsByOrders />;
      case 'Channel Report':
        return <ChannelReport />;
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} sx={{ mb: 2 }}>
        <Typography variant="h5">Reporting</Typography>
      </Grid>

      <Grid container gap={3} justifyContent="center" alignItems="center">
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
              {REPORT_TYPES.map((rt, index) => (
                <MenuItem key={index} value={rt}>
                  {rt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-select-small-label">Select brand</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={reportBrand}
              label="Select Brand"
              onChange={(e) => dispatch(setReportBrand(e.target.value))}
            >
              <MenuItem value="All">All</MenuItem>
              {brands.map((br, index) => (
                <MenuItem key={index} value={br.id}>
                  {br.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <DateRangePicker
            startPeriod={startPeriod}
            endPeriod={endPeriod}
            onStartDateSelect={(date) => dispatch(setReportPeriod({ period: 'startPeriod', value: date }))}
            onEndDateSelect={(date) => dispatch(setReportPeriod({ period: 'endPeriod', value: date }))}
          />
        </Grid>
        <Grid item xs={3} md={3} lg={3}>
          <Button sx={{ ml: 10 }} variant="contained" color="primary" size="small" onClick={fetchReport}>
            Get Report
          </Button>
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <MainCard sx={{ mt: 2 }} content={false}>
          {renderReport()}
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default Reporting;
