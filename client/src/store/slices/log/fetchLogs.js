import { createAsyncThunk } from '@reduxjs/toolkit';
import { logService } from 'api/index';

const fetchOrderCreateLogs = createAsyncThunk('logs/order/create/fetch', ({ page, limit, filters }, { rejectWithValue }) =>
  logService.fetchOrderCreateLogs(page, limit, filters).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchOrderCreateLogs };
