import { createAsyncThunk } from '@reduxjs/toolkit';
import { logService } from 'api/index';

const fetchOrderCreateLogs = createAsyncThunk('logs/order/create/fetch', (_, { rejectWithValue }) =>
  logService.fetchOrderCreateLogs().catch((error) => rejectWithValue(error.response.data || error.message))
);


export { fetchOrderCreateLogs };

