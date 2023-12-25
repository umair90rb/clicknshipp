import { createAsyncThunk } from '@reduxjs/toolkit';
import { supplierService } from 'api/index';

const fetchAllSupplier = createAsyncThunk('suppliers/fetch', (_, { rejectWithValue }) =>
  supplierService.fetchAllSupplier().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchSupplier = createAsyncThunk('supplier/fetch', ({ id }, { rejectWithValue }) =>
  supplierService.fetchSupplier(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateSupplier = createAsyncThunk('supplier/create/fetch', ({ body }, { rejectWithValue }) =>
  supplierService.fetchAddSupplier(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateSupplier = createAsyncThunk('supplier/update/fetch', ({ id, body }, { rejectWithValue }) =>
  supplierService.fetchUpdateSupplier(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteSupplier = createAsyncThunk('supplier/delete/fetch', ({ id }, { rejectWithValue }) =>
  supplierService.fetchDeleteSupplier(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllSupplier, fetchSupplier, fetchCreateSupplier, fetchUpdateSupplier, fetchDeleteSupplier };
