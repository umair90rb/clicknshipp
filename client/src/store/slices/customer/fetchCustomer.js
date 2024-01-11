import { createAsyncThunk } from '@reduxjs/toolkit';
import { customerService } from 'api/index';

const fetchAllCustomer = createAsyncThunk('customers/fetch', (_, { rejectWithValue }) =>
  customerService.fetchAllCustomer().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCustomer = createAsyncThunk('customer/fetch', ({ id }, { rejectWithValue }) =>
  customerService.fetchCustomer(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchSearchCustomer = createAsyncThunk('customer/search/fetch', ({ body }, { rejectWithValue }) =>
  customerService.fetchSearchCustomer(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

// const fetchCreateUser = createAsyncThunk(
//   'user/create/fetch',
//   async ({ body }, { rejectWithValue }) =>
//     await customerService.fetchCreateUser(body).catch((error) => rejectWithValue(error.response.data))
// );

// const fetchUpdateUser = createAsyncThunk(
//   'user/update/fetch',
//   async ({ body }, { rejectWithValue }) =>
//     await customerService.fetchUpdateUser(body).catch((error) => rejectWithValue(error.response.data))
// );

// const fetchDeleteUser = createAsyncThunk(
//   'user/delete/fetch',
//   async ({ id }, { rejectWithValue }) => await customerService.fetchDeleteUser(id).catch((error) => rejectWithValue(error.response.data))
// );

export { fetchAllCustomer, fetchCustomer, fetchSearchCustomer };
