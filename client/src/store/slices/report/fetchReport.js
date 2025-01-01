import { createAsyncThunk } from '@reduxjs/toolkit';
import { reportService } from 'api/index';

const fetchReport = createAsyncThunk('report/fetch', ({ body }, { rejectWithValue }) =>
  reportService.fetchReport(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchReport };
