import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from 'api/index';

const fetchAllUser = createAsyncThunk('users/fetch', (_, { rejectWithValue }) =>
  userService.fetchAllUser().catch((error) => rejectWithValue(error.response.data))
);

const fetchUser = createAsyncThunk(
  'user/fetch',
  async ({ id }, { rejectWithValue }) => await userService.fetchUser(id).catch((error) => rejectWithValue(error.response.data))
);

const fetchCreateUser = createAsyncThunk(
  'user/create/fetch',
  async ({ body }, { rejectWithValue }) => await userService.fetchCreateUser(body).catch((error) => rejectWithValue(error.response.data))
);

const fetchUpdateUser = createAsyncThunk(
  'user/update/fetch',
  async ({ body }, { rejectWithValue }) => await userService.fetchUpdateUser(body).catch((error) => rejectWithValue(error.response.data))
);

const fetchDeleteUser = createAsyncThunk(
  'user/delete/fetch',
  async ({ id }, { rejectWithValue }) => await userService.fetchDeleteUser(id).catch((error) => rejectWithValue(error.response.data))
);

export { fetchAllUser, fetchUser, fetchCreateUser, fetchUpdateUser, fetchDeleteUser };
