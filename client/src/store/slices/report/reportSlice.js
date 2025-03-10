import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchReport } from './fetchReport';
import { addTotalRow } from './helper';
import { getEndOfDay, getStartOfDay } from 'utils/format-date';

const initialState = {
  data: [],
  fetchStatus: fetchStatus.IDLE,
  error: null,
  type: '',
  brand: [],
  chanel: [],
  cities: [],
  deliveryServiceAccounts: [],
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
    setReportCities: (state, action) => {
      state.cities = action.payload;
    },
    setReportDeliveryServicesAccount: (state, action) => {
      state.deliveryServiceAccounts = action.payload;
    },
    setReportChanel: (state, action) => {
      state.chanel = action.payload;
    },
    clearReportState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchReport.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchReport.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.data = addTotalRow(state.type, data.report);
      state.error = null;
    });
    builder.addCase(fetchReport.rejected, (state, action) => {
      state.data = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const {
  setReportPeriod,
  setReportType,
  setReportBrand,
  setReportCities,
  setReportChanel,
  setReportDeliveryServicesAccount,
  clearReportState
} = reportSlice.actions;
export default reportSlice.reducer;
