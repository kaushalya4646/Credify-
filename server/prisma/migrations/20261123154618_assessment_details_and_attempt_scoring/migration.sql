-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "description" TEXT,
ADD COLUMN     "durationMinutes" INTEGER;

-- AlterTable
ALTER TABLE "AssessmentAttempt" ADD COLUMN     "correctCount" INTEGER,
ADD COLUMN     "timeTakenSeconds" INTEGER,
ADD COLUMN     "totalQuestions" INTEGER;
