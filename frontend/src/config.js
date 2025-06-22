// Environment configuration
const config = {
    // Use deployed backend URL if available, otherwise fallback to localhost
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://the-future-university-sde-assignment-production.up.railway.app',

    // Fallback to localhost for development if needed
    LOCAL_API_URL: 'http://localhost:8000',

    // Determine which URL to use
    getApiUrl: () => {
        // If REACT_APP_API_URL is set, use it
        if (process.env.REACT_APP_API_URL) {
            return process.env.REACT_APP_API_URL;
        }

        // Otherwise use the deployed URL
        return 'https://the-future-university-sde-assignment-production.up.railway.app';
    }
};

export default config; 