import { createAsyncThunk } from '@reduxjs/toolkit';
import { unitOfMeasureService } from 'api/index';

const fetchAllUnitOfMeasure = createAsyncThunk('unitOfMeasure/fetch', (_, { rejectWithValue }) =>
  unitOfMeasureService.fetchAllUnitOfMeasure().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUnitOfMeasure = createAsyncThunk('unitOfMeasure/fetch', ({ id }, { rejectWithValue }) =>
  unitOfMeasureService.fetchUnitOfMeasure(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateUnitOfMeasure = createAsyncThunk('unitOfMeasure/create/fetch', ({ body }, { rejectWithValue }) =>
  unitOfMeasureService.fetchCreateUnitOfMeasure(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateUnitOfMeasure = createAsyncThunk('unitOfMeasure/update/fetch', ({ id, body }, { rejectWithValue }) =>
  unitOfMeasureService.fetchUpdateUnitOfMeasure(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteUnitOfMeasure = createAsyncThunk('unitOfMeasure/delete/fetch', ({ id }, { rejectWithValue }) =>
  unitOfMeasureService.fetchDeleteUnitOfMeasure(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllUnitOfMeasure, fetchUnitOfMeasure, fetchCreateUnitOfMeasure, fetchUpdateUnitOfMeasure, fetchDeleteUnitOfMeasure };
