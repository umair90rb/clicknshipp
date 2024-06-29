import { createAsyncThunk } from '@reduxjs/toolkit';
import { departmentService } from 'api/index';

const fetchAllDepartment = createAsyncThunk('departments/fetch', (_, { rejectWithValue }) =>
  departmentService.fetchAllDepartment().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDepartment = createAsyncThunk('department/fetch', ({ id }, { rejectWithValue }) =>
  departmentService.fetchDepartment(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateDepartment = createAsyncThunk('department/create/fetch', ({ body }, { rejectWithValue }) =>
  departmentService.fetchCreateDepartment(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateDepartment = createAsyncThunk('department/update/fetch', ({ id, body }, { rejectWithValue }) =>
  departmentService.fetchUpdateDepartment(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteDepartment = createAsyncThunk('department/delete/fetch', ({ id }, { rejectWithValue }) =>
  departmentService.fetchDeleteDepartment(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllDepartment, fetchDepartment, fetchCreateDepartment, fetchUpdateDepartment, fetchDeleteDepartment };
