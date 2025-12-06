export interface RedFlag {
    type: string;
    evidence: string;
    explanation: string;
}

export interface ToxicityAnalysis {
    score: number;
    verdict: 'healthy' | 'minor_concerns' | 'concerning' | 'likely_toxic' | 'toxic';
    summary: string;
}

export interface AttachmentStyleAnalysis {
    primary: 'secure' | 'anxious_preoccupied' | 'dismissive_avoidant' | 'fearful_avoidant';
    confidence: 'low' | 'medium' | 'high';
    indicators: string[];
    explanation: string;
}

export interface GreenFlag {
    type: string;
    evidence: string;
    explanation: string;
}

export interface AnalysisResult {
    red_flags: RedFlag[];
    green_flags: GreenFlag[];
    toxicity: ToxicityAnalysis;
    attachment_style: AttachmentStyleAnalysis;
}
