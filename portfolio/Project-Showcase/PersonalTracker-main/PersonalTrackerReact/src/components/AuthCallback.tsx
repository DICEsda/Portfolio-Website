import React, { useEffect } from 'react';

export const AuthCallback: React.FC = () => {
  useEffect(() => {
    const handleAuthCallback = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      
      const accessToken = params.get('access_token');
      const error = params.get('error');
      
      if (accessToken) {
        // Send message to parent window
        window.opener?.postMessage({
          type: 'GOOGLE_AUTH_SUCCESS',
          accessToken
        }, window.location.origin);
      } else if (error) {
        window.opener?.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error
        }, window.location.origin);
      }
      
      // Close the popup window
      window.close();
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}; 