
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Mail } from 'lucide-react-native';
import * as Linking from 'expo-linking';

export default function VerifyEmailScreen() {
    const openMailApp = () => {
        Linking.openURL('mailto:');
    };

    return (
        <SafeAreaView className="flex-1 bg-white p-6 justify-center items-center">
            <View className="bg-red-50 p-6 rounded-full mb-6">
                <Mail size={48} color="#FF5A5F" />
            </View>

            <Text className="text-3xl font-bold text-airbnb-black mb-2 text-center">Check your email</Text>
            <Text className="text-airbnb-foggy text-center mb-8 px-4 text-lg">
                We sent a verification link to your email address. Please click it to verify your account.
            </Text>

            <Button label="Open Email App" onPress={openMailApp} className="w-full" />
        </SafeAreaView>
    );
}
