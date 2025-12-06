
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

export default function ArticleScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Fallback for the "Rose Colored" feature which isn't in the main list params logic yet
    const isRose = params.id === 'rose-colored';
    const title = isRose ? "Why we ignore Red Flags" : params.title;
    const icon = isRose ? "🚩" : params.icon;
    const content = isRose
        ? "It's common to ignore warnings when we want something to work out. Optimism bias, fear of being alone, or simply not knowing what a healthy relationship looks like can all contribute..."
        : params.text;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft size={24} color="#222" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-6">
                    <Text className="text-5xl">{icon}</Text>
                </View>

                <Text className="text-3xl font-black text-airbnb-black mb-6">{title}</Text>

                <Text className="text-lg text-gray-700 leading-8">
                    {content}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
