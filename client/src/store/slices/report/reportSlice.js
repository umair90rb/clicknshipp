import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAgentReport } from './fetchReport';
import { addTotalRow } from './helper';
import { getEndOfDay, getStartOfDay } from 'utils/format-date';

const initialState = {
  data: [],
  fetchStatus: fetchStatus.IDLE,
  error: null,
  type: '',
  brand: [],
  chanel: [],
  startPeriod: getStartOfDay(),
  endPeriod: getEndOfDay()
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReportPeriod: (state, action) => {
      const { period, value } = action.payload;
      state[period] = value;
    },
    setReportType: (state, action) => {
      state.data = [];
      state.error = null;
      state.fetchStatus = fetchStatus.IDLE;
      state.type = action.payload;
    },
    setReportBrand: (state, action) => {
      state.brand = action.payload;
    },
    setReportChanel: (state, action) => {
      state.chanel = action.payload;
    },
    clearReportState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAgentReport.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAgentReport.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.data = addTotalRow(state.type, data.report);
      state.error = null;
    });
    builder.addCase(fetchAgentReport.rejected, (state, action) => {
      state.data = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { setReportPeriod, setReportType, setReportBrand, setReportChanel, clearReportState } = reportSlice.actions;
export default reportSlice.reducer;
