import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import Profile from './components/Profile';

function App() {
    const [authMode, setAuthMode] = useState('login');
    const [currentView, setCurrentView] = useState('feed');

    const AppContent = () => {
        const { user } = useAuth();

        if (!user) {
            return (
                <div className="min-h-screen">
                    {authMode === 'login' ? (
                        <Login onSwitchToRegister={() => setAuthMode('register')} />
                    ) : (
                        <Register onSwitchToLogin={() => setAuthMode('login')} />
                    )}
                </div>
            );
        }

        return (
            <div className="min-h-screen">
                <Header
                    onProfileClick={() => setCurrentView('profile')}
                    onHomeClick={() => setCurrentView('feed')}
                />

                <main className="animate-fade-in">
                    {currentView === 'feed' ? <Feed /> : <Profile onBackToFeed={() => setCurrentView('feed')} />}
                </main>
            </div>
        );
    };

    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App; 