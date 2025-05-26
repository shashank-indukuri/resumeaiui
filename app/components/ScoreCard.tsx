import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export interface ScoreCardProps {
  initialScore: number;
  finalScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  downloadUrl?: string;
  onDownload?: () => void;
  showCompare?: boolean;
  onCompare?: () => void;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  initialScore,
  finalScore,
  summary,
  strengths,
  weaknesses,
  downloadUrl,
  onDownload,
  showCompare,
  onCompare,
}) => {
  const [expanded, setExpanded] = useState(false);
  const scoreImprovement = finalScore - initialScore;
  const improvementPercentage = Math.round((scoreImprovement / initialScore) * 100);

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(v => !v)}>
        <div className="flex items-center gap-6">
          {/* Final Score Circle */}
          <div className="relative">
            <svg className="w-20 h-20">
              <circle
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="36"
                cx="40"
                cy="40"
              />
              <circle
                className="text-blue-600 dark:text-blue-400"
                strokeWidth="8"
                strokeDasharray={`${finalScore * 2.26} 226`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="36"
                cx="40"
                cy="40"
              />
            </svg>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-900 dark:text-white">
              {finalScore}
            </span>
          </div>

          {/* Score Comparison */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resume Score</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">Initial:</span>
                <span className="text-sm font-medium">{initialScore}</span>
              </div>
              <div className={`flex items-center gap-1 ${scoreImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span className="text-sm">
                  {scoreImprovement >= 0 ? '↑' : '↓'} {Math.abs(scoreImprovement)}
                </span>
                <span className="text-xs">({Math.abs(improvementPercentage)}%)</span>
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" tabIndex={-1}>
          {expanded ? (
            <ChevronUpIcon className="w-6 h-6 text-blue-500" />
          ) : (
            <ChevronDownIcon className="w-6 h-6 text-blue-500" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="mt-6 space-y-4">
          {summary && (
            <div className="w-full bg-blue-50/70 dark:bg-gray-800/70 rounded-lg p-4 text-gray-800 dark:text-gray-200 text-base border border-blue-100 dark:border-gray-700 mx-auto">
              <span className="font-semibold text-blue-700 dark:text-blue-300">Summary:</span> {summary}
            </div>
          )}

          <div className="w-full flex flex-col md:flex-row gap-4 justify-center items-stretch">
            <div className="flex-1 min-w-[0] flex flex-col bg-green-50/40 dark:bg-green-900/30 rounded-lg p-5 border border-green-100 dark:border-green-800 shadow-sm items-center justify-start">
              <div className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-300 mb-2">
                <span className="text-lg">✅</span>
                <span>Strengths ({strengths.length})</span>
              </div>
              <ul className="list-disc list-inside text-green-900 dark:text-green-100 text-sm pl-2 w-full">
                {strengths.length > 0 ? strengths.map((s, i) => <li key={i}>{s}</li>) : <li>No strengths listed.</li>}
              </ul>
            </div>

            <div className="flex-1 min-w-[0] flex flex-col bg-red-50/40 dark:bg-red-900/30 rounded-lg p-5 border border-red-100 dark:border-red-800 shadow-sm items-center justify-start">
              <div className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-300 mb-2">
                <span className="text-lg">⚠️</span>
                <span>Weaknesses ({weaknesses.length})</span>
              </div>
              <ul className="list-disc list-inside text-red-900 dark:text-red-100 text-sm pl-2 w-full">
                {weaknesses.length > 0 ? weaknesses.map((w, i) => <li key={i}>{w}</li>) : <li>No weaknesses listed.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {downloadUrl && onDownload && (
          <button
            onClick={onDownload}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Download Resume
          </button>
        )}
        {showCompare && onCompare && (
          <button
            onClick={onCompare}
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Compare Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
