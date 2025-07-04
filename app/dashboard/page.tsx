"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ResumeUploader from "../ResumeUploader";
import JobDescInput from "../JobDescInput";
import JobDetailsInput from "../components/JobDetailsInput";
import ScoreCard from "../components/ScoreCard";
import { optimizeResume, downloadOptimizedResume } from "../api";
import ResumeComparison from "../components/ResumeComparison";
import ResumeHistory from "../components/ResumeHistory";

type ResumeData = Record<string, unknown> | string | number | boolean | null | undefined;

export default function Dashboard() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'optimize' | 'history'>('optimize');
  const [resume, setResume] = useState<File | null>(null);
  const [jobdesc, setJobdesc] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [optimizing, setOptimizing] = useState(false);
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

  // Check if user has access
  const hasAccess = user?.user_metadata?.hasAccess || false;

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
    if (!user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (optimizing) {
      setLoadingMsgIdx(0);
      interval = setInterval(() => {
        setLoadingMsgIdx(idx => (idx + 1) % loadingMessages.length);
      }, 8000); // Change message every 8 seconds
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(interval);
  }, [optimizing, loadingMessages.length]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOptimizing(true);
    setError("");
    setOptimizationResult(null);
    setShowComparison(false);

    try {
      if (!resume || !jobdesc) {
        setError("Please upload a resume and paste a job description.");
        setOptimizing(false);
        return;
      }

      if (!user) {
        setError("User not authenticated.");
        setOptimizing(false);
        return;
      }

      const userId = user.id; // Retrieve userId from Supabase user object
      const userEmail = user.email || "unknown@example.com"; // Fallback for user email
      const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Unknown User"; // Fallback for user name

      const result = await optimizeResume({ resume, jobdesc, jobTitle, company, userId, userEmail, userName });
      setOptimizationResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setOptimizing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show access restricted message for unauthorized users
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        {/* Header */}
        <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Resume AI</span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Sign Out"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m0 0a4 4 0 110-8 4 4 0 010 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Restricted</h2>
            <p className="text-gray-600 dark:text-gray-400">
              🚦 Due to overwhelming excitement and demand, access to Resume AI is currently limited to a select group of users.<br />
              Want to try it? Just tap below to request access and we’ll get you in as soon as possible! 🎉
            </p>
            <div className="pt-4">
              <a
                href="mailto:atlasproject@myyahoo.com"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Request Access
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 sm:py-0 h-auto sm:h-16">
            <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto gap-2 sm:gap-4">
              {/* Logo Section - Always Visible */}
              <div className="flex items-center justify-between w-full sm:w-auto">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">R</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Resume AI</span>
                </div>
                
                {/* Mobile Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="sm:hidden inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>

              {/* Divider - Hidden on Mobile */}
              <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <Image 
                  src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'User')}&background=3b82f6&color=fff`}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'User')}&background=3b82f6&color=fff`;
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.user_metadata?.full_name || user.user_metadata?.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ready to optimize your resume?</p>
                </div>
              </div>
            </div>

            {/* Desktop Sign Out Button - Hidden on Mobile */}
            <button
              onClick={handleSignOut}
              className="hidden sm:inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Adjust main content padding for new header height */}
      <main className="pt-28 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="w-full max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('optimize')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'optimize'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Optimize Resume
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'history'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    History
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'optimize' ? (
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 relative">
              <span className="absolute -top-3 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider z-10">Beta</span>
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Start Optimizing</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upload your resume and paste the job description to get personalized optimization</p>
              </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <ResumeUploader onFileChange={setResume} uploading={optimizing} />
              <JobDetailsInput 
                jobTitle={jobTitle}
                company={company}
                jobDescription={jobdesc}
                onJobTitleChange={setJobTitle}
                onCompanyChange={setCompany}
                onJobDescriptionChange={setJobdesc}
                disabled={optimizing}
              />
              <button
                type="submit"
                className={`mt-2 px-6 py-3 rounded-lg font-semibold shadow-lg transition transform hover:scale-[1.02] ${
                  !resume || !jobdesc
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                }`}
                disabled={!resume || !jobdesc || optimizing}
              >
                {optimizing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Optimizing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Optimize Resume
                  </span>
                )}
              </button>
            </form>

            {(!resume || !jobdesc) && (
              <div className="animate-bounce flex items-center justify-center gap-2 text-sm text-yellow-600 dark:text-yellow-500 mt-4">
                <span className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">✨</span>
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
              <div className="mt-4 animate-fade-in">
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-red-800 dark:text-red-200 text-sm">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>
                    Having trouble? Our AI is still learning and sometimes needs a break. Try again or use a smaller file.
                  </span>
                </div>
              </div>
            )}

            {optimizing && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900 rounded-full animate-pulse"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 dark:border-blue-400 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <div className="text-center">
                  <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">{loadingMessages[loadingMsgIdx]}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This may take up to 2 minutes. Please don&apos;t close this tab.</p>
                </div>
              </div>
            )}

            {optimizationResult && (
              <div className="mt-8 animate-fade-in">
                <ScoreCard 
                  initialScore={optimizationResult.initial_score}
                  finalScore={optimizationResult.final_score}
                  summary={optimizationResult.summary}
                  strengths={optimizationResult.strengths}
                  weaknesses={optimizationResult.weaknesses}
                  downloadUrl={optimizationResult.pdf_download_url}
                  onDownload={() => downloadOptimizedResume(
                    optimizationResult.pdf_download_url,
                    user.id,
                    user.email || "unknown@example.com",
                    user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Unknown User",
                    resume?.name || "optimized_resume.pdf"
                  )}
                  showCompare={true}
                  onCompare={() => setShowComparison(true)}
                />
              </div>
            )}
            </div>
          ) : (
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
              <ResumeHistory />
            </div>
          )}
        </div>
      </main>

      {/* Comparison Modal */}
      {showComparison && optimizationResult?.diff && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setShowComparison(false)}
          />
          <div className="fixed inset-4 md:inset-8 z-50 overflow-hidden">
            <div className="relative w-full h-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setShowComparison(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white/10 hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-800/80 rounded-full backdrop-blur-sm transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 h-full overflow-y-auto">
                <ResumeComparison 
                  original={optimizationResult.diff.original as Record<string, ResumeData>}
                  optimized={optimizationResult.diff.optimized as Record<string, ResumeData>}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <footer className="py-6 px-4 mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} Resume Optimizer AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
