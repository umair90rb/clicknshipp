import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllNotification } from './fetchNotification';

const initialState = {
  list: [],
  fetchStatus: fetchStatus.IDLE,
  error: null,
  limit: 10,
  offset: 0
};

const reportSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setOffset: (state, action) => {
      state.offset = action.payload;
    },
    clearNotificationState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllNotification.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllNotification.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.list = data.notifications;
      state.error = null;
    });
    builder.addCase(fetchAllNotification.rejected, (state, action) => {
      state.list = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { setLimit, setOffset, clearNotificationState } = reportSlice.actions;
export default reportSlice.reducer;
