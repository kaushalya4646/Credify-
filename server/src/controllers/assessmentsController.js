const prisma = require("../lib/prisma");

async function getAssessments(req, res) {
  try {
    const assessments = await prisma.assessment.findMany({
      orderBy: { createdAt: "desc" },
      include: { skill: true },
    });
    res.json(assessments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch assessments." });
  }
}

async function getAssessmentById(req, res) {
  try {
    const { id } = req.params;
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        skill: true,
        questions: {
          select: {
            id: true,
            questionText: true,
            options: true,
            // correctAnswer intentionally left out so candidates can't see it
          },
        },
      },
    });

    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found." });
    }

    res.json(assessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch assessment." });
  }
}

async function createAssessment(req, res) {
  try {
    const { skillId, title, difficulty, type } = req.body;

    if (!skillId || !title || !difficulty || !type) {
      return res
        .status(400)
        .json({ error: "skillId, title, difficulty, and type are required." });
    }

    const assessment = await prisma.assessment.create({
      data: { skillId, title, difficulty, type },
    });

    res.status(201).json(assessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create assessment." });
  }
}

async function addQuestion(req, res) {
  try {
    const { id } = req.params;
    const { questionText, options, correctAnswer } = req.body;

    if (!questionText || !correctAnswer) {
      return res
        .status(400)
        .json({ error: "questionText and correctAnswer are required." });
    }

    const question = await prisma.assessmentQuestion.create({
      data: {
        assessmentId: id,
        questionText,
        options,
        correctAnswer,
      },
    });

    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add question." });
  }
}

async function submitAttempt(req, res) {
  try {
    const { id } = req.params; // assessmentId
    const { answers, timeTakenSeconds } = req.body; // answers: [{ questionId, answer }]

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "answers array is required." });
    }

    if (
      timeTakenSeconds !== undefined &&
      timeTakenSeconds !== null &&
      (!Number.isInteger(timeTakenSeconds) || timeTakenSeconds < 0)
    ) {
      return res
        .status(400)
        .json({ error: "timeTakenSeconds must be a non-negative integer." });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found." });
    }

    const { questions } = assessment;
    if (questions.length === 0) {
      return res
        .status(400)
        .json({ error: "This assessment has no questions yet." });
    }

    let correctCount = 0;
    for (const q of questions) {
      const submitted = answers.find((a) => a.questionId === q.id);
      if (submitted && submitted.answer === q.correctAnswer) {
        correctCount++;
      }
    }

    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 70;
    const now = new Date();
    const userId = req.user.userId;

    const skillId = assessment.skillId;

    // Verification is sticky: a pass always (re)verifies, but a failed
    // attempt never downgrades an existing "Verified" status.
    const verificationOps = passed
      ? [
          prisma.skillVerification.upsert({
            where: { userId_skillId: { userId, skillId } },
            create: { userId, skillId, status: "Verified", verifiedAt: now },
            update: { status: "Verified", verifiedAt: now },
          }),
        ]
      : [
          // Create the row if missing, but leave an existing one untouched...
          prisma.skillVerification.upsert({
            where: { userId_skillId: { userId, skillId } },
            create: { userId, skillId, status: "Not Verified", verifiedAt: null },
            update: {},
          }),
          // ...then mark it "Not Verified" only if it isn't already "Verified".
          prisma.skillVerification.updateMany({
            where: { userId, skillId, status: { not: "Verified" } },
            data: { status: "Not Verified", verifiedAt: null },
          }),
        ];

    const [attempt] = await prisma.$transaction([
      prisma.assessmentAttempt.create({
        data: {
          userId,
          assessmentId: id,
          score,
          correctCount,
          totalQuestions,
          timeTakenSeconds: timeTakenSeconds ?? null,
          status: "Completed",
          completedAt: now,
        },
      }),
      ...verificationOps,
    ]);

    res.status(201).json(attempt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not submit attempt." });
  }
}

async function getMyAttempts(req, res) {
  try {
    const attempts = await prisma.assessmentAttempt.findMany({
      where: { userId: req.user.userId },
      include: { assessment: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(attempts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch attempts." });
  }
}

async function getAttemptById(req, res) {
  try {
    const { attemptId } = req.params;
    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: { assessment: { include: { skill: true } } },
    });

    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found." });
    }

    const isOwner = attempt.userId === req.user.userId;
    if (!isOwner && req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "You don't have permission to view this attempt." });
    }

    res.json(attempt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch attempt." });
  }
}

module.exports = {
  getAssessments,
  getAssessmentById,
  createAssessment,
  addQuestion,
  submitAttempt,
  getMyAttempts,
  getAttemptById,
};
