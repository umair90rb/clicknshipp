import { createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from 'api/index';

const fetchDashboardStats = createAsyncThunk('stats/fetch', ({ startPeriod, endPeriod }, { rejectWithValue }) =>
  dashboardService.fetchStats(startPeriod, endPeriod).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchDashboardStats };
