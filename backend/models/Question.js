const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    correctAnswer: {
      type: String,
      required: true,
    },

    keywords: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;