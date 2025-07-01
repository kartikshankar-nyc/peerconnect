import { UserService } from '../user.service';
import { supabase } from '../../lib/supabase';

// Mock Supabase
jest.mock('../../lib/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            insert: jest.fn(),
            select: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            eq: jest.fn(),
            single: jest.fn(),
        })),
    },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
        jest.clearAllMocks();
    });

    describe('createAnonymousUser', () => {
        it('should create a new anonymous user with generated ID', async () => {
            // Arrange
            const mockUser = {
                id: 'user-123',
                anonymous_id: 'anon-456',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                preferences: {},
                interaction_score: 0.0,
                empathy_score: 0.0,
                last_active_at: new Date().toISOString(),
            };

            const mockInsert = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: mockUser,
                        error: null,
                    }),
                }),
            });

            (mockSupabase.from as jest.Mock).mockReturnValue({
                insert: mockInsert,
            });

            // Act
            const result = await userService.createAnonymousUser();

            // Assert
            expect(result).toEqual(mockUser);
            expect(mockSupabase.from).toHaveBeenCalledWith('users');
            expect(mockInsert).toHaveBeenCalledWith({
                anonymous_id: expect.stringMatching(/^anon_/),
            });
        });

        it('should handle database errors gracefully', async () => {
            // Arrange
            const mockInsert = jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: null,
                        error: { message: 'Database connection failed' },
                    }),
                }),
            });

            (mockSupabase.from as jest.Mock).mockReturnValue({
                insert: mockInsert,
            });

            // Act & Assert
            await expect(userService.createAnonymousUser()).rejects.toThrow(
                'Database connection failed'
            );
        });
    });

    describe('getUserById', () => {
        it('should return user when found', async () => {
            // Arrange
            const mockUser = {
                id: 'user-123',
                anonymous_id: 'anon-456',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                preferences: {},
                interaction_score: 0.0,
                empathy_score: 0.0,
                last_active_at: new Date().toISOString(),
            };

            const mockSelect = jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: mockUser,
                        error: null,
                    }),
                }),
            });

            (mockSupabase.from as jest.Mock).mockReturnValue({
                select: mockSelect,
            });

            // Act
            const result = await userService.getUserById('user-123');

            // Assert
            expect(result).toEqual(mockUser);
            expect(mockSupabase.from).toHaveBeenCalledWith('users');
            expect(mockSelect).toHaveBeenCalledWith('*');
        });

        it('should return null when user not found', async () => {
            // Arrange
            const mockSelect = jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: null,
                        error: { code: 'PGRST116' }, // Supabase "no rows" error
                    }),
                }),
            });

            (mockSupabase.from as jest.Mock).mockReturnValue({
                select: mockSelect,
            });

            // Act
            const result = await userService.getUserById('non-existent');

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('updateUserPreferences', () => {
        it('should update user preferences', async () => {
            // Arrange
            const preferences = { theme: 'dark', notifications: true };
            const mockUpdatedUser = {
                id: 'user-123',
                anonymous_id: 'anon-456',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                preferences,
                interaction_score: 0.0,
                empathy_score: 0.0,
                last_active_at: new Date().toISOString(),
            };

            const mockUpdate = jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({
                            data: mockUpdatedUser,
                            error: null,
                        }),
                    }),
                }),
            });

            (mockSupabase.from as jest.Mock).mockReturnValue({
                update: mockUpdate,
            });

            // Act
            const result = await userService.updateUserPreferences('user-123', preferences);

            // Assert
            expect(result).toEqual(mockUpdatedUser);
            expect(mockSupabase.from).toHaveBeenCalledWith('users');
            expect(mockUpdate).toHaveBeenCalledWith({ preferences });
        });
    });
}); 