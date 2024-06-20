import { Grid, Typography } from '@mui/material';
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
import { setDashboardStatPeriod } from 'store/slices/dashboard/dashboardSlice';
// import moment from 'moment';
import DateRangePicker from 'components/DatePicker';
// import MonthlyBarChart from './MonthlyBarChart';

const DashboardDefault = () => {
  const dispatch = useDispatch();
  const statsIsLoading = useSelector(dashboardIsLoadingSelector);
  const stats = useSelector(dashboardStatsSelector);
  const startPeriod = useSelector(dashboardStartPeriodSelector);
  const endPeriod = useSelector(dashboardEndPeriodSelector);

  useEffect(() => {
    dispatch(fetchDashboardStats({ startPeriod, endPeriod }));
  }, [startPeriod, endPeriod]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Grid container item justifyContent="center" alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h5">Dashboard</Typography>
          </Grid>
          <Grid container item justifyContent="flex-end" xs={6}>
            <DateRangePicker
              startPeriod={startPeriod}
              endPeriod={endPeriod}
              onStartDateSelect={(date) => dispatch(setDashboardStatPeriod({ period: 'startPeriod', value: date }))}
              onEndDateSelect={(date) => dispatch(setDashboardStatPeriod({ period: 'endPeriod', value: date }))}
            />
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
      {/* <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Products by orders</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ItemsByOrders />
        </MainCard>
      </Grid> */}

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
