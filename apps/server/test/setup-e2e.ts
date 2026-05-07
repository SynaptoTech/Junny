import { join } from 'path';

/**
 * SQLite dedicado aos testes de integração (não versionar o ficheiro gerado).
 */
const dbPath = join(__dirname, '..', 'prisma', 'test.db');
process.env.DATABASE_URL = `file:${dbPath}`;
process.env.PORT = process.env.PORT ?? '19999';
