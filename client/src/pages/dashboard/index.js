import { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from 'store/slices/dashboard/fetchDashboard';
import {
  dashboardStartPeriodSelector,
  dashboardEndPeriodSelector,
  dashboardIsLoadingSelector,
  dashboardStatsSelector
} from 'store/slices/dashboard/dashboardSelector';
import { setDashboardStatPeriod } from 'store/slices/dashboard/dashboardSlice';
import DateRangePicker from 'components/DatePicker';
import MainCard from 'components/MainCard';

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
    <Grid container rowSpacing={1} columnSpacing={0.75}>
      {/* row 1 */}
      <Grid item xs={12}>
        <Grid container item justifyContent="center" alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h5">Dashboard</Typography>
          </Grid>
          <Grid container item justifyContent="flex-end" xs={6}>
            <DateRangePicker
              requiredFormat="YYYY-MM-DDTHH:MM"
              startPeriod={startPeriod}
              endPeriod={endPeriod}
              onStartDateSelect={(date) => dispatch(setDashboardStatPeriod({ period: 'startPeriod', value: date }))}
              onEndDateSelect={(date) => dispatch(setDashboardStatPeriod({ period: 'endPeriod', value: date }))}
            />
          </Grid>
        </Grid>
      </Grid>
      {statsIsLoading ? (
        <Grid container item justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            Loading...
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Total Orders" count={stats.totalOrders || 0} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Total Sales(Rs)" count={stats.totalSalesValue || 0} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Confirm Orders" count={stats.confirmedOrders || 0} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Confirm Orders Value(Rs)" count={stats.confirmedOrdersSalesValue || 0} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Confirm Orders Average Value(Rs)" count={stats.confirmedOrdersAverageValue || 0} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Confirm Orders No of Units" count={stats.confirmedOrdersUnits || 0} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Booked Orders" count={stats.bookedOrders || 0} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="No Picked Orders" count={stats.noPickOrders || 0} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Cancel Orders" count={stats.cancelOrders || 0} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <AnalyticEcommerce title="Un-attempted Orders" count={stats.assignedOrders || 0} />
          </Grid>
          {/* row 2 */}
          {/* <Grid item xs={12} md={12} lg={12}>
            <MainCard content={false}>
                <PieChart
                  series={[
                    {
                      arcLabel: (item) => `${item.label}(${item.data})`,
                      data: (stats.topCities || []).map((c, id) => ({ id, value: c.orders, label: c.city }))
                    }
                  ]}
                  height={500}
                />
              </MainCard>
          </Grid> */}
          <Grid item container rowSpacing={1} columnSpacing={0.75}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <MainCard content={false}>
                <BarChart
                  tooltip={{ trigger: 'axis' }}
                  dataset={stats.topItems || []}
                  yAxis={[{ scaleType: 'band', dataKey: 'item' }]}
                  series={[{ dataKey: 'sold', label: 'Top Items', valueFormatter: (value) => `${value}` }]}
                  barLabel={(item, context) => `${stats.topItems[item.dataIndex].item}(${stats.topItems[item.dataIndex].sold})`}
                  layout="horizontal"
                  height={500}
                />
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <MainCard content={false}>
                <BarChart
                  dataset={stats.topChannels || []}
                  yAxis={[{ scaleType: 'band', dataKey: 'chanel' }]}
                  series={[{ label: 'Top Channel', dataKey: 'orders', valueFormatter: (value) => `${value}` }]}
                  barLabel={(item, context) => `${stats.topChannels[item.dataIndex].chanel}(${stats.topChannels[item.dataIndex].orders})`}
                  layout="horizontal"
                  height={500}
                />
              </MainCard>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default DashboardDefault;
