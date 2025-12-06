
import { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    return (
        <SafeAreaView className="flex-1 bg-white p-6 justify-center">
            <View className="mb-8">
                <Text className="text-3xl font-bold text-airbnb-black mb-2">Welcome back</Text>
                <Text className="text-airbnb-foggy">Enter your details to log in.</Text>
            </View>

            <View className="gap-4">
                <TextInput
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-lg"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-lg"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <View className="mt-6 gap-4">
                <Button label={loading ? "Logging in..." : "Log In"} onPress={signInWithEmail} disabled={loading} />
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                    <Text className="text-center text-airbnb-foggy">
                        Don't have an account? <Text className="font-bold text-airbnb-red">Sign up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
