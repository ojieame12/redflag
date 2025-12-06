import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useSubscription } from './useSubscription';

const USAGE_KEY = 'redflag_usage_count';
const MAX_FREE_ANALYSES = 5;

export function useUsage() {
    const [usageCount, setUsageCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const { isPremium } = useSubscription();

    useEffect(() => {
        loadUsage();
    }, []);

    const loadUsage = async () => {
        try {
            const stored = await SecureStore.getItemAsync(USAGE_KEY);
            if (stored) {
                setUsageCount(parseInt(stored, 10));
            }
        } catch (e) {
            console.error('Failed to load usage', e);
        } finally {
            setLoading(false);
        }
    };

    const incrementUsage = async () => {
        if (isPremium) return; // Premium API calls don't count towards limit
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        await SecureStore.setItemAsync(USAGE_KEY, newCount.toString());
    };

    const resetUsage = async () => {
        setUsageCount(0);
        await SecureStore.setItemAsync(USAGE_KEY, '0');
    }

    // If premium, infinite free analyses. If not, 5 - usage.
    const remainingAnalyses = isPremium ? 999 : Math.max(0, MAX_FREE_ANALYSES - usageCount);
    const hasAccess = isPremium || usageCount < MAX_FREE_ANALYSES;

    return {
        usageCount,
        remainingAnalyses,
        hasAccess,
        incrementUsage,
        resetUsage,
        loading,
        isPremium
    };
}
