import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { FaArrowLeft, FaChartLine, FaBrain, FaCheckCircle } from "react-icons/fa";

function Result() {
  const navigate = useNavigate();
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await API.get(`/attempts/${attemptId}`);
        setResult(res.data);
      } catch (error) {
        console.log("Error fetching result:", error);
        setResult(null); // explicit fallback
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
      fetchResult();
    } else {
      setLoading(false);
    }
  }, [attemptId]);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center text-2xl font-bold">
        Loading Result...
      </div>
    );
  }

  // NO RESULT / ERROR STATE
  if (!result || !result._id || !result.role) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold">Result not found.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-5 py-3 rounded-2xl transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold">Interview Result</h1>
          <p className="text-gray-400 mt-2">Review your performance and improve your weak areas.</p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 bg-[#1b2945] hover:bg-[#111c34] px-5 py-3 rounded-2xl border border-slate-700 transition"
        >
          <FaArrowLeft /> Dashboard
        </button>
      </div>

      {/* SCORE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* FINAL SCORE */}
        <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-8 shadow-xl transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Final Score</p>
              <h2 className="text-5xl font-bold mt-4">
                {typeof result.score === "number" ? result.score.toFixed(2) : "0"}%
              </h2>
            </div>
            <FaChartLine className="text-4xl text-indigo-400" />
          </div>
        </div>

        {/* TOTAL QUESTIONS */}
        <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-8 shadow-xl transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Questions</p>
              <h2 className="text-5xl font-bold mt-4">{result.totalQuestions ?? 0}</h2>
            </div>
            <FaCheckCircle className="text-4xl text-green-400" />
          </div>
        </div>

        {/* PERFORMANCE */}
        <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-8 shadow-xl transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Performance</p>
              <h2 className="text-3xl font-bold mt-4">
                {typeof result.score === "number"
                  ? result.score >= 80
                    ? "Excellent"
                    : result.score >= 60
                    ? "Good"
                    : "Needs Work"
                  : "Unknown"}
              </h2>
            </div>
            <FaBrain className="text-4xl text-indigo-400" />
          </div>
        </div>
      </div>

      {/* WEAK TOPICS */}
      <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-8 mb-10 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Weak Topics</h2>
        {result.weakTopics?.length === 0 || !Array.isArray(result.weakTopics) ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
            <p className="text-green-400 font-medium">Great work! No weak topics found.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {result.weakTopics.map((topic, index) => (
              <span
                key={index}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3 rounded-2xl font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* IMPROVEMENT SUGGESTION */}
      <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-5">Improvement Suggestion</h2>
        <p className="text-gray-300 leading-8">
          Practice more interview questions related to your weak topics and revise core concepts
          regularly. Focus on writing clearer explanations with proper technical terminology.
        </p>
      </div>
    </div>
  );
}

export default Result;