/**
 * Remove SQLite test artifacts before `prisma migrate deploy` (clean slate each run).
 */
const fs = require('fs');
const path = require('path');

const prismaDir = path.join(__dirname, '..', 'prisma');

/** Legacy mistaken path from an earlier `db push` (`prisma/prisma/test.db`). */
const legacyNested = path.join(prismaDir, 'prisma');
if (fs.existsSync(legacyNested)) {
  try {
    fs.rmSync(legacyNested, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

for (const f of ['test.db', 'test.db-journal']) {
  try {
    fs.rmSync(path.join(prismaDir, f), { force: true });
  } catch {
    /* ignore */
  }
}
