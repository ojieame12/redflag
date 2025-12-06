import { View, Text, Image } from 'react-native';
import { clsx } from 'clsx';

interface ShareCardProps {
    score: number;
    verdict: string;
    topFlag?: string; // e.g. "Gaslighting"
    attachmentStyle: string;
}

export default function ShareCard({ score, verdict, topFlag, attachmentStyle }: ShareCardProps) {
    const getScoreColor = (s: number) => {
        if (s <= 3) return "bg-green-100 border-green-500 text-green-800";
        if (s <= 6) return "bg-yellow-100 border-yellow-500 text-yellow-800";
        return "bg-red-100 border-red-500 text-red-800";
    };

    const colorClass = getScoreColor(score);

    return (
        <View className="bg-white p-6 w-[350px] aspect-[9/16] justify-between border-8 border-black">
            {/* Header */}
            <View>
                <Text className="text-4xl font-black text-black mb-2">RED FLAG REPORT 🚩</Text>
                <View className="h-1 bg-black w-full" />
            </View>

            {/* Main Stats */}
            <View className="items-center">
                <Text className="font-bold text-xl uppercase tracking-widest mb-4">Toxicity Score</Text>

                <View className={clsx("w-48 h-48 rounded-full items-center justify-center border-8 mb-6", colorClass.split(' ')[1])}>
                    <Text className={clsx("text-8xl font-black", colorClass.split(' ')[2])}>{score}</Text>
                </View>

                <View className={clsx("px-4 py-2 border-2", colorClass)}>
                    <Text className="text-2xl font-black uppercase text-center">{verdict}</Text>
                </View>
            </View>

            {/* Details */}
            <View className="gap-4">
                {topFlag && (
                    <View className="bg-black p-4 -rotate-1">
                        <Text className="text-white font-bold uppercase text-xs">Primary Detection</Text>
                        <Text className="text-white text-2xl font-black uppercase">{topFlag}</Text>
                    </View>
                )}

                <View className="border-4 border-black p-4 rotate-1 bg-blue-100">
                    <Text className="font-bold uppercase text-xs">Attachment Style</Text>
                    <Text className="text-xl font-bold uppercase text-blue-900">{attachmentStyle}</Text>
                </View>
            </View>

            {/* Footer */}
            <View className="items-center mt-8">
                <Text className="font-medium text-gray-500">Get the receipts at</Text>
                <Text className="font-black text-2xl">redflag.app</Text>
            </View>
        </View>
    );
}
