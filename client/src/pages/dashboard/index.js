import { Grid, Typography, Button, Box, TextField } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useEffect } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from 'store/slices/dashboard/fetchDashboard';
import {
  dashboardStartPeriodSelector,
  dashboardEndPeriodSelector,
  dashboardIsLoadingSelector,
  dashboardStatsSelector
} from 'store/slices/dashboard/dashboardSelector';
import ItemsByOrders from './ItemsByOrders';
import { setDashboardStatPeriod } from 'store/slices/dashboard/dashboardSlice';
import moment from 'moment';
import MonthlyBarChart from './MonthlyBarChart';

const DashboardDefault = () => {
  const dispatch = useDispatch();
  const statsIsLoading = useSelector(dashboardIsLoadingSelector);
  const stats = useSelector(dashboardStatsSelector);
  const startPeriod = useSelector(dashboardStartPeriodSelector);
  const endPeriod = useSelector(dashboardEndPeriodSelector);

  const fetchStats = () => dispatch(fetchDashboardStats({ startPeriod, endPeriod }));
  const initialPeriod = () =>
    batch(() => {
      dispatch(
        setDashboardStatPeriod({
          period: 'startPeriod',
          value: moment(new Date()).startOf('day').format('YYYY-MM-DDTHH:MM')
        })
      );
      dispatch(
        setDashboardStatPeriod({
          period: 'endPeriod',
          value: moment(new Date()).format('YYYY-MM-DDTHH:MM')
        })
      );
    });
  useEffect(() => {
    initialPeriod();
  }, []);
  useEffect(() => {
    fetchStats();
  }, [startPeriod, endPeriod]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Grid container item justifyContent="center" alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h5">Dashboard</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" spacing={3} justifyContent="flex-end">
              <TextField
                sx={{ mx: 1 }}
                type="datetime-local"
                label="Start Period"
                value={startPeriod}
                onChange={(e) => dispatch(setDashboardStatPeriod({ period: 'startPeriod', value: e.target.value }))}
                size="small"
              />
              <TextField
                sx={{ mx: 1 }}
                type="datetime-local"
                label="End Period"
                value={endPeriod}
                onChange={(e) => dispatch(setDashboardStatPeriod({ period: 'endPeriod', value: e.target.value }))}
                size="small"
              />
              <Button
                sx={{ mx: 1 }}
                startIcon={<ReplayIcon />}
                variant="contained"
                size="small"
                disabled={statsIsLoading}
                onClick={fetchStats}
                aria-label="reload"
                color="primary"
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Orders" count={statsIsLoading ? 'loading...' : stats.totalOrders || 0} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Confirm Orders" count={statsIsLoading ? 'loading...' : stats.confirmedOrders || 0} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Booked Orders" count={statsIsLoading ? 'loading...' : stats.bookedOrders || 0} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Sales" count={statsIsLoading ? 'loading...' : `Rs ${parseInt(stats.totalSalesValue) || 0}`} />
      </Grid>

      {/* row 2 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Products by orders</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ItemsByOrders />
        </MainCard>
      </Grid>

      {/* row 3 */}
      {/* <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Last 7 days</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <MonthlyBarChart />
        </MainCard>
      </Grid> */}
    </Grid>
  );
};

export default DashboardDefault;
