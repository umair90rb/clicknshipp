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

const fetchCreateEmployeeEducation = createAsyncThunk('employee/education/create/fetch', ({ body }, { rejectWithValue }) =>
  employeeService.fetchCreateEmployeeEducation(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateEmployeeExperience = createAsyncThunk('employee/experience/create/fetch', ({ body }, { rejectWithValue }) =>
  employeeService.fetchCreateEmployeeExperience(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateEmployeeImmediateContact = createAsyncThunk('employee/immediateContact/create/fetch', ({ body }, { rejectWithValue }) =>
  employeeService.fetchCreateEmployeeImmediateContact(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateEmployeeAllowance = createAsyncThunk('employee/allowance/create/fetch', ({ body }, { rejectWithValue }) =>
  employeeService.fetchCreateEmployeeAllowance(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateEmployee = createAsyncThunk('employee/update/fetch', ({ id, body }, { rejectWithValue }) =>
  employeeService.fetchUpdateEmployee(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteEmployee = createAsyncThunk('employee/delete/fetch', ({ id }, { rejectWithValue }) =>
  employeeService.fetchDeleteEmployee(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export {
  fetchAllEmployee,
  fetchEmployee,
  fetchCreateEmployee,
  fetchCreateEmployeeEducation,
  fetchCreateEmployeeExperience,
  fetchCreateEmployeeImmediateContact,
  fetchCreateEmployeeAllowance,
  fetchUpdateEmployee,
  fetchDeleteEmployee
};
