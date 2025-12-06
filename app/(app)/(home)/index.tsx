```
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useUsage } from '@/hooks/useUsage';

export default function HomeScreen() {
    const router = useRouter();
    const { remainingAnalyses } = useUsage();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="px-6 py-8" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <MotiView 
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 700 }}
                    className="mb-8"
                >
                    <Text className="text-airbnb-red font-black text-4xl mb-2 tracking-tighter">RedFlag 🚩</Text>
                    <Text className="text-airbnb-foggy text-lg font-medium">
                        Spot the signs. <Text className="text-airbnb-black font-bold">Get the receipts.</Text>
                    </Text>
                </MotiView>

                {/* Main Action */}
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', delay: 200 }}
                >
                    <TouchableOpacity 
                        activeOpacity={0.9}
                        onPress={() => router.push('/analyze')}
                    >
                         <LinearGradient
                            colors={['#FF5A5F', '#FF385C']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="p-8 rounded-3xl mb-8 shadow-xl shadow-red-200"
                        >
                            <View className="bg-white/20 w-16 h-16 rounded-2xl items-center justify-center mb-4 backdrop-blur-lg">
                                <Text className="text-4xl">🔍</Text>
                            </View>
                            <Text className="text-3xl font-black text-white mb-2 tracking-tight">
                                Analyze Chat
                            </Text>
                            <Text className="text-white/90 text-lg font-medium mb-6 leading-6">
                                Upload screenshots or audio to detect toxic patterns instantly.
                            </Text>
                            <View className="bg-white px-6 py-3 rounded-full self-start">
                                <Text className="text-airbnb-red font-bold text-lg">Start Analysis →</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </MotiView>

                {/* Quiz Entry Point */}
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', delay: 400 }}
                >
                    <TouchableOpacity 
                        onPress={() => router.push('/quiz')}
                        activeOpacity={0.8}
                        className="mb-8 bg-blue-50 p-6 rounded-3xl border border-blue-100 flex-row items-center justify-between"
                    >
                        <View className="flex-1 mr-4">
                            <Text className="font-bold text-xl text-blue-900 mb-1">Attachment Style?</Text>
                            <Text className="text-blue-700 font-medium leading-5">Take the viral 2-min test to find your pattern.</Text>
                        </View>
                        <View className="bg-white w-14 h-14 rounded-full items-center justify-center shadow-sm">
                            <Text className="text-2xl">🧩</Text>
                        </View>
                    </TouchableOpacity>
                </MotiView>

                {/* Stats / Free Tier */}
                <View className="flex-row justify-between items-center mb-8 px-2">
                    <Text className="font-medium text-gray-400 uppercase text-xs tracking-widest">Daily Limit</Text>
                    <View className="flex-row items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <View className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <Text className="font-bold text-gray-700 text-sm">{remainingAnalyses} remaining</Text>
                    </View>
                </View>

                {/* Recent Tips */}
                <Text className="font-bold text-xl text-airbnb-black mb-4">Daily Tea 🍵</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-4 pb-8">
                    <Card className="w-72 h-40 justify-center mr-4 bg-gray-900 border-0 p-6">
                        <Text className="font-bold text-white text-xl mb-2">Love Bombing 💣</Text>
                        <Text className="text-gray-300 leading-5">
                            "Too much, too soon" is a red flag. Real love takes time to build.
                        </Text>
                    </Card>
                    <Card className="w-72 h-40 justify-center mr-4 bg-white border-gray-200 p-6">
                        <Text className="font-bold text-airbnb-black text-xl mb-2">Gaslighting 🕯️</Text>
                        <Text className="text-gray-500 leading-5">
                            When they deny your reality to make you question your own sanity.
                        </Text>
                    </Card>
                </ScrollView>

            </ScrollView>
        </SafeAreaView>
    );
}
