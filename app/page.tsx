"use client";
import React, { useState } from "react";
import ResumeUploader from "./ResumeUploader";
import JobDescInput from "./JobDescInput";
import ScoreCard from "./components/ScoreCard";
import ResumeComparison from "./components/ResumeComparison";
import { optimizeResume, downloadOptimizedResume } from "./api";

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobdesc, setJobdesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  const [diff, setDiff] = useState<any>(null);

  // Dynamic, creative loading messages
  const loadingMessages = [
    "Analyzing your resume for the perfect match...",
    "Matching your skills to the job description...",
    "Optimizing keywords and achievements...",
    "Rewriting your story for recruiters...",
    "Boosting your resume score...",
    "Fine-tuning for AI and human eyes...",
    "Almost there! Making your resume shine...",
    "Checking for the best fit...",
    "Highlighting your strengths...",
    "Finalizing your optimized resume..."
  ];
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingMsgIdx(0);
      interval = setInterval(() => {
        setLoadingMsgIdx(idx => (idx + 1) % loadingMessages.length);
      }, 8000); // Change message every 8 seconds
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading, loadingMessages.length]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setScore(null);
    setFeedback("");
    setDownloadUrl(undefined);
    setDiff(null);
    try {
      if (!resume || !jobdesc) {
        setError("Please upload a resume and paste a job description.");
        setLoading(false);
        return;
      }
      const result = await optimizeResume({ resume, jobdesc });
      
      // Parse the score from result_text
      const match = result.result_text.match(/score\s*:?\s*(\d+)/i);
      setScore(match ? parseInt(match[1], 10) : 90);
      setFeedback(result.result_text);
      setDownloadUrl(result.pdf_download_url);
      if (result.diff) {
        setDiff(result.diff);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 flex flex-col gap-8 border border-gray-200 dark:border-gray-800 mt-8 relative">
        <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow uppercase tracking-wider z-10">Beta</span>
        <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-300 mb-2">Resume Optimizer AI</h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <ResumeUploader onFileChange={setResume} uploading={loading} />
          <JobDescInput value={jobdesc} onChange={setJobdesc} disabled={loading} />
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Optimizing..." : "Optimize Resume"}
          </button>
        </form>
        {error && (
          <div className="w-full flex justify-center mt-2">
            <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-700 rounded-lg px-4 py-2 text-yellow-800 dark:text-yellow-200 text-sm shadow-sm max-w-md text-center">
              <span className="text-xl">⚡️</span>
              <span>
                Having trouble? Our AI is still learning and sometimes needs a break. Try again or use a smaller file.
              </span>
            </div>
          </div>
        )}
        {loading && (
          <div className="flex flex-col items-center gap-2 mt-4 animate-pulse">
            <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">{loadingMessages[loadingMsgIdx]}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">This may take up to 2 minutes. Please don&apos;t close this tab.</span>
          </div>
        )}
        {score !== null && (
          <ScoreCard 
            score={score} 
            feedback={feedback} 
            downloadUrl={downloadUrl} 
            onDownload={downloadUrl ? (() => downloadOptimizedResume(downloadUrl)) : undefined}
          />
        )}
        {diff && (
          <ResumeComparison 
            original={diff.original}
            optimized={diff.optimized}
            changes={diff.changes}
          />
        )}
      </div>

      <footer className="mt-10 text-gray-500 dark:text-gray-400 text-xs text-center">
        &copy; {new Date().getFullYear()} Resume Optimizer AI. All rights reserved.
      </footer>
    </div>
  );
}