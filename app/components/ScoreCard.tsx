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
    <div className="w-full vanara-card rounded-xl shadow-lg p-6">
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
                className="text-[#2D5A3D] dark:text-[#F4A261]"
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vanara Intelligence Score</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">Initial:</span>
                <span className="text-sm font-medium">{initialScore}</span>
              </div>
              <div className={`flex items-center gap-1 ${scoreImprovement >= 0 ? 'text-[#2D5A3D]' : 'text-red-600'}`}>
                <span className="text-sm">
                  {scoreImprovement >= 0 ? '↗' : '↘'} {Math.abs(scoreImprovement)}
                </span>
                <span className="text-xs">({Math.abs(improvementPercentage)}%)</span>
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" tabIndex={-1}>
          {expanded ? (
            <ChevronUpIcon className="w-6 h-6 text-[#2D5A3D] dark:text-[#F4A261]" />
          ) : (
            <ChevronDownIcon className="w-6 h-6 text-[#2D5A3D] dark:text-[#F4A261]" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="mt-6 space-y-4">
          {summary && (
            <div className="w-full bg-[#F1F8E9]/70 dark:bg-[#2D5A3D]/20 rounded-lg p-4 text-gray-800 dark:text-gray-200 text-base border border-[#2D5A3D]/20 dark:border-[#F4A261]/20 mx-auto">
              <span className="font-semibold text-[#2D5A3D] dark:text-[#F4A261]">Vanara Wisdom:</span> {summary}
            </div>
          )}

          <div className="w-full flex flex-col md:flex-row gap-4 justify-center items-stretch">
            <div className="flex-1 min-w-[0] flex flex-col bg-[#2D5A3D]/10 dark:bg-[#2D5A3D]/30 rounded-lg p-5 border border-[#2D5A3D]/20 dark:border-[#2D5A3D]/40 shadow-sm items-center justify-start">
              <div className="flex items-center gap-2 font-semibold text-[#2D5A3D] dark:text-[#F4A261] mb-2">
                <span className="text-lg">🐒</span>
                <span>Strengths ({strengths.length})</span>
              </div>
              <ul className="list-disc list-inside text-[#2D5A3D] dark:text-green-100 text-sm pl-2 w-full">
                {strengths.length > 0 ? strengths.map((s, i) => <li key={i}>{s}</li>) : <li>No strengths listed.</li>}
              </ul>
            </div>

            <div className="flex-1 min-w-[0] flex flex-col bg-[#F4A261]/10 dark:bg-red-900/30 rounded-lg p-5 border border-[#F4A261]/20 dark:border-red-800 shadow-sm items-center justify-start">
              <div className="flex items-center gap-2 font-semibold text-[#E76F51] dark:text-red-300 mb-2">
                <span className="text-lg">⚡</span>
                <span>Growth Areas ({weaknesses.length})</span>
              </div>
              <ul className="list-disc list-inside text-[#E76F51] dark:text-red-100 text-sm pl-2 w-full">
                {weaknesses.length > 0 ? weaknesses.map((w, i) => <li key={i}>{w}</li>) : <li>No growth areas identified.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {downloadUrl && onDownload && (
          <button
            onClick={onDownload}
            className="flex-1 vanara-btn-primary px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Download Transformed Resume
          </button>
        )}
        {showCompare && onCompare && (
          <button
            onClick={onCompare}
            className="flex-1 vanara-btn-secondary px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Compare Transformation
          </button>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;