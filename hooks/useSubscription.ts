
import { useState, useEffect } from 'react';
import Purchases from 'react-native-purchases';
import { checkPremiumAccess, initializePurchases } from '@/lib/revenuecat';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export function useSubscription() {
    const { session } = useAuth();
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        init();
    }, [session]);

    const init = async () => {
        // Initialize with User ID if logged in
        await initializePurchases(session?.user?.id);

        // Check initial status
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            const premiumContext = checkPremiumAccess(customerInfo);
            setIsPremium(premiumContext);

            // Sync to Supabase just in case
            if (session?.user) {
                await syncSubscriptionStatus(premiumContext);
            }
        } catch (e) {
            console.error("Failed to fetch customer info", e);
        } finally {
            setLoading(false);
        }

        // Listen for updates
        Purchases.addCustomerInfoUpdateListener((info) => {
            const premiumContext = checkPremiumAccess(info);
            setIsPremium(premiumContext);
            if (session?.user) {
                syncSubscriptionStatus(premiumContext);
            }
        });
    };

    const syncSubscriptionStatus = async (status: boolean) => {
        if (!session?.user) return;
        await supabase
            .from('profiles')
            .update({ is_premium: status })
            .eq('id', session.user.id);
    };

    return {
        isPremium,
        loading
    };
}
