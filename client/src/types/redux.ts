import storage from 'redux-persist/lib/storage'
import { UserState } from '.'

// Redux persist config type
export interface PersistConfig {
  key: string
  storage: typeof storage
  version: number
}

export interface RootState {
  user: UserState
}

export type AppDispatch = any