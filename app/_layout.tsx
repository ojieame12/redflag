
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { View } from 'react-native';
import "../global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient();

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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <InitialLayout />
                    <Toast />
                </AuthProvider>
            </QueryClientProvider>
        </GestureHandlerRootView>
    );
}
