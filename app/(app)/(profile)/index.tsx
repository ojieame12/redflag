
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, Settings, LogOut, ChevronRight, Shield, FileText, Trash2, Mail } from 'lucide-react-native';
import RevenueCatUI from 'react-native-purchases-ui';

export default function ProfileScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const { isPremium } = useSubscription();

    const handleSignOut = async () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                    await supabase.auth.signOut();
                }
            }
        ]);
    };

    const handleManageSubscription = async () => {
        if (isPremium) {
            // Use RevenueCat Customer Center if available or fallback
            try {
                await RevenueCatUI.presentCustomerCenter();
            } catch (e) {
                console.log("Customer Center not available, opening settings");
                // Fallback to OS settings if Customer Center fails or isn't configured
                Linking.openSettings();
            }
        } else {
            router.push('/paywall');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="px-6 py-8 pb-6 border-b border-gray-100">
                    <Text className="text-3xl font-bold text-airbnb-black mb-1">Profile</Text>
                    <Text className="text-airbnb-foggy text-lg">{session?.user?.email}</Text>
                </View>

                {/* Subscription Card */}
                <View className="px-6 mt-6 mb-8">
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={handleManageSubscription}
                        className={`p-6 rounded-2xl border ${isPremium ? 'bg-airbnb-black border-airbnb-black' : 'bg-white border-gray-200 shadow-sm'}`}
                    >
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className={`font-bold text-lg ${isPremium ? 'text-white' : 'text-airbnb-black'}`}>
                                    {isPremium ? 'RedFlag Pro Member' : 'Free Plan'}
                                </Text>
                                <Text className={`${isPremium ? 'text-gray-400' : 'text-airbnb-foggy'} mt-1`}>
                                    {isPremium ? 'Unlimited access active' : '5 free analyses per week'}
                                </Text>
                            </View>
                            <View className={`w-10 h-10 rounded-full items-center justify-center ${isPremium ? 'bg-gray-800' : 'bg-yellow-100'}`}>
                                <Crown size={20} color={isPremium ? '#FFD700' : '#F59E0B'} />
                            </View>
                        </View>

                        <View className={`py-3 px-4 rounded-xl items-center ${isPremium ? 'bg-gray-800' : 'bg-airbnb-red'}`}>
                            <Text className={`font-bold ${isPremium ? 'text-white' : 'text-white'}`}>
                                {isPremium ? 'Manage Subscription' : 'Upgrade to Pro'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Settings Actions */}
                <View className="px-6 gap-6">
                    <Text className="font-bold text-airbnb-black text-xl mb-2">Settings</Text>

                    <SettingItem
                        icon={<Shield size={20} color="#484848" />}
                        label="Privacy Policy"
                        onPress={() => Linking.openURL('https://example.com/privacy')}
                    />
                    <SettingItem
                        icon={<FileText size={20} color="#484848" />}
                        label="Terms of Service"
                        onPress={() => Linking.openURL('https://example.com/terms')}
                    />
                    <SettingItem
                        icon={<Mail size={20} color="#484848" />}
                        label="Support"
                        onPress={() => Linking.openURL('mailto:support@redflag.app')}
                    />
                    <SettingItem
                        icon={<LogOut size={20} color="#FF5A5F" />}
                        label="Sign Out"
                        onPress={handleSignOut}
                        textColor="text-airbnb-red"
                        hideChevron
                    />

                    {/* Danger Zone */}
                    <View className="mt-8 mb-10 pt-8 border-t border-gray-100">
                        <TouchableOpacity className="flex-row items-center gap-3 opacity-50">
                            <Trash2 size={20} color="#484848" />
                            <Text className="text-airbnb-black font-medium text-base">Delete Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

function SettingItem({ icon, label, onPress, textColor = "text-airbnb-black", hideChevron = false }: any) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-between py-2"
        >
            <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center">
                    {icon}
                </View>
                <Text className={`font-medium text-lg ${textColor}`}>{label}</Text>
            </View>
            {!hideChevron && <ChevronRight size={20} color="#B0B0B0" />}
        </TouchableOpacity>
    );
}
