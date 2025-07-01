"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.DatabaseClient = void 0;
exports.initializeDatabase = initializeDatabase;
const pg_1 = require("pg");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// PostgreSQL connection
let pgPool = null;
// Firestore connection
let firestoreDb = null;
// Initialize based on environment
const DB_PROVIDER = (process.env.DB_PROVIDER || 'postgresql');
function initializeDatabase() {
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
    pgPool = new pg_1.Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
}
function initializeFirestore() {
    if (!firebase_admin_1.default.apps.length) {
        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
        if (!projectId) {
            throw new Error('GOOGLE_CLOUD_PROJECT_ID is required for Firestore');
        }
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.applicationDefault(),
            projectId,
        });
    }
    firestoreDb = firebase_admin_1.default.firestore();
}
// Database abstraction layer
class DatabaseClient {
    async query(sql, params) {
        switch (DB_PROVIDER) {
            case 'postgresql':
                if (!pgPool)
                    throw new Error('PostgreSQL not initialized');
                const result = await pgPool.query(sql, params);
                return result.rows;
            case 'firestore':
                // Convert SQL-like operations to Firestore operations
                throw new Error('Firestore query conversion not implemented');
            default:
                throw new Error(`Query not supported for ${DB_PROVIDER}`);
        }
    }
    async insert(table, data) {
        switch (DB_PROVIDER) {
            case 'postgresql':
                const columns = Object.keys(data).join(', ');
                const values = Object.values(data);
                const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
                const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
                const result = await this.query(sql, values);
                return result[0];
            case 'firestore':
                if (!firestoreDb)
                    throw new Error('Firestore not initialized');
                const docRef = await firestoreDb.collection(table).add(data);
                const doc = await docRef.get();
                return { id: doc.id, ...doc.data() };
            default:
                throw new Error(`Insert not supported for ${DB_PROVIDER}`);
        }
    }
    async findById(table, id) {
        switch (DB_PROVIDER) {
            case 'postgresql':
                const result = await this.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
                return result[0] || null;
            case 'firestore':
                if (!firestoreDb)
                    throw new Error('Firestore not initialized');
                const doc = await firestoreDb.collection(table).doc(id).get();
                return doc.exists ? { id: doc.id, ...doc.data() } : null;
            default:
                throw new Error(`FindById not supported for ${DB_PROVIDER}`);
        }
    }
    async findMany(table, where, limit) {
        switch (DB_PROVIDER) {
            case 'postgresql':
                let sql = `SELECT * FROM ${table}`;
                const params = [];
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
                if (!firestoreDb)
                    throw new Error('Firestore not initialized');
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
    async update(table, id, data) {
        switch (DB_PROVIDER) {
            case 'postgresql':
                const columns = Object.keys(data);
                const values = Object.values(data);
                const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');
                const sql = `UPDATE ${table} SET ${setClause} WHERE id = $1 RETURNING *`;
                const result = await this.query(sql, [id, ...values]);
                return result[0];
            case 'firestore':
                if (!firestoreDb)
                    throw new Error('Firestore not initialized');
                await firestoreDb.collection(table).doc(id).update(data);
                const doc = await firestoreDb.collection(table).doc(id).get();
                return { id: doc.id, ...doc.data() };
            default:
                throw new Error(`Update not supported for ${DB_PROVIDER}`);
        }
    }
    async delete(table, id) {
        switch (DB_PROVIDER) {
            case 'postgresql':
                await this.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
                break;
            case 'firestore':
                if (!firestoreDb)
                    throw new Error('Firestore not initialized');
                await firestoreDb.collection(table).doc(id).delete();
                break;
            default:
                throw new Error(`Delete not supported for ${DB_PROVIDER}`);
        }
    }
}
exports.DatabaseClient = DatabaseClient;
// Export singleton instance
exports.db = new DatabaseClient();
//# sourceMappingURL=database.js.map