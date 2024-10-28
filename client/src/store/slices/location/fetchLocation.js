import { createAsyncThunk } from '@reduxjs/toolkit';
import { locationService } from 'api/index';

const fetchAllLocation = createAsyncThunk('locations/all/fetch', (_, { rejectWithValue }) =>
  locationService.fetchAllLocation().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchLocation = createAsyncThunk('location/fetch', ({ id }, { rejectWithValue }) =>
  locationService.fetchLocation(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateLocation = createAsyncThunk('location/create/fetch', ({ body }, { rejectWithValue }) =>
  locationService.fetchCreateLocation(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateLocation = createAsyncThunk('location/update/fetch', ({ id, body }, { rejectWithValue }) =>
  locationService.fetchUpdateLocation(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteLocation = createAsyncThunk('location/delete/fetch', ({ id }, { rejectWithValue }) =>
  locationService.fetchDeleteLocation(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllLocation, fetchLocation, fetchCreateLocation, fetchUpdateLocation, fetchDeleteLocation };
