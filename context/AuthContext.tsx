
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ActivityIndicator, View } from 'react-native';

type AuthContextType = {
    session: Session | null;
    isLoading: boolean;
    isAdmin: boolean; // Future proofing
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    isLoading: true,
    isAdmin: false,
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (isLoading) {
        // You might want a better loading screen here
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF5A5F" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ session, isLoading, isAdmin: false }}>
            {children}
        </AuthContext.Provider>
    );
}
