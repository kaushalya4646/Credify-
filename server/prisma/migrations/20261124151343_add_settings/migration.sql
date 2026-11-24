-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "platformName" TEXT NOT NULL DEFAULT 'Credify',
    "platformDescription" TEXT,
    "defaultLanguage" TEXT NOT NULL DEFAULT 'en-US',
    "allowRegistration" BOOLEAN NOT NULL DEFAULT true,
    "requireEmailVerification" BOOLEAN NOT NULL DEFAULT true,
    "allowRecruiterRegistration" BOOLEAN NOT NULL DEFAULT true,
    "maxAssessmentDurationMinutes" INTEGER NOT NULL DEFAULT 180,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "defaultPassingScore" INTEGER NOT NULL DEFAULT 50,
    "randomizeQuestions" BOOLEAN NOT NULL DEFAULT false,
    "verificationExpiryDays" INTEGER,
    "verificationBadgeMode" TEXT NOT NULL DEFAULT 'Allowed',
    "minScoreForVerification" INTEGER NOT NULL DEFAULT 50,
    "recruiterAccessControl" TEXT NOT NULL DEFAULT 'All candidates',
    "sessionTimeoutMinutes" INTEGER NOT NULL DEFAULT 1440,
    "dataRetentionDays" INTEGER,
    "skillRecommendations" BOOLEAN NOT NULL DEFAULT true,
    "careerRecommendations" BOOLEAN NOT NULL DEFAULT true,
    "candidateMatching" BOOLEAN NOT NULL DEFAULT true,
    "platformDisabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
