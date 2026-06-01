const calculateScore = (userAnswer, keywords) => {
  let matched = 0;

  const answer = userAnswer.toLowerCase();

  keywords.forEach((keyword) => {
    if (answer.includes(keyword.toLowerCase())) {
      matched++;
    }
  });

  const percentage = (matched / keywords.length) * 100;

  return {
    matchedKeywords: matched,
    score: percentage,
  };
};

module.exports = calculateScore;