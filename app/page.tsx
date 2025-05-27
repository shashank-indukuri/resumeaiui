"use client";
import React, { useState } from "react";
import ResumeUploader from "./ResumeUploader";
import JobDescInput from "./JobDescInput";
import ScoreCard from "./components/ScoreCard";
import { optimizeResume, downloadOptimizedResume } from "./api";
import ResumeComparison from "./components/ResumeComparison";

type ResumeData = Record<string, unknown> | string | number | boolean | null | undefined;

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobdesc, setJobdesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<{
    initial_score: number;
    final_score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    pdf_download_url: string;
    diff: {
      original: Record<string, ResumeData>;
      optimized: Record<string, ResumeData>;
    };
  } | null>(null);

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
    setOptimizationResult(null);
    setShowComparison(false); 

    try {
      if (!resume || !jobdesc) {
        setError("Please upload a resume and paste a job description.");
        setLoading(false);
        return;
      }
      const result = await optimizeResume({ resume, jobdesc });
      setOptimizationResult(result);
      
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
            className={`mt-2 px-6 py-3 rounded-lg font-semibold shadow transition ${
              !resume || !jobdesc
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={!resume || !jobdesc || loading}
          >
            {loading ? "Optimizing..." : "Optimize Resume"}
          </button>
        </form>
        {(!resume || !jobdesc) && (
          <div className="animate-bounce flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-300 mt-1">
            <span>✨</span>
            <span>
              {!resume && !jobdesc
                ? "Upload resume and add job description to continue"
                : !resume
                ? "Don't forget to upload your resume!"
                : "Add the job description to optimize"}
            </span>
          </div>
        )}
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
        {optimizationResult && (
          <ScoreCard 
            initialScore={optimizationResult.initial_score}
            finalScore={optimizationResult.final_score}
            summary={optimizationResult.summary}
            strengths={optimizationResult.strengths}
            weaknesses={optimizationResult.weaknesses}
            downloadUrl={optimizationResult.pdf_download_url}
            onDownload={() => downloadOptimizedResume(optimizationResult.pdf_download_url, resume?.name)}
            showCompare={true}
            onCompare={() => setShowComparison(true)}
          />
        )}
      </div>
 
      {showComparison && optimizationResult?.diff && (
        <ResumeComparison 
          original={optimizationResult.diff.original as Record<string, ResumeData>}
          optimized={optimizationResult.diff.optimized as Record<string, ResumeData>}
        />
      )}
      <footer className="mt-10 text-gray-500 dark:text-gray-400 text-xs text-center">
        &copy; {new Date().getFullYear()} Resume Optimizer AI. All rights reserved.
      </footer>
    </div>
  );
}