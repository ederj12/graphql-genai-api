const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface GoogleMapsLoaderOptions {
  libraries?: string[];
}

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private loadPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  public load(options: GoogleMapsLoaderOptions = {}): Promise<void> {
    if (!this.loadPromise) {
      this.loadPromise = new Promise((resolve, reject) => {
        if (window.google?.maps) {
          resolve();
          return;
        }

        const libraries = options.libraries || ['places'];
        
        // Create script element
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=${libraries.join(',')}&v=weekly`;
        script.async = true;
        script.defer = true;

        // Handle script load events
        script.addEventListener('load', () => {
          if (window.google?.maps) {
            resolve();
          } else {
            reject(new Error('Google Maps failed to load'));
          }
        });

        script.addEventListener('error', () => {
          reject(new Error('Google Maps failed to load'));
        });

        // Append script to document
        document.head.appendChild(script);
      });
    }

    return this.loadPromise;
  }
}

export const googleMapsLoader = GoogleMapsLoader.getInstance();

// Type declarations for Google Maps API
declare global {
  interface Window {
    google: typeof google;
  }
} 