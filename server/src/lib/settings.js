const prisma = require("./prisma");

// Platform settings live in a single row (id "singleton"). Many requests read
// them (auth, registration, attempts...), so the row is cached in memory and
// the cache is cleared whenever settings are saved. The short TTL covers edits
// made outside this process (e.g. directly in the database).
const SINGLETON_ID = "singleton";
const CACHE_MS = 5000;
let cached = null;
let cachedAt = 0;

// Returns the settings row, creating it with defaults the first time.
async function getSettings() {
  if (cached && Date.now() - cachedAt < CACHE_MS) return cached;
  cached = await prisma.settings.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID },
    update: {},
  });
  cachedAt = Date.now();
  return cached;
}

async function updateSettings(data) {
  await getSettings(); // make sure the row exists
  cached = await prisma.settings.update({ where: { id: SINGLETON_ID }, data });
  cachedAt = Date.now();
  return cached;
}

module.exports = { getSettings, updateSettings };
