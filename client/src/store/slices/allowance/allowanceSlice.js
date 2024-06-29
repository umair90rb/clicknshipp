import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllAllowance } from './fetchAllowance';

const initialState = {
  list: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};
const allowanceSlice = createSlice({
  name: 'allowance',
  initialState,
  reducers: {
    createAllowance: (state, action) => {
      state.list.push(action.payload);
    },
    updateAllowance: (state, action) => {
      const index = state.list.findIndex((allowance) => allowance.id === action.payload.id);
      if (index > -1) {
        state.list[index] = action.payload;
      }
    },
    deleteAllowance: (state, action) => {
      state.list = state.list.filter((allowance) => allowance.id !== action.payload.id);
    },
    clearAllowanceState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllAllowance.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllAllowance.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.list = data.allowances;
      state.error = null;
    });
    builder.addCase(fetchAllAllowance.rejected, (state, action) => {
      state.list = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { createAllowance, updateAllowance, deleteAllowance, clearAllowanceState } = allowanceSlice.actions;
export default allowanceSlice.reducer;
