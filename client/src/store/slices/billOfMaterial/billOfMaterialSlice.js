import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllBillOfMaterial } from './fetchBillOfMaterial';

const initialState = {
  list: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const billOfMaterialSlice = createSlice({
  name: 'billOfMaterial',
  initialState,
  reducers: {
    createBillOfMaterial: (state, action) => {
      state.list = [...state.list, action.payload];
    },
    updateBillOfMaterial: (state, action) => {
      const index = state.list.indexOf((stock) => stock.id === action.payload.id);
      state.list.splice(index, 1, action.payload);
    },
    deleteBillOfMaterial: (state, action) => {
      state.list = state.list.filter((stock) => stock.id !== action.payload.id);
    },
    clearBillOfMaterialState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllBillOfMaterial.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllBillOfMaterial.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.list = data.billOfMaterials;
      state.error = null;
    });
    builder.addCase(fetchAllBillOfMaterial.rejected, (state, action) => {
      state.list = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { createBillOfMaterial, updateBillOfMaterial, deleteBillOfMaterial, clearBillOfMaterialState } = billOfMaterialSlice.actions;
export default billOfMaterialSlice.reducer;
