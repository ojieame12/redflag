import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { analyzeConversation } from '@/lib/gemini';
import { AnalysisResult } from '@/types/analysis';
import { useRouter } from 'expo-router';
import { useUsage } from './useUsage';

export function useAnalysis() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const { hasAccess, incrementUsage } = useUsage();

    const checkAccess = () => {
        if (!hasAccess) {
            Alert.alert(
                "Free Limit Reached",
                "You've used all 5 free analyses. Upgrade to Premium for unlimited access!",
                [{ text: "Upgrade", onPress: () => router.push('/paywall') }, { text: "Cancel", style: "cancel" }]
            );
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        if (!checkAccess()) return;

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.5,
            base64: true,
        });

        if (!pickerResult.canceled && pickerResult.assets[0].base64) {
            handleAnalysis(pickerResult.assets[0].base64, 'image');
        }
    };

    const analyzeText = async (text: string) => {
        if (!checkAccess()) return;
        if (text.length < 10) {
            Alert.alert("Too short", "Please paste at least a sentence or two for analysis.");
            return;
        }
        await handleAnalysis(text, 'text');
    };

    const analyzeAudio = async (base64Audio: string) => {
        if (!checkAccess()) return;
        try {
            await handleAnalysis(base64Audio, 'audio');
        } catch (e) {
            console.error(e);
            Alert.alert("Audio Error", "Could not analyze audio.");
        }
    };

    const handleAnalysis = async (input: string, type: 'image' | 'text' | 'audio') => {
        setLoading(true);
        try {
            const data = await analyzeConversation(input, type);
            setResult(data);
            await incrementUsage();

            router.push({
                pathname: "/results/[id]",
                params: { id: 'latest', data: JSON.stringify(data) }
            });
        } catch (error) {
            Alert.alert("Analysis Failed", "Could not analyze the conversation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return {
        pickImage,
        analyzeText,
        analyzeAudio,
        loading,
        result
    };
}
