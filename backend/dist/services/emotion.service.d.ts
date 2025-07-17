export interface EmotionAnalysis {
    emotions: {
        [emotion: string]: number;
    };
    primaryEmotion: string;
    secondaryEmotions: string[];
    empathyPotentialScore: number;
    intensity: number;
    supportType: 'comfort' | 'energy' | 'clarity' | 'solidarity';
    crisisIndicators: string[];
    progressIndicators: string[];
    context: 'sharing' | 'seeking' | 'reflecting' | 'celebrating';
    emotionalComplexity: number;
}
export interface EmotionalPattern {
    userId: string;
    timestamp: Date;
    emotions: {
        [emotion: string]: number;
    };
    primaryEmotion: string;
    intensity: number;
    context: string;
}
export declare class EmotionService {
    private emotionKeywords;
    private crisisKeywords;
    private progressKeywords;
    private contextIndicators;
    analyzeContent(content: string): Promise<EmotionAnalysis>;
    analyzeEmotion(content: string): Promise<EmotionAnalysis>;
    storeEmotionalPattern(userId: string, analysis: EmotionAnalysis): Promise<void>;
    getUserEmotionalHistory(userId: string, days?: number): Promise<EmotionalPattern[]>;
    getEmotionalTrends(userId: string): Promise<{
        dominantEmotions: string[];
        improvedEmotions: string[];
        concerningPatterns: string[];
        progressScore: number;
    }>;
    updateUserEmpathyScore(userId: string, postAnalysis: EmotionAnalysis): Promise<void>;
    findSimilarEmotionalStates(analysis: EmotionAnalysis, limit?: number): Promise<string[]>;
}
//# sourceMappingURL=emotion.service.d.ts.map