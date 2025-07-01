import { Pool } from 'pg';
import admin from 'firebase-admin';

// Database provider type
export type DatabaseProvider = 'postgresql' | 'firestore' | 'dynamodb';

// PostgreSQL connection
let pgPool: Pool | null = null;

// Firestore connection
let firestoreDb: FirebaseFirestore.Firestore | null = null;

// Initialize based on environment
const DB_PROVIDER = (process.env.DB_PROVIDER || 'postgresql') as DatabaseProvider;

export function initializeDatabase() {
    switch (DB_PROVIDER) {
        case 'postgresql':
            initializePostgreSQL();
            break;
        case 'firestore':
            initializeFirestore();
            break;
        case 'dynamodb':
            // DynamoDB initialization would go here
            break;
        default:
            throw new Error(`Unsupported database provider: ${DB_PROVIDER}`);
    }
}

function initializePostgreSQL() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is required for PostgreSQL');
    }

    pgPool = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
}

function initializeFirestore() {
    if (!admin.apps.length) {
        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
        if (!projectId) {
            throw new Error('GOOGLE_CLOUD_PROJECT_ID is required for Firestore');
        }

        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId,
        });
    }

    firestoreDb = admin.firestore();
}

// Database abstraction layer
export class DatabaseClient {
    async query(sql: string, params?: any[]): Promise<any> {
        switch (DB_PROVIDER) {
            case 'postgresql':
                if (!pgPool) throw new Error('PostgreSQL not initialized');
                const result = await pgPool.query(sql, params);
                return result.rows;

            case 'firestore':
                // Convert SQL-like operations to Firestore operations
                throw new Error('Firestore query conversion not implemented');

            default:
                throw new Error(`Query not supported for ${DB_PROVIDER}`);
        }
    }

    async insert(table: string, data: Record<string, any>): Promise<any> {
        switch (DB_PROVIDER) {
            case 'postgresql':
                const columns = Object.keys(data).join(', ');
                const values = Object.values(data);
                const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

                const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
                const result = await this.query(sql, values);
                return result[0];

            case 'firestore':
                if (!firestoreDb) throw new Error('Firestore not initialized');
                const docRef = await firestoreDb.collection(table).add(data);
                const doc = await docRef.get();
                return { id: doc.id, ...doc.data() };

            default:
                throw new Error(`Insert not supported for ${DB_PROVIDER}`);
        }
    }

    async findById(table: string, id: string): Promise<any> {
        switch (DB_PROVIDER) {
            case 'postgresql':
                const result = await this.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
                return result[0] || null;

            case 'firestore':
                if (!firestoreDb) throw new Error('Firestore not initialized');
                const doc = await firestoreDb.collection(table).doc(id).get();
                return doc.exists ? { id: doc.id, ...doc.data() } : null;

            default:
                throw new Error(`FindById not supported for ${DB_PROVIDER}`);
        }
    }

    async findMany(table: string, where?: Record<string, any>, limit?: number): Promise<any[]> {
        switch (DB_PROVIDER) {
            case 'postgresql':
                let sql = `SELECT * FROM ${table}`;
                const params: any[] = [];

                if (where) {
                    const conditions = Object.keys(where).map((key, i) => `${key} = $${i + 1}`);
                    sql += ` WHERE ${conditions.join(' AND ')}`;
                    params.push(...Object.values(where));
                }

                if (limit) {
                    sql += ` LIMIT ${limit}`;
                }

                return await this.query(sql, params);

            case 'firestore':
                if (!firestoreDb) throw new Error('Firestore not initialized');
                let query = firestoreDb.collection(table);

                if (where) {
                    Object.entries(where).forEach(([key, value]) => {
                        query = query.where(key, '==', value);
                    });
                }

                if (limit) {
                    query = query.limit(limit);
                }

                const snapshot = await query.get();
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            default:
                throw new Error(`FindMany not supported for ${DB_PROVIDER}`);
        }
    }

    async update(table: string, id: string, data: Record<string, any>): Promise<any> {
        switch (DB_PROVIDER) {
            case 'postgresql':
                const columns = Object.keys(data);
                const values = Object.values(data);
                const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');

                const sql = `UPDATE ${table} SET ${setClause} WHERE id = $1 RETURNING *`;
                const result = await this.query(sql, [id, ...values]);
                return result[0];

            case 'firestore':
                if (!firestoreDb) throw new Error('Firestore not initialized');
                await firestoreDb.collection(table).doc(id).update(data);
                const doc = await firestoreDb.collection(table).doc(id).get();
                return { id: doc.id, ...doc.data() };

            default:
                throw new Error(`Update not supported for ${DB_PROVIDER}`);
        }
    }

    async delete(table: string, id: string): Promise<void> {
        switch (DB_PROVIDER) {
            case 'postgresql':
                await this.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
                break;

            case 'firestore':
                if (!firestoreDb) throw new Error('Firestore not initialized');
                await firestoreDb.collection(table).doc(id).delete();
                break;

            default:
                throw new Error(`Delete not supported for ${DB_PROVIDER}`);
        }
    }
}

// Export singleton instance
export const db = new DatabaseClient(); 