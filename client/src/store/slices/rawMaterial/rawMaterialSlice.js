import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllRawMaterial } from './fetchRawMaterial';

const initialState = {
  list: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const rawMaterialSlice = createSlice({
  name: 'rawMaterial',
  initialState,
  reducers: {
    createRawMaterial: (state, action) => {
      state.list.push(action.payload);
    },
    updateRawMaterial: (state, action) => {
      const index = state.list.findIndex((material) => material.id === action.payload.id);
      if (index > -1) {
        state.list[index] = action.payload;
      }
    },
    deleteRawMaterial: (state, action) => {
      state.list = state.list.filter((material) => material.id !== action.payload.id);
    },
    clearRawMaterialState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllRawMaterial.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllRawMaterial.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.list = data.rawMaterials;
      state.error = null;
    });
    builder.addCase(fetchAllRawMaterial.rejected, (state, action) => {
      state.list = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { createRawMaterial, updateRawMaterial, deleteRawMaterial, clearRawMaterialState } = rawMaterialSlice.actions;
export default rawMaterialSlice.reducer;
