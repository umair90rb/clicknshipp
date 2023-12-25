import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllChanel } from './fetchChanel';

const initialState = {
  chanels: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const chanelSlice = createSlice({
  name: 'chanel',
  initialState,
  reducers: {
    createChanel: (state, action) => {
      state.chanels.push(action.payload);
    },
    updateChanel: (state, action) => {
      const index = state.chanels.findIndex((chanel) => chanel.id === action.payload.id);
      if (index > -1) {
        state.chanels[index] = action.payload;
      }
    },
    deleteChanel: (state, action) => {
      state.chanels = state.chanels.filter((chanel) => chanel.id !== action.payload.id);
    },
    clear: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllChanel.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllChanel.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.chanels = data.chanels;
      state.error = null;
    });
    builder.addCase(fetchAllChanel.rejected, (state, action) => {
      state.chanels = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { createChanel, updateChanel, deleteChanel, clear } = chanelSlice.actions;
export default chanelSlice.reducer;
