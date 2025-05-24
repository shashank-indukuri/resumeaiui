import React, { useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface DiffChanges {
  type_changes?: Record<string, {
    old_type: string;
    new_type: string;
    old_value: any;
    new_value: any;
  }>;
  values_changed?: Record<string, {
    old_value: any;
    new_value: any;
  }>;
  iterable_item_added?: Record<string, any>;
  iterable_item_removed?: Record<string, any>;
}

interface DiffProps {
  original: any;
  optimized: any;
  changes: DiffChanges;
}

const ResumeComparison: React.FC<DiffProps> = ({ original, optimized, changes }) => {
  // Initialize with all sections expanded
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(Object.keys(original || {}))
  );

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const renderArray = (arr: any[]) => {
    return (
      <ul className="list-disc list-inside space-y-1">
        {arr.map((item, index) => (
          <li key={index} className="ml-4">
            {typeof item === 'object' ? renderValue(item) : String(item)}
          </li>
        ))}
      </ul>
    );
  };

  const renderObject = (obj: Record<string, any>) => {
    return (
      <div className="space-y-2">
        {Object.entries(obj).map(([key, value]) => (
          <div key={key} className="ml-4">
            <span className="font-medium capitalize">{key.replace(/_/g, ' ')}: </span>
            {renderValue(value)}
          </div>
        ))}
      </div>
    );
  };

  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">None</span>;
    }
    if (Array.isArray(value)) {
      return renderArray(value);
    }
    if (typeof value === 'object') {
      return renderObject(value);
    }
    return <span>{String(value)}</span>;
  };

  const isValueChanged = (section: string, key: string = '') => {
    const path = `root['${section}']${key ? `['${key}']` : ''}`;
    return (
      (changes.type_changes && path in changes.type_changes) ||
      (changes.values_changed && path in changes.values_changed) ||
      (changes.iterable_item_added && path in changes.iterable_item_added) ||
      (changes.iterable_item_removed && path in changes.iterable_item_removed)
    );
  };

  const sections = useMemo(() => {
    return Object.keys(original || {}).filter(section => 
      section !== '__typename' && 
      typeof original[section] !== 'function'
    );
  }, [original]);

  if (!original || !optimized) {
    return null;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden mt-8">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resume Comparison</h2>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sections.map(section => (
          <div key={section} className="w-full">
            <button
              onClick={() => toggleSection(section)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 capitalize">
                {section.replace(/_/g, ' ')}
              </h3>
              {expandedSections.has(section) ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.has(section) && (
              <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
                {/* Original Version */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Original Version</span>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    {renderValue(original[section])}
                  </div>
                </div>

                {/* Optimized Version */}
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Optimized Version</span>
                  </div>
                  <div className={`prose dark:prose-invert max-w-none ${
                    isValueChanged(section) ? 'bg-green-50 dark:bg-green-900/20 p-2 rounded' : ''
                  }`}>
                    {renderValue(optimized[section])}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeComparison;