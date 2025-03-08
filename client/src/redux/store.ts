import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice"
import { persistReducer, persistStore } from "redux-persist";
import { PersistConfig, RootState } from '../types';

const rootReducer = combineReducers({ user: userReducer });

// Configuration will be added dynamically
let persistConfig: PersistConfig = {
  key: 'root',
  version: 1,
  storage: null as any // Will be set dynamically
};

let persistedReducer;
let store;
let persistor;

// Only initialize redux-persist on the client side
if (typeof window !== 'undefined') {
  const storage = require('redux-persist/lib/storage').default;
  persistConfig.storage = storage;
  
  persistedReducer = persistReducer(persistConfig, rootReducer);
  
  store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck: false
      })
  });
  
  persistor = persistStore(store);
} else {
  // Server-side store configuration
  store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck: false
      })
  });
}

export { store, persistor };
export type AppDispatch = typeof store.dispatch;