import { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react-native';
import { AnalysisResult } from '@/types/analysis';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import ShareCard from '@/components/analyze/ShareCard';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';

export default function ResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const viewShotRef = useRef(null);
    const [sharing, setSharing] = useState(false);

    // Safe parsing of the result
    let data: AnalysisResult | null = null;
    try {
        if (typeof params.data === 'string') {
            data = JSON.parse(params.data);
        }
    } catch (e) {
        console.error("Failed to parse result data");
    }

    if (!data) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text>Error loading results.</Text>
                <Button label="Go Back" onPress={() => router.back()} className="mt-4" />
            </SafeAreaView>
        );
    }

    const handleShare = async () => {
        try {
            setSharing(true);
            const uri = await captureRef(viewShotRef, {
                format: "jpg",
                quality: 0.9,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Share.share({ message: "Check out my RedFlag analysis!", url: uri });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSharing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score <= 3) return "text-green-600";
        if (score <= 6) return "text-yellow-600";
        return "text-red-600";
    };

    const ScoreIcon = data.toxicity.score > 6 ? AlertTriangle : (data.toxicity.score > 3 ? HelpCircle : CheckCircle);
    const scoreColorClass = getScoreColor(data.toxicity.score);
    const score = data.toxicity.score;
    const isToxic = score > 6;

    // Gradient colors based on score
    const gradientColors = isToxic
        ? ['#FF5A5F', '#C41E3A']
        : score > 3
            ? ['#FCD34D', '#F59E0B']
            : ['#34D399', '#059669'];

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 relative">
                {/* Share Card Capture View */}
                <View style={{ position: 'absolute', top: 10000, left: 0 }}>
                    <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
                        <ShareCard
                            score={data.toxicity.score}
                            verdict={data.toxicity.verdict}
                            topFlag={data.red_flags[0]?.type}
                            attachmentStyle={data.attachment_style.primary}
                        />
                    </ViewShot>
                </View>

                <ScrollView className="flex-1">
                    {/* Header */}
                    <View className="px-6 py-4 flex-row justify-between items-center bg-white z-10">
                        <TouchableOpacity onPress={() => router.replace('/')} className="bg-gray-50 p-2 rounded-full">
                            <ArrowLeft color="#222" size={20} />
                        </TouchableOpacity>
                        <Text className="font-bold text-lg text-airbnb-black">Investigation Results</Text>
                        <TouchableOpacity onPress={handleShare} className="bg-gray-50 p-2 rounded-full">
                            <Share2 color="#222" size={20} />
                        </TouchableOpacity>
                    </View>

                    <View className="p-6 gap-6 pb-20">
                        {/* Main Score Card with Gradient */}
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', delay: 100 }}
                        >
                            <LinearGradient
                                colors={['#ffffff', '#ffffff']} // Background wrapper
                                className="rounded-3xl p-1" // border effect
                            >
                                <LinearGradient
                                    colors={gradientColors}
                                    style={{ padding: 32, borderRadius: 24, alignItems: 'center' }}
                                >
                                    <Text className="text-white/80 uppercase text-xs font-bold tracking-[0.2em] mb-4">Toxicity Score</Text>

                                    <View className="flex-row items-baseline mb-6">
                                        <MotiText
                                            from={{ opacity: 0, translateY: 10 }}
                                            animate={{ opacity: 1, translateY: 0 }}
                                            className="text-8xl font-black text-white"
                                        >
                                            {score}
                                        </MotiText>
                                        <Text className="text-3xl font-medium text-white/60">/10</Text>
                                    </View>

                                    <View className="bg-white/20 px-6 py-2 rounded-full backdrop-blur-md border border-white/30 flex-row items-center gap-2">
                                        <Text className="font-bold uppercase text-white tracking-widest text-sm">{data.toxicity.verdict.replace('_', ' ')}</Text>
                                    </View>
                                </LinearGradient>
                            </LinearGradient>
                        </MotiView>

                        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
                            <Text className="text-center text-gray-600 text-lg leading-7 px-4">
                                {data.toxicity.summary}
                            </Text>
                        </MotiView>

                        {/* Analysis Breakdown */}
                        <View className="gap-4">
                            {/* Green Flags */}
                            {data.green_flags && data.green_flags.length > 0 && (
                                <View>
                                    <View className="flex-row items-center gap-2 mb-3">
                                        <Text className="text-xl">💚</Text>
                                        <Text className="font-bold text-xl text-airbnb-black">Green Flags</Text>
                                        <View className="bg-green-100 px-2 py-0.5 rounded-full">
                                            <Text className="text-green-700 font-bold text-xs">{data.green_flags.length}</Text>
                                        </View>
                                    </View>
                                    {data.green_flags.map((flag, index) => (
                                        <MotiView
                                            key={`green-${index}`}
                                            from={{ opacity: 0, translateX: -20 }}
                                            animate={{ opacity: 1, translateX: 0 }}
                                            transition={{ delay: 400 + (index * 100) }}
                                        >
                                            <Card className="mb-3 border-l-4 border-l-green-500 bg-white shadow-sm">
                                                <Text className="font-bold text-green-700 mb-1 uppercase text-xs tracking-wider">{flag.type.replace('_', ' ')}</Text>
                                                <Text className="text-gray-900 font-medium italic mb-2">"{flag.evidence}"</Text>
                                                <Text className="text-gray-500 text-sm leading-5">{flag.explanation}</Text>
                                            </Card>
                                        </MotiView>
                                    ))}
                                </View>
                            )}

                            {/* Red Flags */}
                            <View>
                                <View className="flex-row items-center gap-2 mb-3 mt-2">
                                    <Text className="text-xl">🚩</Text>
                                    <Text className="font-bold text-xl text-airbnb-black">Red Flags</Text>
                                    <View className="bg-red-100 px-2 py-0.5 rounded-full">
                                        <Text className="text-red-700 font-bold text-xs">{data.red_flags.length}</Text>
                                    </View>
                                </View>
                                {data.red_flags.map((flag, index) => (
                                    <MotiView
                                        key={index}
                                        from={{ opacity: 0, translateX: 20 }}
                                        animate={{ opacity: 1, translateX: 0 }}
                                        transition={{ delay: 600 + (index * 100) }}
                                    >
                                        <Card className="mb-3 border-l-4 border-l-red-500 bg-white shadow-sm">
                                            <Text className="font-bold text-red-500 mb-1 uppercase text-xs tracking-wider">{flag.type.replace('_', ' ')}</Text>
                                            <Text className="text-gray-900 font-medium italic mb-2">"{flag.evidence}"</Text>
                                            <Text className="text-gray-500 text-sm leading-5">{flag.explanation}</Text>
                                        </Card>
                                    </MotiView>
                                ))}
                                {data.red_flags.length === 0 && (
                                    <Card className="bg-green-50 border-green-100 p-6 items-center">
                                        <Text className="text-4xl mb-4">🎉</Text>
                                        <Text className="text-green-800 font-bold text-center">Clean sweep! No major red flags detected.</Text>
                                    </Card>
                                )}
                            </View>

                            {/* Attachment Style */}
                            <MotiView
                                from={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 900 }}
                                className="mt-4"
                            >
                                <Text className="font-bold text-xl text-airbnb-black mb-3">Attachment Style</Text>
                                <LinearGradient
                                    colors={['#eff6ff', '#dbeafe']}
                                    className="p-6 rounded-2xl border border-blue-100"
                                >
                                    <Text className="font-black text-blue-900 text-xl mb-2 capitalize tracking-tight">
                                        {data.attachment_style.primary.replace('_', ' ')}
                                    </Text>
                                    <View className="flex-row gap-2 mb-4 flex-wrap">
                                        {data.attachment_style.indicators.map((tag, i) => (
                                            <View key={i} className="bg-white/60 px-2 py-1 rounded text-xs">
                                                <Text className="text-blue-700 text-xs font-medium">{tag}</Text>
                                            </View>
                                        ))}
                                    </View>
                                    <Text className="text-blue-900/80 leading-6 font-medium">
                                        {data.attachment_style.explanation}
                                    </Text>
                                </LinearGradient>
                            </MotiView>
                        </View>

                        <Button
                            label={sharing ? "Preparing Image..." : "Analyze Another"}
                            onPress={() => router.push('/analyze')}
                            disabled={sharing}
                            className="mt-8 shadow-lg shadow-gray-200"
                        />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
