"use client";
import React, { useState } from "react";
import ResumeUploader from "./ResumeUploader";
import JobDescInput from "./JobDescInput";
import ScoreCard from "./ScoreCard";
import { optimizeResume, downloadOptimizedResume } from "./api";

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobdesc, setJobdesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setScore(null);
    setFeedback("");
    setDownloadUrl(undefined);
    try {
      if (!resume || !jobdesc) {
        setError("Please upload a resume and paste a job description.");
        setLoading(false);
        return;
      }
      const result = await optimizeResume({ resume, jobdesc });
      // Assume result.result_text contains score and feedback, parse accordingly
      const match = result.result_text.match(/score\s*:?\s*(\d+)/i);
      setScore(match ? parseInt(match[1], 10) : 90); // fallback to 90
      setFeedback(result.result_text);
      setDownloadUrl(result.pdf_download_url);
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
      <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-8 flex flex-col gap-8 border border-gray-200 dark:border-gray-800 mt-8">
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
        {error && <div className="text-red-600 text-center font-medium">{error}</div>}
        {score !== null && (
          <ScoreCard 
            score={score} 
            feedback={feedback} 
            downloadUrl={downloadUrl} 
            onDownload={downloadUrl ? (() => downloadOptimizedResume(downloadUrl)) : undefined}
          />
        )}
      </div>
      <footer className="mt-10 text-gray-500 dark:text-gray-400 text-xs text-center">
        &copy; {new Date().getFullYear()} Resume Optimizer AI. All rights reserved.
      </footer>
    </div>
  );
}
