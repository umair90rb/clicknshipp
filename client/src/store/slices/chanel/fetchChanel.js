import { createAsyncThunk } from '@reduxjs/toolkit';
import { chanelService } from 'api/index';

const fetchAllChanel = createAsyncThunk('chanels/fetch', (_, { rejectWithValue }) =>
  chanelService.fetchAllChanel().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchChanel = createAsyncThunk('chanel/fetch', ({ id }, { rejectWithValue }) =>
  chanelService.fetchChanel(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateChanel = createAsyncThunk('chanel/create/fetch', ({ body }, { rejectWithValue }) =>
  chanelService.fetchCreateChanel(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateChanel = createAsyncThunk('chanel/update/fetch', ({ id, body }, { rejectWithValue }) =>
  chanelService.fetchUpdateChanel(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteChanel = createAsyncThunk('chanel/delete/fetch', ({ id }, { rejectWithValue }) =>
  chanelService.fetchDeleteChanel(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllChanel, fetchChanel, fetchCreateChanel, fetchUpdateChanel, fetchDeleteChanel };
