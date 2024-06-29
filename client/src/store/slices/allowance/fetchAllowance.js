import { createAsyncThunk } from '@reduxjs/toolkit';
import { allowanceService } from 'api/index';

const fetchAllAllowance = createAsyncThunk('allowances/fetch', (_, { rejectWithValue }) =>
  allowanceService.fetchAllAllowance().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchAllowance = createAsyncThunk('allowance/fetch', ({ id }, { rejectWithValue }) =>
  allowanceService.fetchAllowance(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateAllowance = createAsyncThunk('allowance/create/fetch', ({ body }, { rejectWithValue }) =>
  allowanceService.fetchCreateAllowance(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateAllowance = createAsyncThunk('allowance/update/fetch', ({ id, body }, { rejectWithValue }) =>
  allowanceService.fetchUpdateAllowance(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteAllowance = createAsyncThunk('allowance/delete/fetch', ({ id }, { rejectWithValue }) =>
  allowanceService.fetchDeleteAllowance(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllAllowance, fetchAllowance, fetchCreateAllowance, fetchUpdateAllowance, fetchDeleteAllowance };
