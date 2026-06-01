const express = require("express");

const {
  getQuestions,
  createQuestion,
} = require("../controllers/questionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getQuestions);

router.post("/", authMiddleware, createQuestion);

module.exports = router;