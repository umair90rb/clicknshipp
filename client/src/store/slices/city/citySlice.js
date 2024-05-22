import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllCities, fetchCreateCity } from './fetchCity';

const initialState = {
  cities: [],
  fetchStatus: fetchStatus.IDLE,
  error: null,
  create: {
    data: null,
    fetchStatus: fetchStatus.IDLE,
    error: null
  }
};

const categorySlice = createSlice({
  name: 'city',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchAllCities.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllCities.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.cities = data.cities;
      state.error = null;
    });
    builder.addCase(fetchAllCities.rejected, (state, action) => {
      state.cities = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
    builder.addCase(fetchCreateCity.pending, (state, _action) => {
      state.create.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchCreateCity.fulfilled, (state, action) => {
      const { city } = action.payload;
      state.create.fetchStatus = fetchStatus.SUCCESS;
      state.create.data = city;
      state.create.error = null;
    });
    builder.addCase(fetchCreateCity.rejected, (state, action) => {
      state.create.data = null;
      state.create.fetchStatus = fetchStatus.FAILURE;
      state.create.error = action.payload?.error;
    });
  }
});
export default categorySlice.reducer;
