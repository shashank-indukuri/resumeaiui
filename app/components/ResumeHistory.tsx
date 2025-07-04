"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getResumeHistory, generatePDFFromHistory, downloadOptimizedResume } from "../api";

interface ResumeGeneration {
  id: string;
  original_filename: string;
  ats_score: number;
  created_at: string;
  jobs?: {
    title?: string;
    company?: string;
    description?: string;
  } | null;
}

export default function ResumeHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ResumeGeneration[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({
    company: '',
    minScore: '',
    maxScore: '',
    startDate: '',
    endDate: ''
  });

  const fetchHistory = useCallback(async (page = 1) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const filterParams = {
        page,
        limit: pagination.limit,
        ...(filters.company && { company: filters.company }),
        ...(filters.minScore && { minScore: parseFloat(filters.minScore) }),
        ...(filters.maxScore && { maxScore: parseFloat(filters.maxScore) }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      };
      
      const response = await getResumeHistory(
        user.id,
        user.email || "",
        user.user_metadata?.full_name || user.email || "",
        filterParams
      );
      
      setHistory(response.history);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.total_pages
      });
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  }, [user, pagination.limit, filters]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, fetchHistory]);
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const applyFilters = () => {
    fetchHistory(1);
  };
  
  const clearFilters = () => {
    setFilters({
      company: '',
      minScore: '',
      maxScore: '',
      startDate: '',
      endDate: ''
    });
    setTimeout(() => fetchHistory(1), 0);
  };

  const handleDownload = async (generation: ResumeGeneration) => {
    if (!user) return;
    
    setGenerating(generation.id);
    try {
      const response = await generatePDFFromHistory(
        generation.id,
        user.id,
        user.email || "",
        user.user_metadata?.full_name || user.email || ""
      );
      
      await downloadOptimizedResume(
        response.pdf_download_url,
        user.id,
        user.email || "",
        user.user_metadata?.full_name || user.email || "",
        generation.original_filename
      );
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setGenerating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const toggleJobDescription = (generationId: string) => {
    const newExpanded = new Set(expandedJobs);
    if (newExpanded.has(generationId)) {
      newExpanded.delete(generationId);
    } else {
      newExpanded.add(generationId);
    }
    setExpandedJobs(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Resume History</h3>
        <p className="text-gray-500">Start optimizing resumes to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Resume History</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {pagination.total} total resumes
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Filter by company..."
            value={filters.company}
            onChange={(e) => handleFilterChange('company', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min score"
              value={filters.minScore}
              onChange={(e) => handleFilterChange('minScore', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              min="0"
              max="100"
            />
            <input
              type="number"
              placeholder="Max score"
              value={filters.maxScore}
              onChange={(e) => handleFilterChange('maxScore', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              min="0"
              max="100"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Clear
          </button>
        </div>
      </div>
      
      {history.map((generation) => (
        <div
          key={generation.id}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {generation.original_filename}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(
                    generation.ats_score
                  )}`}
                >
                  {Math.round(generation.ats_score)}% ATS Score
                </span>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {generation.jobs?.title && generation.jobs?.company ? (
                  <span><strong>{generation.jobs.title}</strong> at <strong>{generation.jobs.company}</strong></span>
                ) : generation.jobs?.title ? (
                  <span><strong>{generation.jobs.title}</strong></span>
                ) : generation.jobs?.company ? (
                  <span>Position at <strong>{generation.jobs.company}</strong></span>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">No job details provided</span>
                )}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Created: {formatDate(generation.created_at)}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => toggleJobDescription(generation.id)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className={`w-4 h-4 mr-2 transition-transform ${expandedJobs.has(generation.id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {expandedJobs.has(generation.id) ? 'Hide' : 'View'} Job
              </button>
              
              <button
                onClick={() => handleDownload(generation)}
                disabled={generating === generation.id}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {generating === generation.id ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
          
          {expandedJobs.has(generation.id) && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Job Description:</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-sm text-gray-700 dark:text-gray-300 max-h-60 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">{generation.jobs?.description || 'No job description available'}</pre>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => fetchHistory(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => fetchHistory(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}