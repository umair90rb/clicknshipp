import { createAsyncThunk } from '@reduxjs/toolkit';
import { employeeService } from 'api/index';

const fetchAllEmployee = createAsyncThunk('employees/fetch', (_, { rejectWithValue }) =>
  employeeService.fetchAllEmployee().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchEmployee = createAsyncThunk('employee/fetch', ({ id }, { rejectWithValue }) =>
  employeeService.fetchEmployee(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateEmployee = createAsyncThunk('employee/create/fetch', ({ body }, { rejectWithValue }) =>
  employeeService.fetchCreateEmployee(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateEmployee = createAsyncThunk('employee/update/fetch', ({ id, body }, { rejectWithValue }) =>
  employeeService.fetchUpdateEmployee(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteEmployee = createAsyncThunk('employee/delete/fetch', ({ id }, { rejectWithValue }) =>
  employeeService.fetchDeleteEmployee(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllEmployee, fetchEmployee, fetchCreateEmployee, fetchUpdateEmployee, fetchDeleteEmployee };
