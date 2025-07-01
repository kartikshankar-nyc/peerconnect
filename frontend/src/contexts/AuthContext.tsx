import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    username: string;
    email: string;
    empathyScore: number;
    joinedAt: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored auth on mount
        const storedAuth = localStorage.getItem('peernexus_auth');
        if (storedAuth) {
            try {
                const userData = JSON.parse(storedAuth);
                setUser(userData);
            } catch (error) {
                localStorage.removeItem('peernexus_auth');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dummy authentication - accept any email/password
        const dummyUser: User = {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            username: email.split('@')[0],
            email,
            empathyScore: Math.floor(Math.random() * 40) + 60, // 60-100
            joinedAt: new Date().toISOString()
        };

        setUser(dummyUser);
        localStorage.setItem('peernexus_auth', JSON.stringify(dummyUser));
        setIsLoading(false);
    };

    const signup = async (username: string, email: string, password: string): Promise<void> => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));

        const dummyUser: User = {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            username,
            email,
            empathyScore: Math.floor(Math.random() * 20) + 50, // 50-70 for new users
            joinedAt: new Date().toISOString()
        };

        setUser(dummyUser);
        localStorage.setItem('peernexus_auth', JSON.stringify(dummyUser));
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('peernexus_auth');
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 