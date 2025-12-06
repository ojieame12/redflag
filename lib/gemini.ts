import { AnalysisResult } from '@/types/analysis';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'INSERT_YOUR_GEMINI_KEY';

const SYSTEM_PROMPT = `You are RedFlag, an expert relationship conversation analyst. 
Analyze conversations for concerning patterns while being balanced and fair. You must detect BOTH toxic "Red Flags" and healthy "Green Flags".

## Your Four Outputs

### 1. RED FLAGS 🚩
Detect these specific patterns:
- Love bombing: Excessive affection/intensity early on
- Future faking: Vague promises about future without concrete plans
- Gaslighting: Denying reality, "you're crazy"
- Breadcrumbing: Inconsistent attention
- Negging: Backhanded compliments
- Stonewalling: Refusing to communicate
- Blame shifting: Always someone else's fault
- Controlling language: "You should", "You need to"

### 2. GREEN FLAGS 💚
Detect healthy patterns:
- Respecting boundaries: "I understand you need space"
- Direct communication: "I feel X when Y happens"
- Accountability: "I'm sorry, I was wrong"
- Empathy: "That must have been hard for you"
- Consistency: Actions matching words
- Support: Encouraging growth/independence

### 3. TOXICITY ASSESSMENT
Score 1-10. Verdicts: "healthy", "minor_concerns", "concerning", "likely_toxic", "toxic"

### 4. ATTACHMENT STYLE
Identify PRIMARY style: Secure, Anxious-Preoccupied, Dismissive-Avoidant, Fearful-Avoidant

## Required JSON Output Format
Return ONLY valid JSON with this exact structure:
{
  "red_flags": [
    {
      "type": "love_bombing",
      "evidence": "exact quote",
      "explanation": "explanation"
    }
  ],
  "green_flags": [
    {
      "type": "empathy",
      "evidence": "exact quote",
      "explanation": "explanation"
    }
  ],
  "toxicity": {
    "score": 7,
    "verdict": "likely_toxic",
    "summary": "overall assessment"
  },
  "attachment_style": {
    "primary": "anxious_preoccupied",
    "confidence": "high",
    "indicators": ["indicator1"],
    "explanation": "breakdown"
  }
}`;

export const analyzeConversation = async (input: string, type: 'image' | 'text' | 'audio' = 'image'): Promise<AnalysisResult> => {
    if (GEMINI_API_KEY === 'INSERT_YOUR_GEMINI_KEY') {
        console.warn('Gemini API Key is missing. Returning mock data.');
        return MOCK_RESULT;
    }

    try {
        let parts;
        if (type === 'image') {
            parts = [
                { text: SYSTEM_PROMPT },
                {
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: input
                    }
                }
            ];
        } else if (type === 'audio') {
            parts = [
                { text: SYSTEM_PROMPT },
                {
                    inline_data: {
                        // Gemini supports audio/mp3, audio/wav, audio/aac, audio/mpeg
                        // Expo AV usually records to m4a (audio/m4a) which is supported
                        mime_type: "audio/m4a",
                        data: input
                    }
                }
            ];
        } else {
            parts = [
                { text: SYSTEM_PROMPT },
                { text: `\n\n## Conversation to analyze:\n${input}` }
            ];
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: parts
                        }
                    ],
                    generationConfig: {
                        temperature: 0.3,
                        topP: 0.8,
                        topK: 40,
                        responseMimeType: "application/json"
                    }
                })
            }
        );

        const data = await response.json();

        if (!data.candidates || !data.candidates[0].content) {
            console.error('Gemini API Error:', JSON.stringify(data, null, 2));
            throw new Error('Failed to get response from Gemini');
        }

        const textResponse = data.candidates[0].content.parts[0].text;
        return JSON.parse(textResponse);

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
