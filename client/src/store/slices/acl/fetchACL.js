import { createAsyncThunk } from '@reduxjs/toolkit';
import { permissionService, roleService } from 'api/index';

const fetchAllPermissions = createAsyncThunk('permissions/all/fetch', (_, { rejectWithValue }) =>
  permissionService.fetchAllPermissions().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchAllRoles = createAsyncThunk('role/all/fetch', (_, { rejectWithValue }) =>
  roleService.fetchAllRole().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchRole = createAsyncThunk('role/fetch', ({ id }, { rejectWithValue }) =>
  roleService.fetchRole(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateRole = createAsyncThunk('role/create/fetch', ({ body }, { rejectWithValue }) =>
  roleService.fetchAddRole(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateRole = createAsyncThunk('role/update/fetch', ({ id, body }, { rejectWithValue }) =>
  roleService.fetchUpdateRole(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllPermissions, fetchAllRoles, fetchRole, fetchCreateRole, fetchUpdateRole };
