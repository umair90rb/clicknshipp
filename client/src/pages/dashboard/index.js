import { Grid, Typography } from '@mui/material';

import { rows, headCells } from './OrdersTable';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import CustomTable from 'components/CustomTable';
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

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, []);

  if (statsIsLoading) {
    return <CircularLoader />;
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Today Orders" count={stats.totalOrders} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Today Confirm Orders" count={stats.confirmedOrders} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Today Booked Orders" count={stats.bookedOrders} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Today Total Sales" count={`Rs ${parseInt(stats.totalSalesValue)}`} />
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
          <ItemsByOrders items={stats?.ordersByItem || []} />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
