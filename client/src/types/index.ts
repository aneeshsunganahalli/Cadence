import { store } from '../redux/store'
import storage from 'redux-persist/lib/storage'



// Redux persist config type
export interface PersistConfig {
  key: string
  storage: typeof storage
  version: number
}

// Redux persist config type
export interface PersistConfig {
  key: string
  storage: typeof storage
  version: number
}

// Redux store types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch