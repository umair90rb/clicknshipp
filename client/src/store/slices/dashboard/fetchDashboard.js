import { createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from 'api/index';

const fetchDashboardStats = createAsyncThunk('stats/fetch', (_, { rejectWithValue }) =>
  dashboardService.fetchStats().catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchDashboardStats };
