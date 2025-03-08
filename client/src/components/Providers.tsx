'use client'

import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "@/redux/store"
import { AppStore, AppPersistor } from "@/types/redux"

interface ProvidersProps {
  children: React.ReactNode
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-200"></div>
  </div>
)

export function Providers({ children }: ProvidersProps) {
  if (!persistor) return <LoadingSpinner />;

  return (
    <Provider store={store as AppStore}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor as AppPersistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}