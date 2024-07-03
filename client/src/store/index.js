import { configureStore } from '@reduxjs/toolkit';
import reducers from './rootReducer';
import networkAndTokenErrorCheckerMiddleware from './middlewars/networkAndTokenErrorCheckerMiddleware';
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(networkAndTokenErrorCheckerMiddleware)
});

const { dispatch } = store;

export { store, dispatch };

export * from './slices/auth/fetchAuth';
