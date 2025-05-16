import React from "react";

interface ResumeUploaderProps {
  onFileChange: (file: File | null) => void;
  uploading: boolean;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onFileChange, uploading }) => {
  return (
    <div className="w-full max-w-md flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Resume (PDF)</label>
      <input
        type="file"
        accept="application/pdf"
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
        onChange={e => onFileChange(e.target.files?.[0] || null)}
        disabled={uploading}
      />
    </div>
  );
};

export default ResumeUploader;
