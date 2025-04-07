import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from 'api/index';

export const fetchAllNotification = createAsyncThunk('notification/all/fetch', ({ body }, { rejectWithValue }) =>
  notificationService.fetchAllNotification(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export const fetchCreateNotification = createAsyncThunk('notification/create/fetch', ({ body }, { rejectWithValue }) =>
  notificationService.fetchCreateNotification(body).catch((error) => rejectWithValue(error.response.data || error.message))
);

export const fetchMarkReadNotification = createAsyncThunk('notification/markRead/fetch', ({ body }, { rejectWithValue }) =>
  notificationService.fetchMarkReadNotification(body).catch((error) => rejectWithValue(error.response.data || error.message))
);
