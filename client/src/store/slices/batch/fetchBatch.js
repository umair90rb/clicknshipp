import { createAsyncThunk } from '@reduxjs/toolkit';
import { batchService } from 'api/index';

const fetchAllBatches = createAsyncThunk('batch/all/fetch', (_, { rejectWithValue }) =>
  batchService.fetchAllBatches().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchBatch = createAsyncThunk('batch/fetch', ({ id }, { rejectWithValue }) =>
  batchService.fetchBatch(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchGetBatches = createAsyncThunk('batch/get/fetch', ({ body }, { rejectWithValue }) =>
  batchService.fetchGetBatches(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllBatches, fetchBatch, fetchGetBatches };
