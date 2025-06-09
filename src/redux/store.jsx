import { configureStore } from '@reduxjs/toolkit';
import { movieApi } from './movieApi';
import backpackReducer from './backpackSlice';


const store = configureStore({
  reducer: {
    [movieApi.reducerPath]: movieApi.reducer,
    backpack: backpackReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(movieApi.middleware),
});

export default store;

// configureStore reducer and middleware set kare chhe