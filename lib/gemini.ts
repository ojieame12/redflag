import { supabase } from '@/lib/supabase';
import { AnalysisResult } from '@/types/analysis';

export const analyzeConversation = async (input: string, type: 'image' | 'text' | 'audio' = 'image'): Promise<AnalysisResult> => {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            throw new Error('User must be logged in to analyze.');
        }

        const response = await fetch(
            `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/analyze`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    base64: input,
                    type: type
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Analysis failed on server.');
        }

        const data = await response.json();

        // The edge function returns the full DB row + the result json mixed, or just the result?
        // Looking at my edge function: return new Response(JSON.stringify(savedAnalysis) ...
        // savedAnalysis has snake_case keys like red_flags, green_flags etc.
        // It matches the AnalysisResult interface mostly, but let's be sure.

        return {
            id: data.id,
            red_flags: data.red_flags,
            green_flags: data.green_flags,
            toxicity: {
                score: data.toxicity_score,
                verdict: data.toxicity_verdict,
                summary: data.toxicity_summary
            },
            attachment_style: {
                primary: data.attachment_style,
                confidence: 'medium',
                indicators: [],
                explanation: data.attachment_explanation
            }
        };

    } catch (error) {
        console.error('Analysis failed:', error);
        throw error;
    }
};

const MOCK_RESULT: AnalysisResult = {
    red_flags: [
        {
            type: "love_bombing",
            evidence: "I've never met anyone like you, let's move in together next week",
            explanation: "Excessive intensity and rushing major milestones early in dating."
        }
    ],
    green_flags: [
        {
            type: "openness",
            evidence: "I want to be honest about my feelings",
            explanation: "Willingness to be vulnerable is a good sign."
        }
    ],
    toxicity: {
        score: 6,
        verdict: "concerning",
        summary: "Displays signs of rushing intimacy but no overt abuse yet."
    },
    attachment_style: {
        primary: "anxious_preoccupied",
        confidence: "medium",
        indicators: ["Rushing intimacy"],
        explanation: "User seems to crave immediate closeness to soothe anxiety."
    }
};
