import { createAsyncThunk } from '@reduxjs/toolkit';
import { reportService } from 'api/index';

const fetchAgentReport = createAsyncThunk('report/fetch', ({ body }, { rejectWithValue }) =>
  reportService.fetchAgentReport(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAgentReport };
