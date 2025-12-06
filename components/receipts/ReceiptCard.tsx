
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { AnalysisRow } from '@/types/analysis';
import { ChevronRight, FileText, Mic, Image as ImageIcon } from 'lucide-react-native';

interface ReceiptCardProps {
    analysis: AnalysisRow;
}

export function ReceiptCard({ analysis }: ReceiptCardProps) {
    const router = useRouter();

    const getIcon = () => {
        switch (analysis.input_type) {
            case 'audio': return <Mic size={16} color="#717171" />;
            case 'text': return <FileText size={16} color="#717171" />;
            default: return <ImageIcon size={16} color="#717171" />;
        }
    };

    const isToxic = analysis.toxicity_score > 6;
    const scoreColor = isToxic ? 'text-airbnb-red' : 'text-green-600';

    return (
        <TouchableOpacity
            className="bg-white p-4 rounded-xl border border-gray-100 mb-4 shadow-sm flex-row justify-between items-center"
            activeOpacity={0.7}
            onPress={() => router.push({
                pathname: "/results/[id]",
                params: { id: analysis.id }
            })}
        >
            <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                    {getIcon()}
                    <Text className="text-airbnb-foggy text-xs font-medium uppercase tracking-wider">
                        {format(new Date(analysis.created_at), 'MMM d, yyyy')}
                    </Text>
                </View>

                <View className="flex-row items-center gap-2 flex-wrap mb-1">
                    {analysis.red_flags && analysis.red_flags.length > 0 ? (
                        <Text className="text-airbnb-black font-bold text-base">
                            {analysis.red_flags.length} Red Flags
                        </Text>
                    ) : (
                        <Text className="text-airbnb-black font-bold text-base">
                            All Clear
                        </Text>
                    )}
                </View>

                <Text className="text-airbnb-foggy text-sm" numberOfLines={1}>
                    {analysis.toxicity_verdict.replace(/_/g, ' ')}
                </Text>
            </View>

            <View className="items-center justify-center pl-4">
                <View className={`w-10 h-10 rounded-full items-center justify-center border-2 ${isToxic ? 'border-red-100 bg-red-50' : 'border-green-100 bg-green-50'}`}>
                    <Text className={`font-black text-sm ${scoreColor}`}>
                        {analysis.toxicity_score}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
