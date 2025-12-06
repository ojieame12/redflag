import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { useSubscription } from '@/hooks/useSubscription';

export default function PaywallScreen() {
    const router = useRouter();
    const { isPremium, purchasePackage, restorePurchases, packages, loading, mockPurchase } = useSubscription();

    const handlePurchase = async (pack: any) => {
        const success = await purchasePackage(pack);
        if (success) {
            router.back();
        }
    };

    const features = [
        "Unlimited Relationship Analysis",
        "Deep pattern detection (Love Bombing, Gaslighting)",
        "Voice Note Analysis (Coming Soon)",
        "Attachment Style Breakdown",
        "Priority AI Processing"
    ];

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1">
                {/* Header Image Area Placeholder */}
                <View className="h-64 bg-airbnb-red items-center justify-center mb-6">
                    <Text className="text-6xl">🔓</Text>
                    <Text className="text-white text-2xl font-bold mt-4">Unlock Everything</Text>
                </View>

                {/* Close Button */}
                <TouchableOpacity
                    className="absolute top-12 right-6 bg-white/20 p-2 rounded-full"
                    onPress={() => router.back()}
                >
                    <X color="white" size={24} />
                </TouchableOpacity>

                <View className="px-8">
                    <Text className="text-3xl font-bold text-center text-airbnb-black mb-2">
                        Go Premium
                    </Text>
                    <Text className="text-center text-airbnb-foggy mb-8 text-lg">
                        Don't let red flags fly under the radar.
                    </Text>

                    {/* Feature List */}
                    <View className="gap-4 mb-10">
                        {features.map((feat, i) => (
                            <View key={i} className="flex-row items-center gap-4">
                                <View className="bg-green-100 p-1 rounded-full">
                                    <Check size={16} color="green" />
                                </View>
                                <Text className="text-lg text-airbnb-black font-medium">{feat}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Pricing Options */}
                    {loading ? (
                        <ActivityIndicator size="large" color="#FF5A5F" />
                    ) : (
                        <View className="gap-4">
                            {/* Dev Mode Mock Button */}
                            <TouchableOpacity
                                onPress={mockPurchase}
                                className="bg-gray-100 p-4 rounded-xl border border-gray-200"
                            >
                                <Text className="text-center font-bold text-gray-500">
                                    [DEV] Mock Purchase (Free)
                                </Text>
                            </TouchableOpacity>

                            {/* Real Packages */}
                            {packages.map((pack) => (
                                <TouchableOpacity
                                    key={pack.identifier}
                                    onPress={() => handlePurchase(pack)}
                                    className="bg-white border-2 border-airbnb-red p-4 rounded-xl shadow-sm"
                                >
                                    <Text className="text-center font-bold text-airbnb-red text-xl">
                                        {pack.product.priceString} / {pack.packageType.toLowerCase()}
                                    </Text>
                                    <Text className="text-center text-gray-500 text-xs mt-1">
                                        Cancel anytime via App Store
                                    </Text>
                                </TouchableOpacity>
                            ))}

                            {packages.length === 0 && (
                                <View className="p-4 bg-yellow-50 rounded-xl">
                                    <Text className="text-yellow-800 text-center">
                                        No products found. (Did you replace the API Key?)
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    <TouchableOpacity onPress={restorePurchases} className="mt-6 mb-8">
                        <Text className="text-center text-airbnb-foggy font-medium">
                            Restore Purchases
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
