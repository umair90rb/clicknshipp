import { createAsyncThunk } from '@reduxjs/toolkit';
import { designationService } from 'api/index';

const fetchAllDesignation = createAsyncThunk('designations/fetch', (_, { rejectWithValue }) =>
  designationService.fetchAllDesignation().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDesignation = createAsyncThunk('designation/fetch', ({ id }, { rejectWithValue }) =>
  designationService.fetchDesignation(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateDesignation = createAsyncThunk('designation/create/fetch', ({ body }, { rejectWithValue }) =>
  designationService.fetchCreateDesignation(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateDesignation = createAsyncThunk('designation/update/fetch', ({ id, body }, { rejectWithValue }) =>
  designationService.fetchUpdateDesignation(id, body).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteDesignation = createAsyncThunk('designation/delete/fetch', ({ id }, { rejectWithValue }) =>
  designationService.fetchDeleteDesignation(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

export { fetchAllDesignation, fetchDesignation, fetchCreateDesignation, fetchUpdateDesignation, fetchDeleteDesignation };
