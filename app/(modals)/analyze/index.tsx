import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { useAnalysis } from '@/hooks/useAnalysis';
import { ArrowLeft, Image as ImageIcon, MessageSquare, Mic } from 'lucide-react-native';

export default function AnalyzeScreen() {
    const router = useRouter();
    const { pickImage, loading } = useAnalysis();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 border-b border-gray-100 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft color="#484848" size={24} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-airbnb-black">New Analysis</Text>
            </View>

            <View className="p-6">
                <Text className="text-lg font-medium text-airbnb-black mb-6">
                    Choose input method
                </Text>

                <View className="gap-4">
                    <TouchableOpacity
                        onPress={pickImage}
                        disabled={loading}
                        className="flex-row items-center p-4 bg-gray-50 rounded-xl border border-gray-100 active:bg-gray-100"
                    >
                        <View className="bg-white p-3 rounded-full mr-4 shadow-sm">
                            <ImageIcon size={24} color="#FF5A5F" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-airbnb-black text-lg">Screenshot</Text>
                            <Text className="text-airbnb-foggy">Upload from camera roll</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/analyze/text')}
                        className="flex-row items-center p-4 bg-gray-50 rounded-xl border border-gray-100 active:bg-gray-100"
                    >
                        <View className="bg-white p-3 rounded-full mr-4 shadow-sm">
                            <MessageSquare size={24} color="#FF5A5F" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-airbnb-black text-lg">Text Paste</Text>
                            <Text className="text-airbnb-foggy">Paste conversation text</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/analyze/voice')}
                        className="flex-row items-center p-4 bg-gray-50 rounded-xl border border-gray-100 active:bg-gray-100"
                    >
                        <View className="bg-white p-3 rounded-full mr-4 shadow-sm">
                            <Mic size={24} color="#FF5A5F" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-airbnb-black text-lg">Voice Note</Text>
                            <Text className="text-airbnb-foggy">Record audio analysis</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {loading && (
                    <View className="mt-12 items-center">
                        <Text className="text-airbnb-red font-bold text-lg mb-2">Analyzing...</Text>
                        <Text className="text-airbnb-foggy text-center">
                            Detecting patterns and assessing vibes.
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
