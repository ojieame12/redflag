
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalysis } from '@/hooks/useAnalysis';
import { ArrowLeft, Image as ImageIcon, MessageSquare, Mic } from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';

const LOADING_MESSAGES = [
    "Extracting text...",
    "Detecting patterns...",
    "Checking for toxicity...",
    "Analyzing attachment style..."
];

export default function AnalyzeScreen() {
    const router = useRouter();
    const { pickImage, loading } = useAnalysis();
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
            }, 1500);
            return () => clearInterval(interval);
        } else {
            setMessageIndex(0);
        }
    }, [loading]);

    const handleSelection = async (action: () => void) => {
        await Haptics.selectionAsync();
        action();
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 border-b border-gray-100 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft color="#484848" size={24} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-airbnb-black">New Analysis</Text>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center p-6">
                    <View className="w-64 h-64 mb-8">
                        <LottieView
                            source={{ uri: 'https://assets9.lottiefiles.com/packages/lf20_qp1q7mct.json' }} // Magnifying glass animation
                            autoPlay
                            loop
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>
                    <Text className="text-2xl font-black text-airbnb-black mb-2 text-center animate-pulse">
                        {LOADING_MESSAGES[messageIndex]}
                    </Text>
                    <Text className="text-airbnb-foggy text-center text-lg">
                        This might take a few seconds.
                    </Text>
                </View>
            ) : (
                <View className="p-6">
                    <Text className="text-lg font-medium text-airbnb-black mb-6">
                        Choose input method
                    </Text>

                    <View className="gap-4">
                        <TouchableOpacity
                            onPress={() => handleSelection(pickImage)}
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
                            onPress={() => handleSelection(() => router.push('/analyze/text'))}
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
                            onPress={() => handleSelection(() => router.push('/analyze/voice'))}
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
                </View>
            )}
        </SafeAreaView>
    );
}
