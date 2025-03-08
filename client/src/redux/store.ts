import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import { AppStore, AppPersistor, PersistConfig, RootState } from '../types/redux';

const rootReducer = combineReducers({ user: userReducer });

let persistConfig: PersistConfig = {
  key: 'root',
  version: 1,
  storage: null as any
};

let persistedReducer;
let store: AppStore;
let persistor: AppPersistor | null = null;

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
  }) as AppStore;
  
  persistor = persistStore(store);
} else {
  store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck: false
      })
  }) as AppStore;
}

export { store, persistor };
export type AppDispatch = typeof store.dispatch;