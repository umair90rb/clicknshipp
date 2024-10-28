import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllLocation } from './fetchLocation';

const initialState = {
  list: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearLocationState: () => initialState,
    createLocation: (state, action) => {
      state.list = [...state.list, action.payload];
    },
    updateLocation: (state, action) => {
      const index = state.list.findIndex((location) => location.id === action.payload.id);
      if (index > -1) {
        state.list[index] = action.payload;
      }
    },
    deleteLocation: (state, action) => {
      state.list = state.list.filter((location) => location.id !== action.payload.id);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllLocation.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllLocation.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.list = data.locations;
      state.error = null;
    });
    builder.addCase(fetchAllLocation.rejected, (state, action) => {
      state.list = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { clearLocationState, createLocation, updateLocation, deleteLocation } = locationSlice.actions;
export default locationSlice.reducer;
