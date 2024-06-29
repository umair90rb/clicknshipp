import { createSlice } from '@reduxjs/toolkit';
import fetchStatus from 'constants/fetchStatuses';
import { fetchAllDepartment } from './fetchDepartment';

const initialState = {
  list: [],
  fetchStatus: fetchStatus.IDLE,
  error: null
};
const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    createDepartment: (state, action) => {
      state.list.push(action.payload);
    },
    updateDepartment: (state, action) => {
      const index = state.list.findIndex((department) => department.id === action.payload.id);
      if (index > -1) {
        state.list[index] = action.payload;
      }
    },
    deleteDepartment: (state, action) => {
      state.list = state.list.filter((department) => department.id !== action.payload.id);
    },
    clearDepartmentState: () => initialState
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllDepartment.pending, (state, _action) => {
      state.fetchStatus = fetchStatus.REQUEST;
    });
    builder.addCase(fetchAllDepartment.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.fetchStatus = fetchStatus.SUCCESS;
      state.list = data.departments;
      state.error = null;
    });
    builder.addCase(fetchAllDepartment.rejected, (state, action) => {
      state.list = [];
      state.fetchStatus = fetchStatus.FAILURE;
      state.error = action.payload;
    });
  }
});
export const { createDepartment, updateDepartment, deleteDepartment, clearDepartmentState } = departmentSlice.actions;
export default departmentSlice.reducer;
