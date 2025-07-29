import React, { createContext, useContext, ReactNode } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

interface ServiceWorkerContextType {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
  requestNotificationPermission: () => Promise<void>;
  cacheUrls: (urls: string[]) => void;
  clearCache: () => Promise<void>;
  updateApp: () => void;
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType | null>(null);

export const useServiceWorkerContext = () => {
  const context = useContext(ServiceWorkerContext);
  if (!context) {
    throw new Error('useServiceWorkerContext must be used within ServiceWorkerProvider');
  }
  return context;
};

interface ServiceWorkerProviderProps {
  children: ReactNode;
}

export const ServiceWorkerProvider: React.FC<ServiceWorkerProviderProps> = ({ children }) => {
  const serviceWorker = useServiceWorker();

  return (
    <ServiceWorkerContext.Provider value={serviceWorker}>
      {children}
    </ServiceWorkerContext.Provider>
  );
};