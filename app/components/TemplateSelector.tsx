"use client";
import React from "react";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  disabled?: boolean;
}

const templates = [
  {
    id: "resume_template_7.html",
    name: "Elegant",
    description: "Modern, clean design with subtle styling",
    preview: "🎨"
  },
  {
    id: "resume_template_10.html", 
    name: "Classic",
    description: "Traditional, professional format",
    preview: "📄"
  }
];

export default function TemplateSelector({
  selectedTemplate,
  onTemplateChange,
  disabled = false
}: TemplateSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Resume Template
      </label>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onTemplateChange(template.id)}
            disabled={disabled}
            className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedTemplate === template.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{template.preview}</span>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {template.description}
                </p>
              </div>
            </div>
            {selectedTemplate === template.id && (
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Selected
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}