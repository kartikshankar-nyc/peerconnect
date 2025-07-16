import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    anonymousId: string;
    username?: string;
    email?: string;
    empathyScore: number;
    joinedAt: string;
    isAnonymous: boolean;
    emotionalHistory: Array<{
        date: string;
        primaryEmotion: string;
        intensity: number;
    }>;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    loginAnonymously: () => Promise<void>;
    convertToRegistered: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateEmotionalHistory: (emotion: string, intensity: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Generate cryptographic anonymous ID
const generateAnonymousId = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'anon_';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Generate secure user ID
const generateUserId = (): string => {
    return 'user_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored auth on mount
        const storedAuth = localStorage.getItem('peerconnect_auth');
        if (storedAuth) {
            try {
                const userData = JSON.parse(storedAuth);
                setUser(userData);
            } catch (error) {
                localStorage.removeItem('peerconnect_auth');
            }
        }
        setIsLoading(false);
    }, []);

    const loginAnonymously = async (): Promise<void> => {
        setIsLoading(true);

        // Simulate brief loading for UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const anonymousUser: User = {
            id: generateUserId(),
            anonymousId: generateAnonymousId(),
            empathyScore: Math.floor(Math.random() * 30) + 40, // 40-70 for anonymous users
            joinedAt: new Date().toISOString(),
            isAnonymous: true,
            emotionalHistory: []
        };

        setUser(anonymousUser);
        localStorage.setItem('peerconnect_auth', JSON.stringify(anonymousUser));
        setIsLoading(false);
    };

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dummy authentication - accept any email/password
        const registeredUser: User = {
            id: generateUserId(),
            anonymousId: generateAnonymousId(),
            username: email.split('@')[0],
            email,
            empathyScore: Math.floor(Math.random() * 40) + 60, // 60-100
            joinedAt: new Date().toISOString(),
            isAnonymous: false,
            emotionalHistory: []
        };

        setUser(registeredUser);
        localStorage.setItem('peerconnect_auth', JSON.stringify(registeredUser));
        setIsLoading(false);
    };

    const signup = async (username: string, email: string, password: string): Promise<void> => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));

        const registeredUser: User = {
            id: generateUserId(),
            anonymousId: generateAnonymousId(),
            username,
            email,
            empathyScore: Math.floor(Math.random() * 20) + 50, // 50-70 for new users
            joinedAt: new Date().toISOString(),
            isAnonymous: false,
            emotionalHistory: []
        };

        setUser(registeredUser);
        localStorage.setItem('peerconnect_auth', JSON.stringify(registeredUser));
        setIsLoading(false);
    };

    const convertToRegistered = async (username: string, email: string, password: string): Promise<void> => {
        if (!user || !user.isAnonymous) {
            throw new Error('Can only convert anonymous users');
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Preserve anonymous user's data but add registration info
        const convertedUser: User = {
            ...user,
            username,
            email,
            isAnonymous: false,
            empathyScore: user.empathyScore + 10 // Bonus for registering
        };

        setUser(convertedUser);
        localStorage.setItem('peerconnect_auth', JSON.stringify(convertedUser));
        setIsLoading(false);
    };

    const updateEmotionalHistory = (emotion: string, intensity: number) => {
        if (!user) return;

        const newEntry = {
            date: new Date().toISOString().split('T')[0],
            primaryEmotion: emotion,
            intensity
        };

        const updatedUser = {
            ...user,
            emotionalHistory: [...user.emotionalHistory.slice(-29), newEntry] // Keep last 30 days
        };

        setUser(updatedUser);
        localStorage.setItem('peerconnect_auth', JSON.stringify(updatedUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('peerconnect_auth');
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginAnonymously,
        convertToRegistered,
        logout,
        updateEmotionalHistory
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 