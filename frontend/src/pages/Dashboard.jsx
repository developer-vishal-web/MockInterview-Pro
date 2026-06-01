import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  FaChartLine,
  FaTrophy,
  FaBullseye,
  FaBrain,
  FaSignOutAlt,
  FaRocket,
  FaUserTie,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  const [role, setRole] = useState("React");
  const [difficulty, setDifficulty] = useState("Easy");
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      setLoading(true);
      try {
        const res = await API.get("/attempts/my");
        setAttempts(res.data);
      } catch (error) {
        toast.error("Failed to load dashboard");
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const startInterview = () => {
    navigate(`/interview?role=${role}&difficulty=${difficulty}`);
  };

  const totalAttempts = attempts.length;

  const averageScore =
    attempts.length > 0
      ? (
        attempts.reduce((acc, item) => acc + item.score, 0) /
        attempts.length
      ).toFixed(2)
      : 0;

  const bestScore =
    attempts.length > 0
      ? Math.max(...attempts.map((item) => item.score)).toFixed(2)
      : 0;

  const topicCount = {};
  attempts.forEach((attempt) => {
    attempt.weakTopics?.forEach((topic) => {
      topicCount[topic] = (topicCount[topic] || 0) + 1;
    });
  });

  const weakestTopic =
    Object.keys(topicCount).sort((a, b) => topicCount[b] - topicCount[a])[0] ||
    "None";

  const chartData = [...attempts]
    .reverse()
    .map((attempt, index) => ({
      attempt: `#${index + 1}`,
      score: attempt.score,
    }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <h1 className="text-3xl font-bold text-white animate-pulse">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="flex">
        <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-[#111c34] border-r border-slate-800 p-4 md:p-6 fixed inset-y-0 left-0">
          <h1 className="flex items-center gap-3 text-2xl font-bold mb-10">
            <span className="bg-indigo-500/20 text-indigo-400 p-2.5 rounded-2xl border border-indigo-500/40 flex items-center justify-center">
              <FaUserTie className="text-xl" />
            </span>
            <span>MockInterview Pro</span>
          </h1>

          <div className="mb-10">
            <div className="bg-indigo-500/20 text-indigo-400 px-4 py-3 rounded-2xl font-medium">
              Dashboard
            </div>
          </div>

          <div className="bg-[#1b2945] rounded-3xl p-5 border border-slate-700 mt-6 text-sm text-gray-300">
            <p className="text-gray-400 text-sm">Performance Insight</p>
            <p className="mt-3 leading-7 text-gray-200 text-sm">
              Your weakest topic is{" "}
              <span className="text-indigo-400 font-semibold">

              </span>
              . Focus more on this topic to improve your interview performance.
            </p>
          </div>
        </aside>

        <main className="flex-1 w-full lg:ml-72 p-4 md:p-6 lg:p-10 overflow-auto">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Interview Dashboard
              </h1>
              <p className="text-gray-400 mt-2 text-sm md:text-base">
                Track your performance and improve your weak areas.
              </p>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 md:px-5 py-2.5 md:py-3 rounded-2xl transition font-medium text-sm md:text-base self-start md:self-auto"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">

            <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl hover:scale-[1.01] transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Attempts</p>
                  <h2 className="text-3xl md:text-4xl font-bold mt-3">
                    {totalAttempts}
                  </h2>
                </div>
                <FaChartLine className="text-2xl md:text-3xl text-indigo-400" />
              </div>
            </div>

            <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl hover:scale-[1.01] transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Score</p>
                  <h2 className="text-3xl md:text-4xl font-bold mt-3">
                    {averageScore}%
                  </h2>
                </div>
                <FaBullseye className="text-2xl md:text-3xl text-green-400" />
              </div>
            </div>

            <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl hover:scale-[1.01] transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Best Score</p>
                  <h2 className="text-3xl md:text-4xl font-bold mt-3">
                    {bestScore}%
                  </h2>
                </div>
                <FaTrophy className="text-2xl md:text-3xl text-indigo-400" />
              </div>
            </div>

            <div className="bg-[#111c34] border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl hover:scale-[1.01] transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Weakest Topic</p>
                  <h2 className="text-xl md:text-2xl font-bold mt-3 wrap-break-word">
                    {weakestTopic}
                  </h2>
                </div>
                <FaBrain className="text-2xl md:text-3xl text-indigo-400" />
              </div>
            </div>
          </section>

          {attempts.length === 0 && (
            <section className="bg-[#111c34] border border-slate-800 rounded-3xl p-6 md:p-8 text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                No Attempts Yet
              </h2>
              <p className="text-gray-400 mb-6 text-sm md:text-base">
                Start your first interview to unlock analytics and insights.
              </p>
              <button
                onClick={startInterview}
                className="bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition px-5 md:px-6 py-3 md:py-3.5 rounded-2xl font-semibold text-sm md:text-base"
              >
                Start Interview
              </button>
            </section>
          )}

          <section className="bg-[#111c34] border border-slate-800 rounded-3xl p-6 md:p-6 mb-8">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <FaRocket className="text-indigo-400 text-xl md:text-2xl" />
              <h2 className="text-xl md:text-2xl font-bold">
                Start New Interview
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-[#1b2945] border border-slate-700 rounded-2xl px-4 py-3 md:py-4 outline-none w-full focus:border-indigo-500 text-sm md:text-base"
              >
                <option>React</option>
                <option>JavaScript</option>
                <option>Node</option>
                <option>MongoDB</option>
                <option>HTML & CSS</option>
                <option>Data Structures</option>
              </select>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="bg-[#1b2945] border border-slate-700 rounded-2xl px-4 py-3 md:py-4 outline-none w-full focus:border-indigo-500 text-sm md:text-base"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>

              <button
                onClick={startInterview}
                className="bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition px-5 md:px-6 py-3 md:py-4 rounded-2xl font-semibold shadow-lg text-sm md:text-base"
              >
                Start Interview
              </button>
            </div>
          </section>

          {attempts.length > 0 && (
            <section className="bg-[#111c34] border border-slate-800 rounded-3xl p-4 md:p-6 mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                Performance Trend
              </h2>
              <div className="w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="attempt" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#818cf8"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {attempts.length > 0 && (
            <section className="bg-[#111c34] border border-slate-800 rounded-3xl p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                Recent Attempts
              </h2>

              <div className="space-y-4 md:hidden">
                {attempts.map((attempt) => (
                  <div
                    key={attempt._id}
                    className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400 font-medium">
                        {attempt.role}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-gray-300">
                        {attempt.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mb-2">
                      Score:{" "}
                      <span className="text-green-400 font-semibold">
                        {attempt.score.toFixed(2)}%
                      </span>
                    </p>

                    <p className="text-xs text-gray-500 mb-3">
                      {attempt.totalQuestions} questions ·{" "}
                      {new Date(attempt.createdAt).toLocaleDateString()}
                    </p>

                    <button
                      onClick={() => navigate(`/result/${attempt._id}`)}
                      className="bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-xl text-xs font-medium transition"
                    >
                      View Result
                    </button>
                  </div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-162.5 text-sm md:text-base">
                  <thead>
                    <tr className="border-b border-slate-800 text-gray-400">
                      <th className="text-left p-3 md:p-4">Role</th>
                      <th className="text-left p-3 md:p-4">Difficulty</th>
                      <th className="text-left p-3 md:p-4">Score</th>
                      <th className="text-left p-3 md:p-4">Questions</th>
                      <th className="text-left p-3 md:p-4">Date</th>
                      <th className="text-left p-3 md:p-4">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((attempt, index) => (
                      <tr
                        key={attempt._id}
                        className={`border-b border-slate-800 hover:bg-slate-800/40 transition ${index % 2 === 0 ? "bg-slate-900/30" : ""
                          }`}
                      >
                        <td className="p-3 md:p-4">{attempt.role}</td>
                        <td className="p-3 md:p-4">{attempt.difficulty}</td>
                        <td className="p-3 md:p-4">
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                            {attempt.score.toFixed(2)}%
                          </span>
                        </td>
                        <td className="p-3 md:p-4">{attempt.totalQuestions}</td>
                        <td className="p-3 md:p-4 text-gray-400">
                          {new Date(attempt.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 md:p-4">
                          <button
                            onClick={() => navigate(`/result/${attempt._id}`)}
                            className="bg-indigo-500 hover:bg-indigo-600 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-medium transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;