import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  refresh: '',
  message: null,
  type: 'success',
  path: '/'
};

const utilSlice = createSlice({
  name: 'util',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      const { message, type } = action.payload;
      state.message = message;
      state.type = type;
    },
    setPath: (state, action) => {
      state.path = action.payload;
    },
    setRefresh: (state, action) => {
      state.refresh = action.payload;
    }
  }
});
export const { setMessage, setPath, setRefresh } = utilSlice.actions;
export default utilSlice.reducer;
