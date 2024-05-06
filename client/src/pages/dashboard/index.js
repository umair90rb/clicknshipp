import { Grid, Typography, IconButton, Box } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from 'store/slices/dashboard/fetchDashboard';
import { dashboardIsLoadingSelector, dashboardStatsSelector } from 'store/slices/dashboard/dashboardSelector';
import Loader from 'components/Loader';
import CircularLoader from 'components/CircularLoader';
import ItemsByOrders from './ItemsByOrders';

const DashboardDefault = () => {
  const dispatch = useDispatch();
  const statsIsLoading = useSelector(dashboardIsLoadingSelector);
  const stats = useSelector(dashboardStatsSelector);

  const fetchStats = () => dispatch(fetchDashboardStats());

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Grid container item justifyContent="center" alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h5">Dashboard</Typography>
          </Grid>
          <Grid item xs={6} justifyContent="flex-end">
            <Box display="flex" justifyContent="flex-end">
              <IconButton disabled={statsIsLoading} onClick={fetchStats} aria-label="reload" color="primary">
                <ReplayIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Today Orders" count={statsIsLoading ? 'loading...' : stats.totalOrders} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Today Confirm Orders" count={statsIsLoading ? 'loading...' : stats.confirmedOrders} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Today Booked Orders" count={statsIsLoading ? 'loading...' : stats.bookedOrders} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Today Total Sales" count={statsIsLoading ? 'loading...' : `Rs ${parseInt(stats.totalSalesValue)}`} />
      </Grid>

      {/* row 2 */}
      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Orders</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ItemsByOrders />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
