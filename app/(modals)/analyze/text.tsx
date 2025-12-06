import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { useAnalysis } from '@/hooks/useAnalysis';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';

export default function TextAnalyzeScreen() {
    const router = useRouter();
    const { analyzeText, loading } = useAnalysis();
    const [text, setText] = useState('');

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="px-6 py-4 border-b border-gray-100 flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft color="#484848" size={24} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-airbnb-black">Analysis by Text</Text>
                </View>

                <ScrollView className="flex-1 p-6">
                    <Text className="text-airbnb-black mb-4 font-medium">
                        Paste a conversation or describe a situation:
                    </Text>
                    <TextInput
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 text-base text-airbnb-black min-h-[200px]"
                        placeholder="Ex: He said he would call but didn't for 3 days..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        textAlignVertical="top"
                        value={text}
                        onChangeText={setText}
                        autoFocus
                    />
                </ScrollView>

                <View className="p-6 border-t border-gray-100">
                    <Button
                        label={loading ? "Analyzing..." : "Analyze Text"}
                        loading={loading}
                        onPress={() => analyzeText(text)}
                        disabled={text.length < 10}
                        size="lg"
                        className="w-full"
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
