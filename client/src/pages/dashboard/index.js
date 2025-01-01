import { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardCompareStats, fetchDashboardStats } from 'store/slices/dashboard/fetchDashboard';
import {
  dashboardStartPeriodSelector,
  dashboardEndPeriodSelector,
  dashboardIsLoadingSelector,
  dashboardStatsSelector,
  dashboardCompareStartPeriodSelector,
  dashboardCompareEndPeriodSelector,
  dashboardCompareStatsSelector
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

  const compare = useSelector(dashboardCompareStatsSelector);
  const compareStartPeriod = useSelector(dashboardCompareStartPeriodSelector);
  const compareEndPeriod = useSelector(dashboardCompareEndPeriodSelector);

  useEffect(() => {
    dispatch(fetchDashboardStats({ startPeriod, endPeriod }));
  }, [startPeriod, endPeriod]);

  useEffect(() => {
    if (compareStartPeriod && compareEndPeriod) {
      dispatch(fetchDashboardCompareStats({ startPeriod: compareStartPeriod, endPeriod: compareEndPeriod }));
    }
  }, [compareStartPeriod, compareEndPeriod]);

  return (
    <Grid container rowSpacing={1} columnSpacing={0.75}>
      {/* row 1 */}
      <Grid item xs={12}>
        <Grid container item justifyContent="center" alignItems="center">
          <Grid item xs={2}>
            <Typography variant="h5">Dashboard</Typography>
          </Grid>
          <Grid container item gap={1} justifyContent="flex-end" alignItems="center" xs={10}>
            <DateRangePicker
              requiredFormat="YYYY-MM-DDTHH:MM"
              startPeriod={startPeriod}
              endPeriod={endPeriod}
              onStartDateSelect={(date) => dispatch(setDashboardStatPeriod({ period: 'startPeriod', value: date }))}
              onEndDateSelect={(date) => dispatch(setDashboardStatPeriod({ period: 'endPeriod', value: date }))}
            />
            <>
              <Typography variant="body1">Compare to:</Typography>
              <DateRangePicker
                requiredFormat="YYYY-MM-DDTHH:MM"
                startPeriod={compareStartPeriod}
                endPeriod={compareEndPeriod}
                onStartDateSelect={(date) => dispatch(setDashboardStatPeriod({ period: 'compareStartPeriod', value: date }))}
                onEndDateSelect={(date) => dispatch(setDashboardStatPeriod({ period: 'compareEndPeriod', value: date }))}
              />
            </>
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
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AnalyticEcommerce
              title="Total Orders"
              count={stats.totalOrders || 0}
              percentage={compare?.totalOrders && Math.round(((stats.totalOrders - compare?.totalOrders) / compare?.totalOrders) * 100)}
              extra={compare?.totalOrders}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AnalyticEcommerce
              title="Total Sales(Rs)"
              count={stats.totalSalesValue || 0}
              percentage={
                compare?.totalSalesValue &&
                Math.round(((stats.totalSalesValue - compare?.totalSalesValue) / compare?.totalSalesValue) * 100)
              }
              extra={compare?.totalSalesValue}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AnalyticEcommerce
              title="Confirm Orders"
              count={stats.confirmedOrders || 0}
              percentage={
                compare?.confirmedOrders &&
                Math.round(((stats.confirmedOrders - compare?.confirmedOrders) / compare?.confirmedOrders) * 100)
              }
              extra={compare?.confirmedOrders}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AnalyticEcommerce
              title="Confirm Orders Value(Rs)"
              count={stats.confirmedOrdersSalesValue || 0}
              percentage={
                compare?.confirmedOrdersSalesValue &&
                Math.round(
                  ((stats.confirmedOrdersSalesValue - compare?.confirmedOrdersSalesValue) / compare?.confirmedOrdersSalesValue) * 100
                )
              }
              extra={compare?.confirmedOrdersSalesValue}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AnalyticEcommerce
              title="Orders Average Value(Rs)"
              count={stats.confirmedOrdersAverageValue || 0}
              percentage={
                compare?.confirmedOrdersAverageValue &&
                Math.round(
                  ((stats.confirmedOrdersAverageValue - compare?.confirmedOrdersAverageValue) / compare?.confirmedOrdersAverageValue) * 100
                )
              }
              extra={compare?.confirmedOrdersAverageValue}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AnalyticEcommerce
              title="Confirm Orders Units"
              count={stats.confirmedOrdersUnits || 0}
              percentage={
                compare?.confirmedOrdersUnits &&
                Math.round(((stats.confirmedOrdersUnits - compare?.confirmedOrdersUnits) / compare?.confirmedOrdersUnits) * 100)
              }
              extra={compare?.confirmedOrdersUnits}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AnalyticEcommerce
              title="Booked Orders"
              count={stats.bookedOrders || 0}
              extra={compare?.bookedOrders}
              percentage={compare?.bookedOrders && Math.round(((stats.bookedOrders - compare?.bookedOrders) / compare?.bookedOrders) * 100)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AnalyticEcommerce
              title="No Picked Orders"
              count={stats.noPickOrders || 0}
              extra={compare?.noPickOrders}
              percentage={compare?.noPickOrders && Math.round(((stats.noPickOrders - compare?.noPickOrders) / compare?.noPickOrders) * 100)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AnalyticEcommerce
              title="Cancel Orders"
              count={stats.cancelOrders || 0}
              extra={compare?.cancelOrders}
              percentage={compare?.cancelOrders && Math.round(((stats.cancelOrders - compare?.cancelOrders) / compare?.cancelOrders) * 100)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <AnalyticEcommerce
              title="Un-attempted Orders"
              count={stats.assignedOrders || 0}
              extra={compare?.assignedOrders}
              percentage={
                compare?.assignedOrders && Math.round(((stats.assignedOrders - compare?.assignedOrders) / compare?.assignedOrders) * 100)
              }
            />
          </Grid>
          <Grid item container rowSpacing={1} columnSpacing={0.75}>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <MainCard content={false}>
                <BarChart
                  yAxis={[{ scaleType: 'band', data: (stats.topItems || []).map((i) => i.item) }]}
                  series={[
                    { data: (stats?.topItems || []).map((i) => i.sold), label: 'Top Items', valueFormatter: (value) => `Sold ${value}` },
                    ...(compare
                      ? [
                          {
                            data: (compare?.topItems || []).map((i) => i.sold),
                            label: 'Compare Items',
                            valueFormatter: (value) => `Sold ${value}`
                          }
                        ]
                      : [])
                  ]}
                  leftAxis={null}
                  borderRadius={5}
                  grid={{ vertical: true }}
                  layout="horizontal"
                  height={500}
                />
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <MainCard content={false}>
                <BarChart
                  borderRadius={5}
                  grid={{ vertical: true }}
                  leftAxis={null}
                  yAxis={[{ label: '', scaleType: 'band', data: (stats.topChannels || []).map((c) => c.chanel) }]}
                  series={[
                    {
                      label: 'Top Channel',
                      data: (stats?.topChannels || []).map((c) => c.orders),
                      valueFormatter: (value) => `Orders ${value}`
                    },
                    ...(compare
                      ? [
                          {
                            label: 'Compare Channel',
                            data: (compare?.topChannels || []).map((c) => c.orders),
                            valueFormatter: (value) => `Orders ${value}`
                          }
                        ]
                      : [])
                  ]}
                  layout="horizontal"
                  height={500}
                />
              </MainCard>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <MainCard content={false}>
                <BarChart
                  borderRadius={5}
                  grid={{ vertical: true }}
                  leftAxis={null}
                  yAxis={[{ label: '', scaleType: 'band', data: (stats.topCities || []).map((c) => c.city) }]}
                  series={[
                    {
                      label: 'Top Cities',
                      data: (stats?.topCities || []).map((c) => c.orders),
                      valueFormatter: (value) => `Orders ${value}`
                    },
                    ...(compare
                      ? [
                          {
                            label: 'Compare Cities',
                            data: (compare?.topCities || []).map((c) => c.orders),
                            valueFormatter: (value) => `Orders ${value}`
                          }
                        ]
                      : [])
                  ]}
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
