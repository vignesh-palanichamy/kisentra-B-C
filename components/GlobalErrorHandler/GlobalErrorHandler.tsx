'use client';

import { useEffect } from 'react';

/**
 * Global error handler to catch and suppress AbortErrors from Turbopack hot reload
 * This prevents AbortErrors from appearing as runtime errors in the browser
 */
export default function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections (AbortErrors)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      
      // Check if it's an AbortError from Turbopack hot reload
      if (
        reason?.name === 'AbortError' ||
        reason?.message?.includes('aborted') ||
        reason?.message?.includes('signal is aborted') ||
        reason?.code === '20' ||
        (typeof reason === 'string' && reason.includes('aborted'))
      ) {
        event.preventDefault();
        // Silently ignore - this is expected during hot reload
        return;
      }
    };

    // Handle runtime errors (AbortErrors that slip through)
    const handleError = (event: ErrorEvent) => {
      const error = event.error;
      
      // Check if it's an AbortError
      if (
        error?.name === 'AbortError' ||
        error?.message?.includes('aborted') ||
        error?.message?.includes('signal is aborted')
      ) {
        event.preventDefault();
        // Silently ignore - this is expected during hot reload
        return false;
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null; // This component doesn't render anything
}
