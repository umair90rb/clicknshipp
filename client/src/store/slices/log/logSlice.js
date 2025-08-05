import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchOrderCreateLogs } from './fetchLogs';

const initialState = {
  list: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};
const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    clearLogsState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrderCreateLogs.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchOrderCreateLogs.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.list = data.logs;
      state.error = null;
    });
    builder.addCase(fetchOrderCreateLogs.rejected, (state, action) => {
      state.list = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { clearEmployeeState } = logsSlice.actions;
export default logsSlice.reducer;
