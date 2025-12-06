import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases';
import RevenueCatService from '@/lib/revenuecat';

export function useSubscription() {
    const [isPremium, setIsPremium] = useState(false);
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            // In Expo Go, this likely fails or warns. We catch it.
            await RevenueCatService.init();

            const info = await RevenueCatService.getCustomerInfo();
            if (info) checkEntitlement(info);

            const offerings = await RevenueCatService.getOfferings();
            if (offerings && offerings.availablePackages) {
                setPackages(offerings.availablePackages);
            }
        } catch (e) {
            console.log("RevenueCat init failed (likely Expo Go)", e);
        } finally {
            setLoading(false);
        }
    };

    const checkEntitlement = (info: CustomerInfo) => {
        if (info.entitlements.active['pro']) { // 'pro' is the entitlement ID
            setIsPremium(true);
        }
    };

    const purchasePackage = async (pack: PurchasesPackage) => {
        setLoading(true);
        try {
            const info = await RevenueCatService.purchasePackage(pack);
            checkEntitlement(info);
            return true;
        } catch (e: any) {
            if (!e.userCancelled) {
                Alert.alert("Error", e.message);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const restorePurchases = async () => {
        setLoading(true);
        try {
            const info = await Purchases.restorePurchases();
            checkEntitlement(info);
            if (!info.entitlements.active['pro']) {
                Alert.alert("No Subscriptions", "We couldn't find any active subscriptions to restore.");
            } else {
                Alert.alert("Success", "Your subscription has been restored!");
            }
        } catch (e: any) {
            Alert.alert("Error", e.message);
        } finally {
            setLoading(false);
        }
    };

    // MOCK FUNCTION FOR EXPO GO TESTING
    const mockPurchase = () => {
        setIsPremium(true);
        Alert.alert("Dev Mode", "Mock purchase successful! You are now Premium.");
    };

    return {
        isPremium,
        packages,
        loading,
        purchasePackage,
        restorePurchases,
        mockPurchase
    };
}
