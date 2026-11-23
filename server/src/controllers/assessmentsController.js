const prisma = require("../lib/prisma");
const { Prisma } = require("@prisma/client");

const VALID_STATUSES = ["Active", "Draft", "Inactive"];

// Validates the optional numeric fields shared by create and update.
// Returns an error message, or null if everything provided is valid.
function validateNumbers({ passingScore, durationMinutes }) {
  if (
    passingScore !== undefined &&
    (!Number.isInteger(passingScore) || passingScore < 0 || passingScore > 100)
  ) {
    return "passingScore must be a whole number from 0 to 100.";
  }
  if (
    durationMinutes !== undefined &&
    durationMinutes !== null &&
    (!Number.isInteger(durationMinutes) || durationMinutes <= 0)
  ) {
    return "durationMinutes must be a positive whole number (or null).";
  }
  return null;
}

async function getAssessments(req, res) {
  try {
    const isAdmin = req.user.role === "ADMIN";

    // Candidates and recruiters never see Draft/Inactive assessments.
    const assessments = await prisma.assessment.findMany({
      where: isAdmin ? {} : { status: "Active" },
      orderBy: { createdAt: "desc" },
      include: {
        skill: true,
        _count: {
          select: { questions: true, ...(isAdmin ? { attempts: true } : {}) },
        },
      },
    });

    if (!isAdmin) {
      return res.json(assessments);
    }

    // Average score over completed attempts only, per assessment.
    const averages = await prisma.assessmentAttempt.groupBy({
      by: ["assessmentId"],
      where: { status: "Completed", score: { not: null } },
      _avg: { score: true },
    });
    const avgById = new Map(
      averages.map((a) => [a.assessmentId, a._avg.score]),
    );

    res.json(
      assessments.map((a) => {
        const avg = avgById.get(a.id);
        return {
          ...a,
          attemptsCount: a._count.attempts,
          // null (not 0 or NaN) until someone completes it.
          avgScore: avg == null ? null : Math.round(avg),
        };
      }),
    );
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
            type: true,
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
    const { skillId, title, difficulty, type, passingScore, status } =
      req.body;

    if (!skillId || !title || !difficulty || !type) {
      return res
        .status(400)
        .json({ error: "skillId, title, difficulty, and type are required." });
    }

    const numberError = validateNumbers({ passingScore });
    if (numberError) {
      return res.status(400).json({ error: numberError });
    }
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return res
        .status(400)
        .json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}.` });
    }

    // New assessments start as Draft: they're created before any questions exist.
    const assessment = await prisma.assessment.create({
      data: {
        skillId,
        title,
        difficulty,
        type,
        passingScore: passingScore ?? 70,
        status: status ?? "Draft",
      },
    });

    res.status(201).json(assessment);
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(400).json({ error: "skillId does not match an existing skill." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not create assessment." });
  }
}

const QUESTION_TYPES = ["MCQ", "Short answer", "Long answer"];

// Validates a question's final shape. `q` holds the values the question would
// have after the change. Returns an error message, or null if valid.
function validateQuestion(q) {
  if (typeof q.questionText !== "string" || !q.questionText.trim()) {
    return "questionText is required.";
  }
  if (!QUESTION_TYPES.includes(q.type)) {
    return `type must be one of: ${QUESTION_TYPES.join(", ")}.`;
  }
  if (q.type === "MCQ") {
    const ok =
      Array.isArray(q.options) &&
      q.options.length >= 2 &&
      q.options.every((o) => typeof o === "string" && o.trim());
    if (!ok) {
      return "MCQ questions need options: a list of at least two non-empty strings.";
    }
    if (typeof q.correctAnswer !== "string" || !q.options.includes(q.correctAnswer)) {
      return "MCQ questions need a correctAnswer that exactly matches one of the options.";
    }
  } else if (q.options != null || q.correctAnswer != null) {
    return `${q.type} questions can't have options or a correctAnswer.`;
  }
  return null;
}

// Prisma needs Prisma.DbNull (not plain null) to clear a Json column.
function questionData(q) {
  const isMcq = q.type === "MCQ";
  return {
    questionText: q.questionText.trim(),
    type: q.type,
    options: isMcq ? q.options : Prisma.DbNull,
    correctAnswer: isMcq ? q.correctAnswer : null,
  };
}

