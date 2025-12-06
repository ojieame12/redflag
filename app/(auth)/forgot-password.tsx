
import { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    async function sendResetLink() {
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'redflag://reset-password',
        });

        if (error) Alert.alert(error.message);
        else Alert.alert('Check your email', 'We sent you a password reset link.');

        setLoading(false);
    }

    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            <TouchableOpacity onPress={() => router.back()} className="mb-6">
                <ArrowLeft size={24} color="#484848" />
            </TouchableOpacity>

            <View className="mb-8">
                <Text className="text-3xl font-bold text-airbnb-black mb-2">Reset Password</Text>
                <Text className="text-airbnb-foggy">Enter your email to receive a reset link.</Text>
            </View>

            <View className="gap-4">
                <TextInput
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-lg"
                    placeholder="Email address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
            </View>

            <Button label={loading ? "Sending..." : "Send Reset Link"} onPress={sendResetLink} disabled={loading} className="mt-6" />
        </SafeAreaView>
    );
}
