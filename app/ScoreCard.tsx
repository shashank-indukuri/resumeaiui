import React from "react";

interface ScoreCardProps {
  score: number;
  feedback: string;
  downloadUrl?: string;
  onDownload?: () => void;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, feedback, downloadUrl, onDownload }) => (
  <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col gap-4 items-center border border-gray-200 dark:border-gray-800">
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{score}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400">Resume Score</span>
    </div>
    <div className="text-gray-800 dark:text-gray-200 text-center text-base whitespace-pre-line">{feedback}</div>
    {downloadUrl && (
      <button
        type="button"
        onClick={onDownload}
        className="mt-2 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
      >
        Download Optimized Resume
      </button>
    )}
  </div>
);

export default ScoreCard;
