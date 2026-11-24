-- AlterTable
ALTER TABLE "SkillVerification" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill existing rows in UTC. The default above uses the database's local
-- time zone (Asia/Colombo here), which would date existing rows ~5.5 hours in
-- the future. Use verifiedAt where there is one, otherwise the current UTC time.
UPDATE "SkillVerification"
SET "createdAt" = COALESCE("verifiedAt", now() AT TIME ZONE 'UTC'),
    "updatedAt" = COALESCE("verifiedAt", now() AT TIME ZONE 'UTC');
