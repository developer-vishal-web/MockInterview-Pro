const Attempt = require("../models/Attempt");
const Question = require("../models/Question");

const calculateScore = require("../utils/scoring");

const submitAttempt = async (req, res) => {
  try {
    const { role, answers } = req.body;

    let totalScore = 0;
    let weakTopics = [];
    let processedAnswers = [];

    for (const item of answers) {
      const question = await Question.findById(item.questionId);

      const result = calculateScore(
        item.userAnswer,
        question.keywords
      );

      totalScore += result.score;

      if (result.score < 50) {
        weakTopics.push(question.topic);
      }

      processedAnswers.push({
        questionId: question._id,
        userAnswer: item.userAnswer,
        matchedKeywords: result.matchedKeywords,
        isCorrect: result.score >= 50,
      });
    }

    const finalScore = totalScore / answers.length;

    const attempt = await Attempt.create({
      userId: req.user.id,
      role,
      score: finalScore,
      totalQuestions: answers.length,
      weakTopics,
      answers: processedAnswers,
    });

    res.status(201).json({
      message: "Attempt submitted",
      attempt,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to submit attempt",
    });
  }
};

const getMyAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(attempts);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attempts",
    });
  }
};

const getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id);

    if (!attempt) {
      return res.status(404).json({
        message: "Attempt not found",
      });
    }

    // Security check
    if (attempt.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    res.status(200).json(attempt);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attempt",
    });
  }
};

  module.exports = {
    submitAttempt,
    getMyAttempts,
    getAttemptById
  };