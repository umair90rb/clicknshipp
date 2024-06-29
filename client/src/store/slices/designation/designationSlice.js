import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllDesignation } from './fetchDesignation';

const initialState = {
  list: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};
const designationSlice = createSlice({
  name: 'designation',
  initialState,
  reducers: {
    createDesignation: (state, action) => {
      state.list.push(action.payload);
    },
    updateDesignation: (state, action) => {
      const index = state.list.findIndex((designation) => designation.id === action.payload.id);
      if (index > -1) {
        state.list[index] = action.payload;
      }
    },
    deleteDesignation: (state, action) => {
      state.list = state.list.filter((designation) => designation.id !== action.payload.id);
    },
    clearDesignationState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllDesignation.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllDesignation.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.list = data.designations;
      state.error = null;
    });
    builder.addCase(fetchAllDesignation.rejected, (state, action) => {
      state.list = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { createDesignation, updateDesignation, deleteDesignation, clearDesignationState } = designationSlice.actions;
export default designationSlice.reducer;
