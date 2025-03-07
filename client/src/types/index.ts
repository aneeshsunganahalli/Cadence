import { store } from '../redux/store'
import storage from 'redux-persist/lib/storage'

export interface User {
  _id?: string
  username?: string
  email?: string
  avatar?: string
}

export interface UserState {
  currentUser: User | null;
  error: string | null;
  loading: boolean;
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