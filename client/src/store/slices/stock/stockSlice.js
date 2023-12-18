import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllStock } from './fetchStock';

const initialState = {
  stocks: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    clear: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllStock.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllStock.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.stocks = data.stocks;
      state.error = null;
    });
    builder.addCase(fetchAllStock.rejected, (state, action) => {
      state.stocks = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { clear } = stockSlice.actions;
export default stockSlice.reducer;
