import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

// Create a NoopStorage if localStorage is not available (server-side)
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

// Use a dynamic storage that works in both browser and server
const storage = typeof window !== 'undefined' 
  ? createWebStorage('local')
  : createNoopStorage();

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // Whitelist specific reducers if needed
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with non-persisted reducer for SSR
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

// Create types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Create store instance for client-side only
let store: AppStore | undefined;

export const initializeStore = () => {
  let _store = store ?? makeStore();

  // For SSR and SSG, always create a new store
  if (typeof window === 'undefined') return _store;
  
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

// Use this to get the store
export function useStore() {
  const store = initializeStore();
  return store;
}

export function getPersistor(store: AppStore) {
  return persistStore(store);
}