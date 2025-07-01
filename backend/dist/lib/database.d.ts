export type DatabaseProvider = 'postgresql' | 'firestore' | 'dynamodb';
export declare function initializeDatabase(): void;
export declare class DatabaseClient {
    query(sql: string, params?: any[]): Promise<any>;
    insert(table: string, data: Record<string, any>): Promise<any>;
    findById(table: string, id: string): Promise<any>;
    findMany(table: string, where?: Record<string, any>, limit?: number): Promise<any[]>;
    update(table: string, id: string, data: Record<string, any>): Promise<any>;
    delete(table: string, id: string): Promise<void>;
}
export declare const db: DatabaseClient;
//# sourceMappingURL=database.d.ts.map