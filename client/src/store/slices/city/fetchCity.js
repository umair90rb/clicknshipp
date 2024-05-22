import { createAsyncThunk } from '@reduxjs/toolkit';
import { cityService } from 'api/index';

const fetchAllCities = createAsyncThunk('cities/fetch', (_, { rejectWithValue }) =>
  cityService.fetchAllCity().catch((error) => rejectWithValue(error.response.data || error.message))
);

// const fetchCity = createAsyncThunk('city/fetch', ({ id }, { rejectWithValue }) =>
//   cityService.fetchCity(id).catch((error) => rejectWithValue(error.response.data || error.message))
// );

const fetchCreateCity = createAsyncThunk('city/create/fetch', ({ body }, { rejectWithValue }) =>
  cityService.fetchCreateCity(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

// const fetchUpdateCity = createAsyncThunk('city/update/fetch', ({ id, body }, { rejectWithValue }) =>
//   cityService.fetchUpdateCity(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
// );

// const fetchDeleteCity = createAsyncThunk('city/delete/fetch', ({ id }, { rejectWithValue }) =>
//   cityService.fetchDeleteCity(id).catch((error) => rejectWithValue(error.response.data || error.message))
// );

export {
  fetchAllCities,
  fetchCreateCity
  // fetchCity, fetchUpdateCity, fetchDeleteCity
};
