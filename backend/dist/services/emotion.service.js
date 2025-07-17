"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmotionService = void 0;
class EmotionService {
    constructor() {
        this.emotionKeywords = {
            // Core emotional states
            joy: {
                keywords: ['happy', 'excited', 'thrilled', 'elated', 'cheerful', 'delighted', 'amazing', 'wonderful', 'fantastic', 'brilliant'],
                weight: 1.0,
                supportType: 'solidarity'
            },
            hope: {
                keywords: ['hope', 'optimistic', 'confident', 'positive', 'encouraged', 'uplifting', 'bright', 'promising', 'looking forward', 'better tomorrow'],
                weight: 1.0,
                supportType: 'energy'
            },
            gratitude: {
                keywords: ['grateful', 'thankful', 'blessed', 'appreciate', 'thanks', 'lucky', 'fortunate', 'gift'],
                weight: 0.9,
                supportType: 'solidarity'
            },
            relief: {
                keywords: ['relief', 'better', 'calm', 'peaceful', 'relaxed', 'easier', 'lighter', 'breathe'],
                weight: 0.8,
                supportType: 'comfort'
            },
            sadness: {
                keywords: ['sad', 'down', 'blue', 'depressed', 'melancholy', 'grief', 'crying', 'tears', 'heartbroken', 'sorrow'],
                weight: 1.0,
                supportType: 'comfort'
            },
            anxiety: {
                keywords: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'fear', 'terrified', 'scared', 'trembling', 'racing heart'],
                weight: 1.2,
                supportType: 'comfort'
            },
            loneliness: {
                keywords: ['lonely', 'alone', 'isolated', 'disconnected', 'empty', 'nobody', 'abandoned', 'forgotten'],
                weight: 1.3,
                supportType: 'solidarity'
            },
            frustration: {
                keywords: ['frustrated', 'angry', 'annoyed', 'irritated', 'upset', 'mad', 'furious', 'rage'],
                weight: 1.0,
                supportType: 'clarity'
            },
            overwhelm: {
                keywords: ['overwhelmed', 'too much', 'crushing', 'drowning', 'exhausted', 'burned out', 'can\'t cope'],
                weight: 1.2,
                supportType: 'comfort'
            },
            confusion: {
                keywords: ['confused', 'lost', 'unclear', 'uncertain', 'puzzled', 'don\'t understand', 'mixed up'],
                weight: 0.9,
                supportType: 'clarity'
            },
            shame: {
                keywords: ['ashamed', 'embarrassed', 'guilty', 'worthless', 'failure', 'stupid', 'pathetic'],
                weight: 1.1,
                supportType: 'comfort'
            },
            anger: {
                keywords: ['angry', 'furious', 'rage', 'mad', 'pissed', 'livid', 'outraged'],
                weight: 1.0,
                supportType: 'clarity'
            },
            curiosity: {
                keywords: ['curious', 'wondering', 'interested', 'intrigued', 'fascinated'],
                weight: 0.7,
                supportType: 'clarity'
            },
            acceptance: {
                keywords: ['accept', 'peace', 'okay', 'fine', 'settled', 'at peace', 'coming to terms'],
                weight: 0.8,
                supportType: 'solidarity'
            },
            determination: {
                keywords: ['determined', 'strong', 'persevere', 'fight', 'overcome', 'resilient', 'won\'t give up'],
                weight: 0.9,
                supportType: 'energy'
            }
        };
        this.crisisKeywords = [
            'kill myself', 'end it all', 'suicide', 'don\'t want to live', 'better off dead',
            'hurt myself', 'self harm', 'cutting', 'overdose', 'jump off',
            'no point', 'give up', 'can\'t go on', 'end the pain'
        ];
        this.progressKeywords = [
            'getting better', 'improving', 'progress', 'breakthrough', 'healing',
            'stronger', 'growing', 'learning', 'overcoming', 'recovery',
            'milestone', 'achievement', 'proud', 'accomplished'
        ];
        this.contextIndicators = {
            sharing: ['want to share', 'happened to me', 'my story', 'experience', 'went through'],
            seeking: ['need help', 'advice', 'what should', 'how do', 'anyone else', 'suggestions'],
            reflecting: ['thinking about', 'realized', 'looking back', 'understand', 'learning'],
            celebrating: ['proud', 'achieved', 'accomplished', 'milestone', 'success', 'breakthrough']
        };
    }
    async analyzeContent(content) {
        return this.analyzeEmotion(content);
    }
    async analyzeEmotion(content) {
        const text = content.toLowerCase();
        const emotions = {};
        const detectedSupportTypes = [];
        // Enhanced emotion detection with context awareness
        for (const [emotion, config] of Object.entries(this.emotionKeywords)) {
            let score = 0;
            let contextMultiplier = 1.0;
            // Basic keyword matching
            for (const keyword of config.keywords) {
                if (text.includes(keyword)) {
                    score += 0.15 * config.weight;
                }
            }
            // Context-aware scoring
            const sentences = text.split(/[.!?]+/);
            for (const sentence of sentences) {
                if (config.keywords.some(keyword => sentence.includes(keyword))) {
                    // Boost score for emotional intensity words
                    if (sentence.includes('very') || sentence.includes('extremely') || sentence.includes('really')) {
                        contextMultiplier += 0.3;
                    }
                    // Boost for personal pronouns (more personal = higher emotion)
                    if (sentence.includes(' i ') || sentence.includes('my ') || sentence.includes('me ')) {
                        contextMultiplier += 0.2;
                    }
                }
            }
            if (score > 0) {
                emotions[emotion] = Math.min(score * contextMultiplier, 1.0);
                detectedSupportTypes.push(config.supportType);
            }
        }
        // Determine primary and secondary emotions
        const sortedEmotions = Object.entries(emotions)
            .sort(([, a], [, b]) => b - a);
        const primaryEmotion = sortedEmotions.length > 0 ? sortedEmotions[0][0] : 'neutral';
        const secondaryEmotions = sortedEmotions
            .slice(1, 4)
            .filter(([, score]) => score > 0.3)
            .map(([emotion]) => emotion);
        // Determine support type needed
        const supportTypeCounts = detectedSupportTypes.reduce((acc, type) => {
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        const supportType = Object.entries(supportTypeCounts)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || 'comfort';
        // Crisis detection
        const crisisIndicators = this.crisisKeywords.filter(keyword => text.includes(keyword));
        // Progress detection
        const progressIndicators = this.progressKeywords.filter(keyword => text.includes(keyword));
        // Context detection
        let context = 'sharing';
        let maxContextScore = 0;
        for (const [contextType, indicators] of Object.entries(this.contextIndicators)) {
            const score = indicators.filter(indicator => text.includes(indicator)).length;
            if (score > maxContextScore) {
                maxContextScore = score;
                context = contextType;
            }
        }
        // Calculate enhanced empathy potential
        const vulnerabilityWords = [
            'help', 'struggling', 'alone', 'scared', 'lost', 'overwhelmed',
            'don\'t know', 'confused', 'worried', 'anxious', 'depressed',
            'lonely', 'isolated', 'empty', 'hopeless', 'stuck', 'broken',
            'can\'t handle', 'falling apart', 'desperate'
        ];
        let empathyScore = 0.2; // Lower base score
        // Vulnerability indicators
        for (const word of vulnerabilityWords) {
            if (text.includes(word)) {
                empathyScore += 0.08;
            }
        }
        // Question indicators (help-seeking)
        const questionCount = (text.match(/\?/g) || []).length;
        empathyScore += questionCount * 0.1;
        // Personal sharing indicators
        const personalPronouns = ['i ', 'my ', 'me ', 'myself'].filter(pronoun => text.includes(pronoun)).length;
        empathyScore += personalPronouns * 0.05;
        // Crisis situations get maximum empathy
        if (crisisIndicators.length > 0) {
            empathyScore = 0.95;
        }
        const empathyPotentialScore = Math.min(empathyScore, 0.95);
        // Calculate emotional complexity
        const emotionalComplexity = Object.keys(emotions).length / 10; // Normalize to 0-1
        // Calculate intensity
        const maxScore = Math.max(...Object.values(emotions));
        const intensity = maxScore || 0.3; // Lower default intensity
        return {
            emotions,
            primaryEmotion,
            secondaryEmotions,
            empathyPotentialScore,
            intensity,
            supportType,
            crisisIndicators,
            progressIndicators,
            context,
            emotionalComplexity
        };
    }
    async storeEmotionalPattern(userId, analysis) {
        // Store emotional pattern for future analysis and personalization
        const pattern = {
            userId,
            timestamp: new Date(),
            emotions: analysis.emotions,
            primaryEmotion: analysis.primaryEmotion,
            intensity: analysis.intensity,
            context: analysis.context
        };
        // In a real implementation, this would store to database
        console.log(`Storing emotional pattern for user ${userId}:`, pattern);
    }
    async getUserEmotionalHistory(userId, days = 30) {
        // Retrieve user's emotional patterns for trend analysis
        // This would query the database in a real implementation
        console.log(`Retrieving emotional history for user ${userId} for last ${days} days`);
        return [];
    }
    async getEmotionalTrends(userId) {
        // Analyze emotional trends for insights and progress tracking
        const history = await this.getUserEmotionalHistory(userId);
        // This would contain sophisticated trend analysis in a real implementation
        return {
            dominantEmotions: ['anxiety', 'hope'],
            improvedEmotions: ['sadness'],
            concerningPatterns: [],
            progressScore: 0.7
        };
    }
    async updateUserEmpathyScore(userId, postAnalysis) {
        // Enhanced empathy score calculation
        await this.storeEmotionalPattern(userId, postAnalysis);
        console.log(`Updated empathy score for user ${userId} based on enhanced analysis`);
    }
    async findSimilarEmotionalStates(analysis, limit = 10) {
        // Find posts with similar emotional profiles for matching
        // This would use vector similarity search in a real implementation
        console.log(`Finding similar emotional states for matching algorithm`);
        return [];
    }
}
exports.EmotionService = EmotionService;
//# sourceMappingURL=emotion.service.js.map