import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAgentReport } from './fetchReport';
import moment from 'moment';

const initialState = {
  agent: {
    data: null,
    fetchStatus: fetchStatus.IDLE,
    error: null
  },
  startPeriod: moment(new Date()).startOf('day').format('YYYY-MM-DDTHH:MM'),
  endPeriod: moment(new Date()).format('YYYY-MM-DDTHH:MM')
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setAgentReportStatPeriod: (state, action) => {
      const { period, value } = action.payload;
      state[period] = moment(value).startOf('day').format('YYYY-MM-DDTHH:MM');
    },
    clearReportState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAgentReport.pending, (state, _action) => {
      state.agent.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAgentReport.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.agent.fetchStatus = fetchStatus.SUCCESS;
      state.agent.data = data.report;
      state.agent.error = null;
    });
    builder.addCase(fetchAgentReport.rejected, (state, action) => {
      state.agent.data = {};
      state.agent.fetchStatus = fetchStatus.FAILURE;
      state.agent.error = action.payload;
    });
  }
});
export const { setAgentReportStatPeriod, clearReportState } = reportSlice.actions;
export default reportSlice.reducer;
