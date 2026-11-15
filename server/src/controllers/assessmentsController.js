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
    const { answers } = req.body; // [{ questionId, answer }]

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "answers array is required." });
    }

    const questions = await prisma.assessmentQuestion.findMany({
      where: { assessmentId: id },
    });

    let correctCount = 0;
    for (const q of questions) {
      const submitted = answers.find((a) => a.questionId === q.id);
      if (submitted && submitted.answer === q.correctAnswer) {
        correctCount++;
      }
    }

    const score = Math.round((correctCount / questions.length) * 100);

    const attempt = await prisma.assessmentAttempt.create({
      data: {
        userId: req.user.userId,
        assessmentId: id,
        score,
        status: "Completed",
        completedAt: new Date(),
      },
    });

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

module.exports = {
  getAssessments,
  getAssessmentById,
  createAssessment,
  addQuestion,
  submitAttempt,
  getMyAttempts,
};
