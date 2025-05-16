import React from "react";

interface JobDescInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const JobDescInput: React.FC<JobDescInputProps> = ({ value, onChange, disabled }) => (
  <div className="w-full max-w-md flex flex-col gap-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job Description</label>
    <textarea
      className="resize-none rounded-lg border border-gray-300 dark:border-gray-700 p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Paste the job description here..."
      disabled={disabled}
    />
  </div>
);

export default JobDescInput;
