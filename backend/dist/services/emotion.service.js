"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmotionService = void 0;
class EmotionService {
    constructor() {
        this.emotionKeywords = {
            joy: ['happy', 'excited', 'thrilled', 'elated', 'cheerful', 'delighted'],
            hope: ['hope', 'optimistic', 'confident', 'positive', 'encouraged', 'uplifting'],
            gratitude: ['grateful', 'thankful', 'blessed', 'appreciate', 'thanks'],
            relief: ['relief', 'better', 'calm', 'peaceful', 'relaxed'],
            sadness: ['sad', 'down', 'blue', 'depressed', 'melancholy', 'grief'],
            anxiety: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'fear'],
            loneliness: ['lonely', 'alone', 'isolated', 'disconnected', 'empty'],
            frustration: ['frustrated', 'angry', 'annoyed', 'irritated', 'upset'],
            overwhelm: ['overwhelmed', 'too much', 'crushing', 'drowning', 'exhausted'],
            confusion: ['confused', 'lost', 'unclear', 'uncertain', 'puzzled'],
            curiosity: ['curious', 'wondering', 'interested', 'intrigued'],
            acceptance: ['accept', 'peace', 'okay', 'fine', 'settled'],
            determination: ['determined', 'strong', 'persevere', 'fight', 'overcome']
        };
    }
    async analyzeContent(content) {
        return this.analyzeEmotion(content);
    }
    async analyzeEmotion(content) {
        const text = content.toLowerCase();
        const emotions = {};
        // Calculate emotion scores based on keyword presence
        for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
            let score = 0;
            for (const keyword of keywords) {
                if (text.includes(keyword)) {
                    score += 0.2; // Each keyword adds 20% intensity
                }
            }
            if (score > 0) {
                emotions[emotion] = Math.min(score, 1.0); // Cap at 100%
            }
        }
        // Find primary emotion (highest score)
        let primaryEmotion = 'neutral';
        let maxScore = 0;
        for (const [emotion, score] of Object.entries(emotions)) {
            if (score > maxScore) {
                maxScore = score;
                primaryEmotion = emotion;
            }
        }
        // Calculate empathy potential based on vulnerability indicators
        const vulnerabilityWords = [
            'help', 'struggling', 'alone', 'scared', 'lost', 'overwhelmed',
            'don\'t know', 'confused', 'worried', 'anxious', 'depressed',
            'lonely', 'isolated', 'empty', 'hopeless', 'stuck'
        ];
        let empathyScore = 0.3; // Base empathy potential
        for (const word of vulnerabilityWords) {
            if (text.includes(word)) {
                empathyScore += 0.1;
            }
        }
        // Boost empathy score for questions and help-seeking language
        if (text.includes('?') || text.includes('how do') || text.includes('what should')) {
            empathyScore += 0.2;
        }
        const empathyPotentialScore = Math.min(empathyScore, 0.95);
        const intensity = maxScore || 0.5; // Default intensity if no emotions detected
        return {
            emotions,
            primaryEmotion,
            empathyPotentialScore,
            intensity
        };
    }
    async updateUserEmpathyScore(userId, postAnalysis) {
        // Demo implementation - in real app this would update the database
        console.log(`Demo: Updated empathy score for user ${userId} based on post analysis`);
    }
}
exports.EmotionService = EmotionService;
//# sourceMappingURL=emotion.service.js.map