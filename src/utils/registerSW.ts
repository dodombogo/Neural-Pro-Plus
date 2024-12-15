export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '/Neural-Pro-Plus/sw.js',
        {
          scope: '/Neural-Pro-Plus/',
          type: 'module',
          updateViaCache: 'none'
        }
      );

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update prompt if needed
              console.log('New content is available; please refresh.');
            }
          });
        }
      });

      console.log('ServiceWorker registration successful:', registration.scope);
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  } else {
    console.log('Service workers are not supported');
  }
};
