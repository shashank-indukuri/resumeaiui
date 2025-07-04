"use client";
import React from "react";

interface JobDetailsInputProps {
  jobTitle: string;
  company: string;
  jobDescription: string;
  onJobTitleChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  disabled?: boolean;
}

export default function JobDetailsInput({
  jobTitle,
  company,
  jobDescription,
  onJobTitleChange,
  onCompanyChange,
  onJobDescriptionChange,
  disabled = false,
}: JobDetailsInputProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="job-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Job Title (Optional)
          </label>
          <input
            id="job-title"
            type="text"
            value={jobTitle}
            onChange={(e) => onJobTitleChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g., Senior Software Engineer"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company (Optional)
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => onCompanyChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g., Google, Microsoft"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Job Description *
        </label>
        <textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste the complete job description here..."
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-vertical"
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Include requirements, responsibilities, and qualifications for best results
        </p>
      </div>
    </div>
  );
}