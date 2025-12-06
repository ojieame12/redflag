
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { useSubscription } from '@/hooks/useSubscription';

export default function PaywallScreen() {
    const router = useRouter();
    const { isPremium } = useSubscription();

    // If already premium, go back or show success
    if (isPremium) {
        router.back();
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <RevenueCatUI.Paywall
                onDismiss={() => router.back()}
                onPurchaseCompleted={({ customerInfo }) => {
                    const isNowPremium = customerInfo.entitlements.active['REDFLAG Pro'];
                    if (isNowPremium) {
                        router.back();
                    }
                }}
                onRestoreCompleted={({ customerInfo }) => {
                    const isNowPremium = customerInfo.entitlements.active['REDFLAG Pro'];
                    if (isNowPremium) {
                        Alert.alert("Purchases Restored", "Your subscription has been restored.");
                        router.back();
                    } else {
                        Alert.alert("No Subscription", "No active subscription found to restore.");
                    }
                }}
            />
        </View>
    );
}
