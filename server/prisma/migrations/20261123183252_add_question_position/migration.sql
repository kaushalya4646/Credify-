-- AlterTable
ALTER TABLE "AssessmentQuestion" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- Backfill: number existing questions 1..n within each assessment, in their
-- current physical (roughly insertion) order, so they don't all tie at 0.
UPDATE "AssessmentQuestion" AS q
SET "position" = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "assessmentId" ORDER BY ctid) AS rn
  FROM "AssessmentQuestion"
) AS sub
WHERE q.id = sub.id;
