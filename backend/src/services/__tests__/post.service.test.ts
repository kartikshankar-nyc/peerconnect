import { PostService } from '../post.service';
import { supabase } from '../../lib/supabase';
import { EmotionService } from '../emotion.service';

// Mock Supabase and EmotionService
jest.mock('../../lib/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            insert: jest.fn(),
            select: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            eq: jest.fn(),
            order: jest.fn(),
            limit: jest.fn(),
            single: jest.fn(),
        })),
    },
}));

jest.mock('../emotion.service');

const mockSupabase = supabase as jest.Mocked<typeof supabase>;
const mockEmotionService = EmotionService as jest.MockedClass<typeof EmotionService>;

describe('PostService', () => {
    let postService: PostService;
    let emotionService: jest.Mocked<EmotionService>;

    beforeEach(() => {
        emotionService = new mockEmotionService() as jest.Mocked<EmotionService>;
        postService = new PostService(emotionService);
        jest.clearAllMocks();
    });

    describe('createPost', () => {
        it('should create a new post with emotion detection', async () => {
            // Arrange
            const postData = {
                content: 'Feeling overwhelmed with my startup journey',
                authorId: 'user-123',
                communityId: 'community-456',
                isAnonymous: true,
            };

            const mockEmotionAnalysis = {
                emotions: { overwhelm: 0.8, anxiety: 0.6 },
                sentiment: -0.3,
                empathyPotential: 0.7,
            };

            const mockCreatedPost = {
                id: 'post-123',
                content: postData.content,
                author_id: postData.authorId,
                community_id: postData.communityId,
                is_anonymous: postData.isAnonymous,
                is_diary: false,
                detected_emotions: mockEmotionAnalysis.emotions,
                sentiment_score: mockEmotionAnalysis.sentiment,
                empathy_potential_score: mockEmotionAnalysis.empathyPotential,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                reaction_count: 0,
                support_score: 0.0,
            };

            emotionService.analyzeContent.mockResolvedValue(mockEmotionAnalysis);

            const mockInsert = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: mockCreatedPost,
                        error: null,
                    }),
                }),
            });

            (mockSupabase.from as jest.Mock).mockReturnValue({
                insert: mockInsert,
            });

            // Act
            const result = await postService.createPost(postData);

            // Assert
            expect(result).toEqual(mockCreatedPost);
            expect(emotionService.analyzeContent).toHaveBeenCalledWith(postData.content);
            expect(mockSupabase.from).toHaveBeenCalledWith('posts');
            expect(mockInsert).toHaveBeenCalledWith({
                content: postData.content,
                author_id: postData.authorId,
                community_id: postData.communityId,
                is_anonymous: postData.isAnonymous,
                is_diary: false,
                detected_emotions: mockEmotionAnalysis.emotions,
                sentiment_score: mockEmotionAnalysis.sentiment,
                empathy_potential_score: mockEmotionAnalysis.empathyPotential,
            });
        });

        it('should create diary post when specified', async () => {
            // Arrange
            const postData = {
                content: 'Private thoughts about my struggles',
                authorId: 'user-123',
                isDiary: true,
            };

            const mockEmotionAnalysis = {
                emotions: { sadness: 0.7 },
                sentiment: -0.5,
                empathyPotential: 0.3,
            };

            emotionService.analyzeContent.mockResolvedValue(mockEmotionAnalysis);

            const mockInsert = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: { id: 'post-diary-123' },
                        error: null,
                    }),
                }),
            });

            (mockSupabase.from as jest.Mock).mockReturnValue({
                insert: mockInsert,
            });

            // Act
            await postService.createPost(postData);

            // Assert
            expect(mockInsert).toHaveBeenCalledWith(
                expect.objectContaining({
                    is_diary: true,
                    community_id: null, // Diary posts don't belong to communities
                })
            );
        });
    });

    describe('getPostById', () => {
        it('should return post when found', async () => {
            // Arrange
            const mockPost = {
                id: 'post-123',
                content: 'Test content',
                author_id: 'user-123',
                created_at: new Date().toISOString(),
            };

            const mockSelect = jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: mockPost,
                        error: null,
                    }),
                }),
            });

            (mockSupabase.from as jest.Mock).mockReturnValue({
                select: mockSelect,
            });

            // Act
            const result = await postService.getPostById('post-123');

            // Assert
            expect(result).toEqual(mockPost);
            expect(mockSupabase.from).toHaveBeenCalledWith('posts');
        });
    });

    describe('getFeedPosts', () => {
        it('should return paginated posts for community feed', async () => {
            // Arrange
            const mockPosts = [
                { id: 'post-1', content: 'Post 1' },
                { id: 'post-2', content: 'Post 2' },
            ];

            const mockSelect = jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    order: jest.fn().mockReturnValue({
                        limit: jest.fn().mockResolvedValue({
                            data: mockPosts,
                            error: null,
                        }),
                    }),
                }),
            });

            (mockSupabase.from as jest.Mock).mockReturnValue({
                select: mockSelect,
            });

            // Act
            const result = await postService.getFeedPosts('community-123', 10, 0);

            // Assert
            expect(result).toEqual(mockPosts);
            expect(mockSupabase.from).toHaveBeenCalledWith('posts');
        });
    });
}); 