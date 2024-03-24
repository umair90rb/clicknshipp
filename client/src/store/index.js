// third-party
import { configureStore } from '@reduxjs/toolkit';

// project import
import reducers from './rootReducer';
import tokenExpirationMiddleware from './middlewars/tokenExpirationMiddleware';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tokenExpirationMiddleware)
});

const { dispatch } = store;

export { store, dispatch };

export * from './slices/auth/fetchAuth';
