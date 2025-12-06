
import { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { ReceiptCard } from '@/components/receipts/ReceiptCard';
import { AnalysisRow } from '@/types/analysis';
import { useFocusEffect } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';

export default function ReceiptsScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const [receipts, setReceipts] = useState<AnalysisRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReceipts = async () => {
        if (!session?.user) return;

        try {
            const { data, error } = await supabase
                .from('analyses')
                .select('*')
                .eq('user_id', session.user.id)
                .eq('is_saved', true) // Only show "saved" receipts? Or all history? Let's show "is_saved" ones as "Receipts"
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReceipts(data as any);
        } catch (e) {
            console.error('Error fetching receipts:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchReceipts();
        }, [session])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchReceipts();
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-3xl font-bold text-airbnb-black">Receipts</Text>
                <Text className="text-airbnb-foggy text-base mt-1">Your evidence locker 📁</Text>
            </View>

            <ScrollView
                className="flex-1 px-6 pt-6"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF5A5F" />}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Empty State */}
                {!loading && receipts.length === 0 && (
                    <View className="items-center justify-center mt-20">
                        <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-6">
                            <Text className="text-4xl">📭</Text>
                        </View>
                        <Text className="text-xl font-bold text-airbnb-black mb-2">No receipts yet</Text>
                        <Text className="text-airbnb-foggy text-center px-8 mb-8 leading-6">
                            Analyses you mark as "Saved" will appear here. Build your evidence folder.
                        </Text>
                        <Button
                            label="Start New Analysis"
                            onPress={() => router.push('/analyze')}
                            className="w-full"
                        />
                    </View>
                )}

                {/* List */}
                {receipts.map((receipt) => (
                    <ReceiptCard key={receipt.id} analysis={receipt} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
