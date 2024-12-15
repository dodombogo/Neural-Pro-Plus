export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Wait for the page load
      await window.addEventListener('load', async () => {
        // Unregister any existing service workers
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }

        // Register the new service worker
        const registration = await navigator.serviceWorker.register(
          '/Neural-Pro-Plus/sw.js',
          {
            scope: '/Neural-Pro-Plus/',
            type: 'module',
            updateViaCache: 'none'
          }
        );

        // Log success
        console.log('ServiceWorker registration successful:', registration.scope);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              console.log('Service Worker state changed:', newWorker.state);
            });
          }
        });
      });
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  } else {
    console.log('Service workers are not supported');
  }
}; 