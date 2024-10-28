import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllUnitOfMeasure } from './fetchUnitOfMeasure';

const initialState = {
  list: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const unitOfMeasure = createSlice({
  name: 'UnitOfMeasure',
  initialState,
  reducers: {
    clearUnitOfMeasureState: () => initialState,
    createUnitOfMeasure: (state, action) => {
      state.list = [...state.list, action.payload];
    },
    updateUnitOfMeasure: (state, action) => {
      const index = state.list.findIndex((uom) => uom.id === action.payload.id);
      if (index > -1) {
        state.list[index] = action.payload;
      }
    },
    deleteUnitOfMeasure: (state, action) => {
      state.list = state.list.filter((uom) => uom.id !== action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllUnitOfMeasure.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllUnitOfMeasure.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.list = data.units;
      state.error = null;
    });
    builder.addCase(fetchAllUnitOfMeasure.rejected, (state, action) => {
      state.list = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { clearUnitOfMeasureState, createUnitOfMeasure, updateUnitOfMeasure, deleteUnitOfMeasure } = unitOfMeasure.actions;
export default unitOfMeasure.reducer;
