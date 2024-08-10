import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllEmployee } from './fetchEmployee';

const initialState = {
  list: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};
const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    createEmployee: (state, action) => {
      state.list.push(action.payload);
    },
    updateEmployee: (state, action) => {
      const index = state.list.findIndex((employee) => employee.id === action.payload.id);
      if (index > -1) {
        state.list[index] = action.payload;
      }
    },
    deleteEmployee: (state, action) => {
      state.list = state.list.filter((employee) => employee.id !== action.payload);
    },
    clearEmployeeState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllEmployee.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllEmployee.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.list = data.employees;
      state.error = null;
    });
    builder.addCase(fetchAllEmployee.rejected, (state, action) => {
      state.list = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { createEmployee, updateEmployee, deleteEmployee, clearEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;
