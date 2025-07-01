import { EmotionService } from '../emotion.service';

// Mock sentiment analysis library
jest.mock('sentiment', () => {
    return jest.fn().mockImplementation(() => ({
        analyze: jest.fn(),
    }));
});

jest.mock('compromise', () => {
    return jest.fn().mockImplementation(() => ({
        match: jest.fn().mockReturnThis(),
        out: jest.fn(),
    }));
});

describe('EmotionService', () => {
    let emotionService: EmotionService;

    beforeEach(() => {
        emotionService = new EmotionService();
        jest.clearAllMocks();
    });

    describe('analyzeContent', () => {
        it('should analyze content and return emotion data', async () => {
            // Arrange
            const content = 'I am feeling overwhelmed and anxious about my startup';

            // Act
            const result = await emotionService.analyzeContent(content);

            // Assert
            expect(result).toHaveProperty('emotions');
            expect(result).toHaveProperty('sentiment');
            expect(result).toHaveProperty('empathyPotential');
            expect(typeof result.sentiment).toBe('number');
            expect(typeof result.empathyPotential).toBe('number');
            expect(result.sentiment).toBeGreaterThanOrEqual(-1);
            expect(result.sentiment).toBeLessThanOrEqual(1);
        });

        it('should detect anxiety-related emotions', async () => {
            // Arrange
            const anxiousContent = 'I am so worried and stressed about everything';

            // Act
            const result = await emotionService.analyzeContent(anxiousContent);

            // Assert
            expect(result.emotions).toHaveProperty('anxiety');
            expect(result.emotions.anxiety).toBeGreaterThan(0);
        });

        it('should detect positive emotions', async () => {
            // Arrange
            const positiveContent = 'I am so happy and grateful for this opportunity';

            // Act
            const result = await emotionService.analyzeContent(positiveContent);

            // Assert
            expect(result.sentiment).toBeGreaterThan(0);
            expect(result.emotions).toHaveProperty('joy');
        });

        it('should calculate empathy potential score', async () => {
            // Arrange
            const vulnerableContent = 'I am struggling with depression and need support';

            // Act
            const result = await emotionService.analyzeContent(vulnerableContent);

            // Assert
            expect(result.empathyPotential).toBeGreaterThan(0.5);
        });
    });

    describe('detectEmotionKeywords', () => {
        it('should detect emotion keywords in text', () => {
            // Arrange
            const content = 'I feel anxious and overwhelmed but also hopeful';

            // Act
            const result = emotionService.detectEmotionKeywords(content);

            // Assert
            expect(result).toHaveProperty('anxiety');
            expect(result).toHaveProperty('overwhelm');
            expect(result).toHaveProperty('hope');
        });
    });

    describe('calculateEmpathyPotential', () => {
        it('should return higher score for vulnerable content', () => {
            // Arrange
            const vulnerableContent = 'I am struggling and need help';
            const casualContent = 'Just had a good day at work';

            // Act
            const vulnerableScore = emotionService.calculateEmpathyPotential(vulnerableContent);
            const casualScore = emotionService.calculateEmpathyPotential(casualContent);

            // Assert
            expect(vulnerableScore).toBeGreaterThan(casualScore);
        });
    });
}); 