import React from "react";

interface ScoreCardProps {
  score: number;
  feedback: string;
  downloadUrl?: string;
  onDownload?: () => void;
}

// Helper to parse feedback string into structured data
function parseFeedback(feedback: string) {
  // Use regex to extract sections
  const summaryMatch = feedback.match(/Summary:\s*([^\n]+)/);
  const strengthsMatch = feedback.match(/Strengths:\s*\[([^\]]+)\]/);
  const weaknessesMatch = feedback.match(/Weaknesses:\s*\[([^\]]+)\]/);
  const atsScoreMatch = feedback.match(/ATS Score:\s*(\d+)/i);
  const iterationsMatch = feedback.match(/Iterations:\s*(\d+)/i);

  // Parse strengths and weaknesses as arrays
  const strengths = strengthsMatch
    ? strengthsMatch[1]
        .split(",")
        .map((s) => s.replace(/^'/, "").replace(/'$/, "").trim().replace(/^'/, "").replace(/'$/, ""))
        .map((s) => s.replace(/^'/, "").replace(/'$/, "").trim())
    : [];
  const weaknesses = weaknessesMatch
    ? weaknessesMatch[1]
        .split(",")
        .map((s) => s.replace(/^'/, "").replace(/'$/, "").trim().replace(/^'/, "").replace(/'$/, ""))
        .map((s) => s.replace(/^'/, "").replace(/'$/, "").trim())
    : [];

  return {
    summary: summaryMatch ? summaryMatch[1].trim() : "",
    strengths,
    weaknesses,
    atsScore: atsScoreMatch ? atsScoreMatch[1] : null,
    iterations: iterationsMatch ? iterationsMatch[1] : null,
  };
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, feedback, downloadUrl, onDownload }) => {
  const { summary, strengths, weaknesses, atsScore, iterations } = parseFeedback(feedback);
  const showAtsScore = atsScore && atsScore !== String(score);

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col gap-6 items-center border border-gray-200 dark:border-gray-800">
      <div className="flex flex-col items-center gap-1 w-full">
        <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 text-center">{score}</span>
        <span className="text-base text-gray-500 dark:text-gray-400 font-medium text-center">Resume Score</span>
        {showAtsScore && (
          <span className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1 text-center">ATS Score: {atsScore}</span>
        )}
      </div>
      <div className="w-full bg-blue-50/70 dark:bg-gray-800/70 rounded-lg p-4 text-gray-800 dark:text-gray-200 text-center text-base border border-blue-100 dark:border-gray-700 mx-auto">
        <span className="font-semibold text-blue-700 dark:text-blue-300">Summary:</span> {summary}
      </div>
      <div className="w-full flex flex-col md:flex-row gap-4 justify-center items-stretch">
        <div className="flex-1 min-w-[0] flex flex-col bg-green-50/40 dark:bg-green-900/30 rounded-lg p-5 border border-green-100 dark:border-green-800 shadow-sm items-center justify-start">
          <div className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-300 mb-2">
            <span className="text-lg">✅</span>
            <span>Strengths</span>
          </div>
          <ul className="list-disc list-inside text-green-900 dark:text-green-100 text-sm pl-2 w-full">
            {strengths.length > 0 ? strengths.map((s, i) => <li key={i}>{s}</li>) : <li>No strengths listed.</li>}
          </ul>
        </div>
        <div className="flex-1 min-w-[0] flex flex-col bg-red-50/40 dark:bg-red-900/30 rounded-lg p-5 border border-red-100 dark:border-red-800 shadow-sm items-center justify-start">
          <div className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-300 mb-2">
            <span className="text-lg">⚠️</span>
            <span>Weaknesses</span>
          </div>
          <ul className="list-disc list-inside text-red-900 dark:text-red-100 text-sm pl-2 w-full">
            {weaknesses.length > 0 ? weaknesses.map((w, i) => <li key={i}>{w}</li>) : <li>No weaknesses listed.</li>}
          </ul>
        </div>
      </div>
      {iterations && (
        <div className="w-full text-xs text-gray-500 dark:text-gray-400 text-center mt-2">Iterations: {iterations}</div>
      )}
      {downloadUrl && (
        <button
          type="button"
          onClick={onDownload}
          className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition mx-auto"
        >
          Download Optimized Resume
        </button>
      )}
    </div>
  );
};

export default ScoreCard;
