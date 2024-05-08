import { createAsyncThunk } from '@reduxjs/toolkit';
import { deliveryServiceAccountsService } from 'api/index';

const fetchDeliveryServiceAccounts = createAsyncThunk('accounts/fetch', (_, { rejectWithValue }) =>
  deliveryServiceAccountsService.fetchAllDeliveryServiceAccounts().catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeliveryServiceAccount = createAsyncThunk('account/fetch', async ({ id }, { rejectWithValue }) =>
  deliveryServiceAccountsService.fetchDeliveryServiceAccount(id).catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchCreateDeliveryAccountService = createAsyncThunk('account/create/fetch', async ({ body }, { rejectWithValue }) =>
  deliveryServiceAccountsService
    .fetchCreateDeliveryServiceAccount(body)
    .catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchUpdateDeliveryAccountService = createAsyncThunk('account/update/fetch', async ({ id, body }, { rejectWithValue }) =>
  deliveryServiceAccountsService
    .fetchUpdateDeliveryServiceAccount(id, body)
    .catch((error) => rejectWithValue(error.response.data || error.message))
);

const fetchDeleteDeliveryServiceAccount = createAsyncThunk('account/delete/fetch', async ({ id }, { rejectWithValue }) =>
  deliveryServiceAccountsService
    .fetchDeleteDeliveryServiceAccount(id)
    .catch((error) => rejectWithValue(error.response.data || error.message))
);

export {
  fetchDeliveryServiceAccounts,
  fetchDeliveryServiceAccount,
  fetchCreateDeliveryAccountService,
  fetchUpdateDeliveryAccountService,
  fetchDeleteDeliveryServiceAccount
};
