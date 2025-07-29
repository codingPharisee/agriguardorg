import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isOnline: navigator.onLine,
    updateAvailable: false,
    registration: null,
  });

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      setState(prev => ({ ...prev, isSupported: true }));
      registerServiceWorker();
    }

    // Set up online/offline listeners
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      toast.success('You\'re back online! Syncing data...');
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      toast.info('You\'re offline. Some features may be limited.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      setState(prev => ({ 
        ...prev, 
        isRegistered: true, 
        registration 
      }));

      console.log('Service Worker registered successfully:', registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, updateAvailable: true }));
              
              toast.info('App update available!', {
                action: {
                  label: 'Update',
                  onClick: () => updateServiceWorker(newWorker),
                },
                duration: 10000,
              });
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          toast.success('Content updated in background');
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
      toast.error('Failed to enable offline features');
    }
  };

  const updateServiceWorker = (newWorker: ServiceWorker) => {
    newWorker.postMessage({ type: 'SKIP_WAITING' });
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'activated') {
        window.location.reload();
      }
    });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
        
        // Subscribe to push notifications if supported
        if (state.registration && 'pushManager' in state.registration) {
          try {
            const subscription = await state.registration.pushManager.subscribe({
              userVisibleOnly: true,
              // You would need to generate a VAPID key for production
              applicationServerKey: null,
            });
            
            console.log('Push subscription:', subscription);
          } catch (error) {
            console.error('Push subscription failed:', error);
          }
        }
      } else {
        toast.error('Notifications permission denied');
      }
    }
  };

  const cacheUrls = (urls: string[]) => {
    if (state.registration && state.registration.active) {
      state.registration.active.postMessage({
        type: 'CACHE_URLS',
        urls,
      });
    }
  };

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      
      toast.success('Cache cleared successfully');
      
      // Reload to get fresh content
      window.location.reload();
    }
  };

  return {
    ...state,
    requestNotificationPermission,
    cacheUrls,
    clearCache,
    updateApp: () => {
      if (state.registration && state.registration.waiting) {
        updateServiceWorker(state.registration.waiting);
      }
    },
  };
};