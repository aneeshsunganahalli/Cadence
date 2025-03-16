import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import { AppStore, AppPersistor, PersistConfig } from '../types/redux';
import { Storage } from 'redux-persist';

const rootReducer = combineReducers({ user: userReducer });

// Define storage type properly
const persistConfig: PersistConfig = {
  key: 'root',
  version: 1,
  storage: null as unknown as Storage
};

let persistedReducer;
let store: AppStore;
let persistor: AppPersistor | null = null;

if (typeof window !== 'undefined') {
  // Use dynamic import instead of require
  import('redux-persist/lib/storage').then(storageModule => {
    persistConfig.storage = storageModule.default;
    
    persistedReducer = persistReducer(persistConfig, rootReducer);
    
    store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
          serializableCheck: false
        })
    }) as AppStore;
    
    persistor = persistStore(store);
  });
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
export type RootState = ReturnType<typeof store.getState>;