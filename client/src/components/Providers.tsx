'use client'

import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "@/redux/store"

export function Providers({ children }: { children: React.ReactNode }) {
  // Simple loading component for when the store is rehydrating
  const LoadingComponent = () => <div>Loading...</div>;
  
  return (
    <Provider store={store}>
      {persistor ? (
        <PersistGate loading={<LoadingComponent />} persistor={persistor}>
          {children}
        </PersistGate>
      ) : (
        // Fallback for server-side rendering when persistor is not available
        children
      )}
    </Provider>
  );
}