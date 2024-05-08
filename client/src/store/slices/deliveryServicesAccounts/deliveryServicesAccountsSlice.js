import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchDeliveryServiceAccounts } from './fetchDeliveryServicesAccounts';

const initialState = {
  accounts: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};

const deliveryServiceAccounts = createSlice({
  name: 'deliveryServiceAccounts',
  initialState,
  reducers: {
    clearDeliveryServiceState: () => initialState,
    addDeliveryServiceAccount: (state, action) => {
      state.accounts = [action.payload, ...state.accounts];
    },
    updateDeliveryServiceAccount: (state, action) => {
      const index = state.accounts.findIndex((a) => a.id === action.payload.id);
      if (index > -1) {
        state.accounts[index] = action.payload;
      }
    },
    deleteDeliveryServiceAccount: (state, action) => {
      state.accounts = state.accounts.filter((a) => a.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDeliveryServiceAccounts.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchDeliveryServiceAccounts.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.accounts = data.accounts;
      state.error = null;
    });
    builder.addCase(fetchDeliveryServiceAccounts.rejected, (state, action) => {
      state.accounts = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { clearDeliveryServiceState, addDeliveryServiceAccount, updateDeliveryServiceAccount, deleteDeliveryServiceAccount } =
  deliveryServiceAccounts.actions;
export default deliveryServiceAccounts.reducer;
