
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { View } from 'react-native';
import "../global.css";

function InitialLayout() {
    const { session, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!session && !inAuthGroup) {
            // Redirect to onboarding if not signed in
            router.replace('/(auth)/onboarding');
        } else if (session && inAuthGroup) {
            // Redirect to home if signed in
            router.replace('/(app)/(home)');
        }
    }, [session, isLoading, segments]);

    return <Slot />;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
}
