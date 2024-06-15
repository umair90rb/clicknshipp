import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchDashboardStats } from './fetchDashboard';
import moment from '../../../../node_modules/moment/moment';

const initialState = {
  stats: {},
  fetchStatus: fetchStatus.IDLE,
  error: null,
  startPeriod: moment(new Date()).startOf('day').format('YYYY-MM-DDTHH:MM'),
  endPeriod: moment(new Date()).endOf('day').format('YYYY-MM-DDTHH:MM')
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardStatPeriod: (state, action) => {
      const { period, value } = action.payload;
      if (period === 'startPeriod') {
        state[period] = moment(value).startOf('day').format('YYYY-MM-DDTHH:MM');
      } else {
        state[period] = moment(value).endOf('day').format('YYYY-MM-DDTHH:MM');
      }
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
  }
});
export const { setDashboardStatPeriod, clearDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
