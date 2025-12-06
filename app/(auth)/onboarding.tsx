
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';

export default function OnboardingScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white justify-between p-6">
            <View className="mt-10">
                <Text className="text-4xl font-bold text-airbnb-red mb-4">RedFlag 🚩</Text>
                <Text className="text-2xl font-bold text-airbnb-black mb-2">
                    Trust your gut.
                </Text>
                <Text className="text-lg text-airbnb-foggy leading-6">
                    Get instant clarity on your conversations. Spot manipulation, love bombing, and gaslighting in seconds.
                </Text>
            </View>

            <View className="gap-4 mb-8">
                <Button
                    label="Get Started"
                    onPress={() => router.push('/(auth)/signup')}
                />
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text className="text-center font-bold text-airbnb-black p-2">
                        I already have an account
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
