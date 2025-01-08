import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchDashboardGraph, fetchDashboardStats, fetchDashboardCompareStats } from './fetchDashboard';
import moment from '../../../../node_modules/moment/moment';
import { subtractDaysFromToday } from 'utils/format-date';

const initialState = {
  stats: {},
  graph: {
    deliveryRatio: 0,
    salesTrend: {
      xLabels: [],
      data: [
        { data: [], label: 'Confirmed Orders' },
        { data: [], label: 'Generated Orders' }
      ]
    },
    fetchStatus: fetchStatus.IDLE,
    error: null,
    startPeriod: moment(subtractDaysFromToday(30)).startOf('day').format('YYYY-MM-DDTHH:MM'),
    endPeriod: moment(new Date()).endOf('day').format('YYYY-MM-DDTHH:MM')
  },
  compare: null,
  fetchStatus: fetchStatus.IDLE,
  error: null,
  startPeriod: moment(new Date()).startOf('day').format('YYYY-MM-DDTHH:MM'),
  endPeriod: moment(new Date()).endOf('day').format('YYYY-MM-DDTHH:MM'),
  compareStartPeriod: moment(subtractDaysFromToday(1)).startOf('day').format('YYYY-MM-DDTHH:MM'),
  compareEndPeriod: moment(subtractDaysFromToday(1)).endOf('day').format('YYYY-MM-DDTHH:MM')
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardStatPeriod: (state, action) => {
      const { period, value } = action.payload;
      state[period] = value;
    },
    clearDashboardState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardStats.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.stats = data.stats;
      state.error = null;
    });
    builder.addCase(fetchDashboardStats.rejected, (state, action) => {
      state.stats = {};
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });

    builder.addCase(fetchDashboardCompareStats.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchDashboardCompareStats.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.compare = data.stats;
      state.error = null;
    });
    builder.addCase(fetchDashboardCompareStats.rejected, (state, action) => {
      state.compare = null;
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });

    builder.addCase(fetchDashboardGraph.pending, (state, _action) => {
      state.graph.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchDashboardGraph.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.graph.fetchStatus = fetchStatus.SUCCESS;
      state.graph.deliveryRatio = ((data?.deliveryRatio.delivered / data?.deliveryRatio.total) * 100).toFixed(0) || 0;
      state.graph.salesTrend = {
        xLabels: data?.salesTrend.map((trend) => `${trend.day}`),
        data: [
          {
            data: data?.salesTrend.map((trend) => Number(trend.confirmed_orders)),
            label: 'Confirmed Orders'
          },
          {
            data: data?.salesTrend.map((trend) => Number(trend.received_orders)),
            label: 'Generated Orders'
          }
        ]
      };
    });
    builder.addCase(fetchDashboardGraph.rejected, (state, action) => {
      state.graph.data = {};
      state.graph.fetchStatus = fetchStatus.FAILURE;
      state.graph.error = action.payload;
    });
  }
});
export const { setDashboardStatPeriod, clearDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
