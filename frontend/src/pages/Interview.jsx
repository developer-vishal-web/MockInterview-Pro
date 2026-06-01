import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

import { FaArrowLeft, FaCheckCircle, FaCode } from "react-icons/fa";

function Interview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");
  const difficulty = searchParams.get("difficulty");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // REDIRECT IF PARAMS MISSING
  useEffect(() => {
    if (!role || !difficulty) {
      navigate("/dashboard", { replace: true });
    }
  }, [role, difficulty, navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await API.get(
          `/questions?role=${role}&difficulty=${difficulty}`
        );
        setQuestions(res.data);
      } catch (error) {
        toast.error("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [role, difficulty]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => {
      const existing = prev.find((item) => item.questionId === questionId);

      if (existing) {
        return prev.map((item) =>
          item.questionId === questionId
            ? { ...item, userAnswer: value }
            : item
        );
      }

      return [
        ...prev,
        { questionId, userAnswer: value },
      ];
    });
  };

  // ANSWERED COUNT
  const answeredCount = answers.filter(
    (a) => a.userAnswer?.trim() !== ""
  ).length;

  // SUBMIT INTERVIEW
  const handleSubmit = async () => {
    const allAnswered = questions.every((q) => {
      const answer = answers.find((a) => a.questionId === q._id);

      return answer && answer.userAnswer?.trim() !== "";
    });

    if (!allAnswered) {
      toast.error("Please answer all questions");
      return;
    }

    setSubmitting(true);

    try {
      const res = await API.post("/attempts", {
        role,
        answers,
      });

      toast.success("Interview submitted successfully");
      navigate(`/result/${res.data.attempt._id}`, { replace: true });
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <h1 className="text-3xl font-bold text-white animate-pulse">
          Loading Questions...
        </h1>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
        <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-10 text-center max-w-md shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-3">
            No Questions Found
          </h1>
          <p className="text-gray-400 mb-6">
            No interview questions are available for this category.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-2xl transition font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] py-10 px-4 text-white">
      <div className="max-w-5xl mx-auto">        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-500/20 text-indigo-400 p-3 rounded-2xl border border-indigo-500/30">
                <FaCode />
              </div>
              <h1 className="text-4xl font-bold">{role} Interview</h1>
            </div>
            <p className="text-gray-400">
              Answer all interview questions carefully to evaluate your performance.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 bg-[#111c34] border border-slate-700 hover:bg-[#1b2945] px-5 py-3 rounded-2xl transition w-fit"
          >
            <FaArrowLeft />
            Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-6">
            <p className="text-gray-400 text-sm">Role</p>
            <h2 className="text-2xl font-bold mt-3">{role}</h2>
          </div>

          <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-6">
            <p className="text-gray-400 text-sm">Difficulty</p>
            <h2 className="text-2xl font-bold mt-3">{difficulty}</h2>
          </div>

          <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-6">
            <p className="text-gray-400 text-sm">Progress</p>
            <h2 className="text-2xl font-bold mt-3">
              {answeredCount}/{questions.length} Answered
            </h2>

            <div className="w-full h-3 bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{
                  width: questions.length > 0
                    ? `${(answeredCount / questions.length) * 100}%`
                    : "0%",
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {questions.map((q, index) => (
            <div
              key={q._id}
              className="bg-[#111c34] border border-slate-800 rounded-3xl p-7 shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    Question {index + 1}
                  </h2>
                  <p className="text-gray-400 mt-1 text-sm">
                    {index + 1} of {questions.length}
                  </p>
                </div>
                <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-full text-sm font-medium w-fit">
                  {q.topic}
                </span>
              </div>

              <p className="text-lg leading-8 text-gray-200 mb-6">
                {q.question}
              </p>

              <textarea
                rows="7"
                placeholder="Write your answer here..."
                value={
                  answers.find((item) => item.questionId === q._id)
                    ?.userAnswer || ""
                }
                onChange={(e) =>
                  handleAnswerChange(q._id, e.target.value)
                }
                className="w-full border border-slate-700 bg-[#1b2945] text-gray-100 rounded-2xl p-5 outline-none resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`
              flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-200
              ${
                submitting
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600 hover:scale-[1.01]"
              }
            `}
          >
            <FaCheckCircle />
            {submitting ? "Submitting Interview..." : "Submit Interview"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Interview;