import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllCities } from './fetchCity';

const initialState = {
  cities: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
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
  }
});
export default categorySlice.reducer;
