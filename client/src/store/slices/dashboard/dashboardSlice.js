import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchDashboardStats, fetchDashboardCompareStats } from './fetchDashboard';
import moment from '../../../../node_modules/moment/moment';
import { subtractDaysFromToday } from 'utils/format-date';

const initialState = {
  stats: {},
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
  }
});
export const { setDashboardStatPeriod, clearDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
