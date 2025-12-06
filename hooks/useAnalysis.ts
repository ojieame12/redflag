
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { analyzeConversation } from '@/lib/gemini';
import { AnalysisResult } from '@/types/analysis';
import { useRouter } from 'expo-router';
import { useUsage } from './useUsage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export function useAnalysis() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { hasAccess, incrementUsage } = useUsage();
    const { session } = useAuth();

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

    const handleAnalysis = async (input: string, inputType: 'image' | 'text' | 'audio') => {
        setLoading(true);
        try {
            // 1. Get Analysis from Gemini
            const data = await analyzeConversation(input, inputType);

            // 2. Increment Usage Limit
            await incrementUsage();

            // 3. Save to Supabase (if user is logged in)
            let analysisId = 'latest';
            if (session?.user) {
                const { data: insertedData, error } = await supabase
                    .from('analyses')
                    .insert({
                        user_id: session.user.id,
                        input_type: 'screenshot', // simplified for now, or map 'image' -> 'screenshot'
                        red_flags: data.red_flags,
                        green_flags: data.green_flags,
                        toxicity_score: data.toxicity.score,
                        toxicity_verdict: data.toxicity.verdict,
                        toxicity_summary: data.toxicity.summary,
                        attachment_style: data.attachment_style.primary,
                        attachment_explanation: data.attachment_style.explanation,
                        is_saved: false // Not "Receipts" yet, just history
                    })
                    .select()
                    .single();

                if (error) {
                    console.error("Failed to save analysis:", error);
                    // We continue anyway so the user sees the result
                } else if (insertedData) {
                    analysisId = insertedData.id;
                }
            }

            // 4. Navigate to Results
            router.push({
                pathname: "/results/[id]",
                params: {
                    id: analysisId,
                    // Pass data as fallback so we don't have to fetch immediately if we just have it
                    data: JSON.stringify(data)
                }
            });

        } catch (error) {
            console.error(error);
            Alert.alert("Analysis Failed", "Could not analyze the conversation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return {
        pickImage,
        analyzeText,
        analyzeAudio,
        loading
    };
}
