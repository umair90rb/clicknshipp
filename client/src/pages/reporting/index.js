import { useEffect } from 'react';
import moment from 'moment';
import ReplayIcon from '@mui/icons-material/Replay';
import { Grid, Typography, TextField, Box, Button } from '@mui/material';
import MainCard from 'components/MainCard';
import AgentsReports from './AgentsReport';
import { batch, useDispatch, useSelector } from 'react-redux';
import { reportEndPeriodSelector, reportStartPeriodSelector } from 'store/slices/report/reportSelector';
import { setAgentReportStatPeriod } from 'store/slices/report/reportSlice';
import { fetchAgentReport } from 'store/slices/report/fetchReport';
import ItemsByOrders from './ItemsByOrders';

const Reporting = () => {
  const dispatch = useDispatch();
  const startPeriod = useSelector(reportStartPeriodSelector);
  const endPeriod = useSelector(reportEndPeriodSelector);

  const handleFetchAgentReport = () => dispatch(fetchAgentReport({ body: { startPeriod, endPeriod } }));
  const setInitialPeriod = () =>
    batch(() => {
      dispatch(
        setAgentReportStatPeriod({
          period: 'startPeriod',
          value: moment(new Date()).startOf('day').format('YYYY-MM-DDTHH:MM')
        })
      );
      dispatch(
        setAgentReportStatPeriod({
          period: 'endPeriod',
          value: moment(new Date()).format('YYYY-MM-DDTHH:MM')
        })
      );
    });
  useEffect(() => {
    setInitialPeriod();
  }, []);

  useEffect(() => {
    handleFetchAgentReport();
  }, [startPeriod, endPeriod]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Grid container item justifyContent="center" alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h5">Reporting</Typography>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" spacing={3} justifyContent="flex-end">
                <TextField
                  sx={{ mx: 1 }}
                  type="datetime-local"
                  label="Start Period"
                  value={startPeriod}
                  onChange={(e) => dispatch(setAgentReportStatPeriod({ period: 'startPeriod', value: e.target.value }))}
                  size="small"
                />
                <TextField
                  sx={{ mx: 1 }}
                  type="datetime-local"
                  label="End Period"
                  value={endPeriod}
                  onChange={(e) => dispatch(setAgentReportStatPeriod({ period: 'endPeriod', value: e.target.value }))}
                  size="small"
                />
                <Button
                  sx={{ mx: 1 }}
                  startIcon={<ReplayIcon />}
                  variant="contained"
                  size="small"
                  disabled={false}
                  onClick={handleFetchAgentReport}
                  aria-label="reload"
                  color="primary"
                >
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <MainCard sx={{ mt: 2 }} content={false}>
          <AgentsReports />
        </MainCard>
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ItemsByOrders />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default Reporting;
