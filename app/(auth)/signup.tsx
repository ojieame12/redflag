
import { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export default function SignupScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) Alert.alert(error.message);
        else if (!session) Alert.alert('Please check your inbox for email verification!');

        setLoading(false);
    }

    return (
        <SafeAreaView className="flex-1 bg-white p-6 justify-center">
            <View className="mb-8">
                <Text className="text-3xl font-bold text-airbnb-red mb-2">Create Account</Text>
                <Text className="text-airbnb-foggy">Start analyzing your conversations.</Text>
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
                <Button label={loading ? "Creating Account..." : "Sign Up"} onPress={signUpWithEmail} disabled={loading} />
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text className="text-center text-airbnb-foggy">
                        Already have an account? <Text className="font-bold text-airbnb-black">Log in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
