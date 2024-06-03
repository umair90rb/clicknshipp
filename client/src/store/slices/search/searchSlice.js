import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchSearch } from './fetchSearch';

const initialState = {
  result: null,
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearchState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSearch.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchSearch.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.result = data.data.result;
      state.error = null;
    });
    builder.addCase(fetchSearch.rejected, (state, action) => {
      state.result = null;
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload.error;
    });
  }
});
export const { clearSearchState } = searchSlice.actions;
export default searchSlice.reducer;
