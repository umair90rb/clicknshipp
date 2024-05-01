import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from 'api/index';

const fetchAllUser = createAsyncThunk('users/fetch', (_, { rejectWithValue }) =>
  userService.fetchAllUser().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUser = createAsyncThunk('user/fetch', ({ id }, { rejectWithValue }) =>
  userService.fetchUser(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUsersWithPermission = createAsyncThunk('usersWithPermissions/fetch', ({ body }, { rejectWithValue }) =>
  userService.fetchUsersWithPermissions(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateUser = createAsyncThunk('user/create/fetch', ({ body }, { rejectWithValue }) =>
  userService.fetchCreateUser(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateUser = createAsyncThunk('user/update/fetch', ({ id, body }, { rejectWithValue }) =>
  userService.fetchUpdateUser(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchSetUserDefaultBrand = createAsyncThunk('user/setDefaultBrand/fetch', ({ id }, { rejectWithValue }) =>
  userService.fetchSetDefaultBrand(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteUser = createAsyncThunk('user/delete/fetch', ({ id }, { rejectWithValue }) =>
  userService.fetchDeleteUser(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllUser, fetchUser, fetchUsersWithPermission, fetchCreateUser, fetchUpdateUser, fetchSetUserDefaultBrand, fetchDeleteUser };
