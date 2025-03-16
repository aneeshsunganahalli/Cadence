'use client';

import { useRef, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { initializeStore, getPersistor } from '@/redux/store';
import { AppStore } from '@/redux/store';

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize ref with null as the initial value
  const storeRef = useRef<AppStore | null>(null);
  
  // Initialize store on first render if not already initialized
  if (!storeRef.current) {
    storeRef.current = initializeStore();
  }
  
  // For PersistGate
  const [persistor, setPersistor] = useState<any>(null);
  
  // Only setup persistor on client-side after mount
  useEffect(() => {
    if (!persistor && typeof window !== 'undefined' && storeRef.current) {
      setPersistor(getPersistor(storeRef.current));
    }
  }, [persistor]);
  
  // Ensure we have a store before rendering Provider
  if (!storeRef.current) {
    // This should never happen, but TypeScript needs this check
    return <div>Initializing store...</div>;
  }
  
  return (
    <Provider store={storeRef.current}>
      {persistor ? (
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          {children}
        </PersistGate>
      ) : (
        // During SSR and before persistor is ready, render without PersistGate
        children
      )}
    </Provider>
  );
}

export default Providers;