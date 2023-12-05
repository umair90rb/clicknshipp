import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
    }
  }
});
export const { setMessage, setPath } = utilSlice.actions;
export default utilSlice.reducer;
