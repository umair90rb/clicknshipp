import { createAsyncThunk } from '@reduxjs/toolkit';
import { searchService } from 'api/index';

const fetchSearch = createAsyncThunk('search/fetch', ({ body }, { rejectWithValue }) =>
  searchService.fetchSearch(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchSearch };
