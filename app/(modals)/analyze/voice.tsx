import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { useAnalysis } from '@/hooks/useAnalysis';
import { ArrowLeft } from 'lucide-react-native';
import AudioRecorder from '@/components/analyze/AudioRecorder';

export default function VoiceAnalyzeScreen() {
    const router = useRouter();
    const { analyzeAudio, loading } = useAnalysis();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 border-b border-gray-100 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft color="#484848" size={24} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-airbnb-black">Analysis by Voice</Text>
            </View>

            <View className="flex-1 p-6 justify-center">
                <View className="mb-10">
                    <Text className="text-3xl font-bold text-airbnb-black text-center mb-2">Speak your mind</Text>
                    <Text className="text-center text-airbnb-foggy text-lg">
                        Record a voice note about your situation. We'll listen for tone and patterns.
                    </Text>
                </View>

                <AudioRecorder
                    onAnalysisTrigger={analyzeAudio}
                    loading={loading}
                />
            </View>
        </SafeAreaView>
    );
}
