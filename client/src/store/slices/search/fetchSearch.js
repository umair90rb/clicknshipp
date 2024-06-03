// import { createAsyncThunk } from '@reduxjs/toolkit';
// import { searchService } from 'api/index';
// let currentAbortController = null;
// const fetchSearch = createAsyncThunk('search/fetch', async ({ body }, { rejectWithValue }) => {
//   if (currentAbortController) {
//     currentAbortController.abort();
//   }
//   currentAbortController = new AbortController();
//   const signal = currentAbortController.signal;
//   try {
//     const response = await searchService.fetchSearch(body, { signal });
//     currentAbortController = null;
//     return response;
//   } catch (error) {
//     currentAbortController = null;
//     if (error.name === 'AbortError') {
//       return rejectWithValue('Request was aborted');
//     }
//     return rejectWithValue(error.response?.data || error.message);
//   }
// });

// export { fetchSearch };

import { createAsyncThunk } from '@reduxjs/toolkit';
import { searchService } from 'api/index';

// Keep track of the current abort controller
let currentAbortController = null;

const fetchSearch = createAsyncThunk('search/fetch', async ({ body }, { rejectWithValue }) => {
  // Abort the previous request if it exists
  console.log(currentAbortController, 'currentAbortController');
  if (currentAbortController) {
    currentAbortController.abort();
  }

  // Create a new abort controller for the current request
  currentAbortController = new AbortController();
  const signal = currentAbortController.signal;

  try {
    const response = await searchService.fetchSearch(body, { signal });
    currentAbortController = null; // Reset the controller after successful request
    return response;
  } catch (error) {
    // Reset the controller after the request fails or is aborted
    currentAbortController = null;
    if (error.name === 'AbortError') {
      return rejectWithValue('Request was aborted');
    }
    return rejectWithValue(error.response?.data || error.message);
  }
});

export { fetchSearch };
