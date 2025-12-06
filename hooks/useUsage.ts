
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from './useSubscription';

const MAX_FREE_ANALYSES = 5;

export function useUsage() {
    const [usageCount, setUsageCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const { session } = useAuth();
    const { isPremium } = useSubscription();

    useEffect(() => {
        if (session) {
            loadUsage();
        }
    }, [session]);

    const loadUsage = async () => {
        if (!session?.user) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('free_analyses_used')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error fetching usage:', error);
                // Fallback or retry logic could go here
                return;
            }

            if (data) {
                setUsageCount(data.free_analyses_used || 0);
            }
        } catch (e) {
            console.error('Failed to load usage', e);
        } finally {
            setLoading(false);
        }
    };

    const incrementUsage = async () => {
        if (isPremium) return;
        if (!session?.user) return;

        try {
            // Optimistic update
            const newCount = usageCount + 1;
            setUsageCount(newCount);

            // DB Update
            const { error } = await supabase.rpc('increment_usage', {
                user_id: session.user.id
            });

            // If RPC doesn't exist yet, fallback to update (less safe for concurrency but fine for MVP)
            if (error) {
                await supabase
                    .from('profiles')
                    .update({ free_analyses_used: newCount })
                    .eq('id', session.user.id);
            }

        } catch (e) {
            console.error('Failed to increment usage', e);
            // Revert optimistic update?
        }
    };

    const remainingAnalyses = isPremium ? 999 : Math.max(0, MAX_FREE_ANALYSES - usageCount);
    const hasAccess = isPremium || usageCount < MAX_FREE_ANALYSES;

    return {
        usageCount,
        remainingAnalyses,
        hasAccess,
        incrementUsage,
        loading,
        isPremium
    };
}
