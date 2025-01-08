import { createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from 'api/index';

const fetchDashboardGraph = createAsyncThunk('graph/fetch', ({ startPeriod, endPeriod }, { rejectWithValue }) =>
  dashboardService.fetchGraph(startPeriod, endPeriod).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDashboardStats = createAsyncThunk('stats/fetch', ({ startPeriod, endPeriod }, { rejectWithValue }) =>
  dashboardService.fetchStats(startPeriod, endPeriod).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDashboardCompareStats = createAsyncThunk('compare/fetch', ({ startPeriod, endPeriod }, { rejectWithValue }) =>
  dashboardService.fetchStats(startPeriod, endPeriod).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchDashboardGraph, fetchDashboardStats, fetchDashboardCompareStats };
