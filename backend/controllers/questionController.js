const Question = require("../models/Question");

const getQuestions = async (req, res) => {
  try {
    const { role, difficulty } = req.query;

    const questions = await Question.find({
      role,
      difficulty,
    }).select("-correctAnswer -keywords");

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch questions",
    });
  }
};

const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create question",
    });
  }
};

module.exports = {
  getQuestions,
  createQuestion
};