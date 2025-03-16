import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { AppStore, AppPersistor } from '../types/redux';

const rootReducer = combineReducers({ user: userReducer });

// Create store without persistence configuration first
let store: AppStore;
let persistor: AppPersistor | null = null;

// Only use persistReducer on the client side
if (typeof window !== 'undefined') {
  // Dynamic import for client-side only
  const createClientStore = async () => {
    const storage = (await import('redux-persist/lib/storage')).default;
    
    const persistConfig = {
      key: 'root',
      version: 1,
      storage
    };
    
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    
    store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          }
        })
    }) as AppStore;
    
    persistor = persistStore(store);
  };
  
  // Execute immediately
  createClientStore();
} else {
  // Server-side store without persistence
  store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
  }) as AppStore;
}

// Export as any initially, but these get properly typed after initialization
export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;