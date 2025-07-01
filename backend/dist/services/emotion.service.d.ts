export interface EmotionAnalysis {
    emotions: {
        [emotion: string]: number;
    };
    primaryEmotion: string;
    empathyPotentialScore: number;
    intensity: number;
}
export declare class EmotionService {
    private emotionKeywords;
    analyzeContent(content: string): Promise<EmotionAnalysis>;
    analyzeEmotion(content: string): Promise<EmotionAnalysis>;
    updateUserEmpathyScore(userId: string, postAnalysis: EmotionAnalysis): Promise<void>;
}
//# sourceMappingURL=emotion.service.d.ts.map