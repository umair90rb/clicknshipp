import { useState, useEffect } from 'react';
import { Grid, FormControl, Select, InputLabel, MenuItem, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import AgentsReports from './AgentsReport';
import { useDispatch, useSelector } from 'react-redux';
import { reportEndPeriodSelector, reportStartPeriodSelector } from 'store/slices/report/reportSelector';
import { setAgentReportStatPeriod } from 'store/slices/report/reportSlice';
// import ItemsByOrders from './ItemsByOrders';
import DateRangePicker from 'components/DatePicker';
import { fetchAgentReport } from 'store/slices/report/fetchReport';

const REPORT_TYPES = ['Agent Report', 'Load Sheet'];

const Reporting = () => {
  const dispatch = useDispatch();
  const startPeriod = useSelector(reportStartPeriodSelector);
  const endPeriod = useSelector(reportEndPeriodSelector);
  const [report, setReport] = useState('');

  useEffect(() => {
    dispatch(fetchAgentReport({ body: { report, startPeriod, endPeriod } }));
  }, [startPeriod, endPeriod]);

  const renderReport = () => {
    switch (report) {
      case 'Agent Report':
        return <AgentsReports />;
      case 'Load Sheet':
        return <></>;
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Typography variant="h5">Reporting</Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" xs={12} md={12} lg={12}>
        <Grid item container justifyContent="flex-end" xs={6} md={6} lg={6}>
          <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
            <InputLabel id="demo-select-small-label">Select report</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={report}
              label="Select report"
              onChange={(e) => setReport(e.target.value)}
            >
              {REPORT_TYPES.map((rt, index) => (
                <MenuItem key={index} value={rt}>
                  {rt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
          <DateRangePicker
            startDate={startPeriod}
            endDate={endPeriod}
            setStartDate={(date) => dispatch(setAgentReportStatPeriod({ period: 'startPeriod', value: date }))}
            setEndDate={(date) => dispatch(setAgentReportStatPeriod({ period: 'endPeriod', value: date }))}
          />
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
