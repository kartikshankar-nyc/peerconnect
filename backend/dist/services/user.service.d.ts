import { Database } from '../types/database.types';
type User = Database['public']['Tables']['users']['Row'];
export declare class UserService {
    createAnonymousUser(): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    getUserByAnonymousId(anonymousId: string): Promise<User | null>;
    updateUserPreferences(id: string, preferences: any): Promise<User>;
    updateLastActive(id: string): Promise<void>;
    updateUserScores(id: string, interactionScore?: number, empathyScore?: number): Promise<User>;
    deleteUser(id: string): Promise<void>;
}
export {};
//# sourceMappingURL=user.service.d.ts.map