async function addQuestion(req, res) {
  try {
    const { id } = req.params;
    const q = {
      questionText: req.body.questionText,
      type: req.body.type ?? "MCQ",
      options: req.body.options ?? null,
      correctAnswer: req.body.correctAnswer ?? null,
    };

    const error = validateQuestion(q);
    if (error) {
      return res.status(400).json({ error });
    }

    const question = await prisma.assessmentQuestion.create({
      data: { assessmentId: id, ...questionData(q) },
    });

    res.status(201).json(question);
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(404).json({ error: "Assessment not found." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not add question." });
  }
}

async function updateQuestion(req, res) {
  try {
    const { id, questionId } = req.params;
    const existing = await prisma.assessmentQuestion.findFirst({
      where: { id: questionId, assessmentId: id },
    });
    if (!existing) {
      return res.status(404).json({ error: "Question not found." });
    }

    const { questionText, type, options, correctAnswer } = req.body;
    if ([questionText, type, options, correctAnswer].every((v) => v === undefined)) {
      return res.status(400).json({
        error: "Provide at least one of: questionText, type, options, correctAnswer.",
      });
    }

    // Validate the question as it will look after the update. Switching to a
    // free-text type clears any options/correctAnswer not sent in the body.
    const nextType = type ?? existing.type;
    const keepMcqFields = nextType === "MCQ";
    const q = {
      questionText: questionText ?? existing.questionText,
      type: nextType,
      options: options !== undefined ? options : keepMcqFields ? existing.options : null,
      correctAnswer:
        correctAnswer !== undefined
          ? correctAnswer
          : keepMcqFields
            ? existing.correctAnswer
            : null,
    };

    const error = validateQuestion(q);
    if (error) {
      return res.status(400).json({ error });
    }

    const question = await prisma.assessmentQuestion.update({
      where: { id: questionId },
      data: questionData(q),
    });

    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update question." });
  }
}

async function deleteQuestion(req, res) {
  try {
    const { id, questionId } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const question = await tx.assessmentQuestion.findFirst({
        where: { id: questionId, assessmentId: id },
        include: {
          _count: { select: { answers: true } },
          assessment: {
            select: { status: true, _count: { select: { questions: true } } },
          },
        },
      });
      if (!question) return { notFound: true };

      // A live assessment must never end up with zero questions.
      if (
        question.assessment.status === "Active" &&
        question.assessment._count.questions <= 1
      ) {
        return { lastActive: true };
      }
      // Candidates' saved answers point at this question.
      if (question._count.answers > 0) return { answered: true };

      await tx.assessmentQuestion.delete({ where: { id: questionId } });
      return { deleted: true };
    });

    if (result.notFound) {
      return res.status(404).json({ error: "Question not found." });
    }
    if (result.lastActive) {
      return res.status(409).json({
        error:
          "Cannot delete the last question of an active assessment; set it to Draft first or add another question before removing this one.",
      });
    }
    if (result.answered) {
      return res.status(409).json({
        error:
          "Cannot delete this question because candidates have already answered it.",
      });
    }
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(409).json({
        error:
          "Cannot delete this question because candidates have already answered it.",
      });
    }
    console.error(err);
    res.status(500).json({ error: "Could not delete question." });
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

    // One answer per question; ignore unknown question ids and blank answers.
    const submittedById = new Map();
    for (const a of answers) {
      if (!a || a.answer == null) continue;
      const text = String(a.answer);
      if (text.trim() === "") continue;
      submittedById.set(a.questionId, text);
    }

    const answerRows = [];
    let correctCount = 0;
    for (const q of questions) {
      const text = submittedById.get(q.id);
      const isMcq = q.type === "MCQ";
      const isCorrect = isMcq ? text === q.correctAnswer : null;
      if (isCorrect) correctCount++;
      if (text !== undefined) {
        answerRows.push({ questionId: q.id, answer: text, isCorrect });
      }
    }

    // Only MCQ questions are auto-graded. Short/Long answers are saved but
    // don't affect the score.
    const totalQuestions = questions.filter((q) => q.type === "MCQ").length;
    const score =
      totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 100)
        : null;
    const passed = score != null && score >= assessment.passingScore;
    const now = new Date();
    const userId = req.user.userId;

    const skillId = assessment.skillId;

    // Verification is sticky: a pass always (re)verifies, but a failed
    // attempt never downgrades an existing "Verified" status. An attempt
    // with no gradable (MCQ) questions leaves verification untouched.
    let verificationOps = [];
    if (score != null) {
      verificationOps = passed
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
    }

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
          answers: { create: answerRows },
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

    if (attempt.userId !== req.user.userId) {
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

async function updateAssessment(req, res) {
  try {
    const { id } = req.params;
    const fields = [
      "title",
      "description",
      "skillId",
      "difficulty",
      "type",
      "durationMinutes",
      "passingScore",
      "status",
    ];

    // Only fields present in the body are updated.
    const data = {};
    for (const f of fields) {
      if (req.body[f] !== undefined) data[f] = req.body[f];
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        error: `Provide at least one of: ${fields.join(", ")}.`,
      });
    }
    for (const f of ["title", "skillId", "difficulty", "type"]) {
      if (f in data && (typeof data[f] !== "string" || !data[f].trim())) {
        return res.status(400).json({ error: `${f} cannot be empty.` });
      }
    }
    const numberError = validateNumbers(data);
    if (numberError) {
      return res.status(400).json({ error: numberError });
    }
    if ("status" in data && !VALID_STATUSES.includes(data.status)) {
      return res
        .status(400)
        .json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}.` });
    }

    const assessment = await prisma.assessment.update({
      where: { id },
      data,
      include: { skill: true, _count: { select: { questions: true } } },
    });

    res.json(assessment);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Assessment not found." });
    }
    if (err.code === "P2003") {
      return res.status(400).json({ error: "skillId does not match an existing skill." });
    }
    console.error(err);
    res.status(500).json({ error: "Could not update assessment." });
  }
}

async function duplicateAssessment(req, res) {
  try {
    const { id } = req.params;
    const original = await prisma.assessment.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!original) {
      return res.status(404).json({ error: "Assessment not found." });
    }

    // The copy and all its questions are created together in one write.
    const copy = await prisma.assessment.create({
      data: {
        title: `${original.title} (copy)`,
        description: original.description,
        skillId: original.skillId,
        difficulty: original.difficulty,
        type: original.type,
        durationMinutes: original.durationMinutes,
        passingScore: original.passingScore,
        status: "Draft",
        questions: {
          create: original.questions.map((q) => ({
            questionText: q.questionText,
            type: q.type,
            // Prisma rejects a plain null for a Json field; leaving it out stores null.
            options: q.options ?? undefined,
            correctAnswer: q.correctAnswer,
          })),
        },
      },
      include: { skill: true, _count: { select: { questions: true } } },
    });

    res.status(201).json(copy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not duplicate assessment." });
  }
}

async function deleteAssessment(req, res) {
  try {
    const { id } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const assessment = await tx.assessment.findUnique({
        where: { id },
        include: { _count: { select: { attempts: true } } },
      });
      if (!assessment) return { notFound: true };
      if (assessment._count.attempts > 0) return { hasAttempts: true };

      await tx.assessmentQuestion.deleteMany({ where: { assessmentId: id } });
      await tx.assessment.delete({ where: { id } });
      return { deleted: true };
    });

    if (result.notFound) {
      return res.status(404).json({ error: "Assessment not found." });
    }
    if (result.hasAttempts) {
      return res.status(409).json({
        error:
          "Cannot delete this assessment because candidates have already attempted it.",
      });
    }
    res.status(204).send();
  } catch (err) {
    // An attempt was submitted between the check and the delete; it was rolled back.
    if (err.code === "P2003") {
      return res.status(409).json({
        error:
          "Cannot delete this assessment because candidates have already attempted it.",
      });
    }
    console.error(err);
    res.status(500).json({ error: "Could not delete assessment." });
  }
}

module.exports = {
  getAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  duplicateAssessment,
  deleteAssessment,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  submitAttempt,
  getMyAttempts,
  getAttemptById,
};
