/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface Window {
  umami?: {
    track: (eventName: string, eventData?: Record<string, unknown>) => void;
  };
}
