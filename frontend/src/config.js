// Environment configuration
const config = {
    // Use deployed backend URL if available, otherwise fallback to localhost
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://the-future-university-sde-assignment-production.up.railway.app/',

    // Fallback to localhost for development if needed
    LOCAL_API_URL: 'http://localhost:8000',

    // Determine which URL to use
    getApiUrl: () => {
        // Check if we're in development mode
        const isDevelopment = process.env.NODE_ENV === 'development';

        // If REACT_APP_API_URL is set, use it
        if (process.env.REACT_APP_API_URL) {
            return process.env.REACT_APP_API_URL;
        }

        // In development, default to localhost
        if (isDevelopment) {
            return 'http://localhost:8000';
        }

        // In production, use the deployed URL
        return 'https://the-future-university-sde-assignment-production.up.railway.app';
    },

    // Get current environment
    getEnvironment: () => {
        return process.env.NODE_ENV || 'development';
    }
};

export default config; 
