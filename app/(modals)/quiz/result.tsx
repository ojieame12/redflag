import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import ShareCard from '@/components/analyze/ShareCard';

const DESCRIPTIONS: Record<string, string> = {
    secure: "You are comfortable with intimacy and independence. You communicate needs clearly and usually trust your partner.",
    anxious: "You often crave closeness and worry about rejection. You may overthink texts and need consistent reassurance.",
    dismissive: "You prize independence and may see emotions as a weakness. You create distance when things get too serious.",
    fearful: "You want closeness but fear being hurt. Relationships feel like a rollercoaster of pulling close and pushing away."
};

export default function QuizResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const style = params.style as string;
    const viewShotRef = useRef(null);
    const [sharing, setSharing] = useState(false);

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
                Share.share({ message: `I'm ${style} attachment style! Check yours: redflag.app`, url: uri });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSharing(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Hidden ViewShot */}
            <View style={{ position: 'absolute', top: 10000, left: 0 }}>
                <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
                    <ShareCard
                        score={style === 'secure' ? 1 : 8}
                        verdict="Attachment"
                        topFlag={style?.toUpperCase()} // Show Style as top flag
                        attachmentStyle={style}
                    />
                </ViewShot>
            </View>

            <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.replace('/')}>
                    <ArrowLeft color="#484848" size={24} />
                </TouchableOpacity>
                <Text className="font-bold text-lg text-airbnb-black">Your Style</Text>
                <TouchableOpacity onPress={handleShare}>
                    <Share2 color="#484848" size={24} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 50 }}>
                <Text className="text-center text-airbnb-foggy text-lg uppercase tracking-widest mb-4">You are</Text>
                <Text className="text-center text-5xl font-black text-airbnb-black mb-6 uppercase leading-[60px]">
                    {style?.replace('_', ' ')}
                </Text>

                <View className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8">
                    <Text className="text-blue-900 text-lg leading-7 text-center">
                        {DESCRIPTIONS[style] || "Unknown style."}
                    </Text>
                </View>

                <View className="bg-gray-50 p-6 rounded-2xl mb-8">
                    <Text className="font-bold text-xl mb-2 text-center">Is this affecting your chats?</Text>
                    <Text className="text-center text-gray-500 mb-6">
                        Anxious styles often attract avoidants. Upload a screenshot to see if your patterns are showing up.
                    </Text>

                    <Button
                        label="Analyze a Conversation Now"
                        onPress={() => router.push('/analyze')}
                    />
                </View>

                <Button
                    label={sharing ? "Generating..." : "Share My Result"}
                    variant="secondary"
                    onPress={handleShare}
                    disabled={sharing}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
