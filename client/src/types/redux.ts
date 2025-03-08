import storage from 'redux-persist/lib/storage'
import { UserState } from '.'
import { Store } from '@reduxjs/toolkit'
import { Persistor } from 'redux-persist'

// Redux persist config type
export interface PersistConfig {
  key: string
  storage: typeof storage
  version: number
}

export interface RootState {
  user: UserState
}

export type AppStore = Store<RootState>
export type AppPersistor = Persistor
export type AppDispatch = AppStore['dispatch']