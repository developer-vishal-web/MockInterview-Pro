const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    role: String,

    score: Number,

    totalQuestions: Number,

    weakTopics: [String],

    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,

        userAnswer: String,

        matchedKeywords: Number,

        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attempt", attemptSchema);