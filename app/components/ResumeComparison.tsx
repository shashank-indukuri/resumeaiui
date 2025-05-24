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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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

  const getChangedSections = useMemo(() => {
    const sections = new Set<string>();
    
    const extractSection = (path: string) => {
      const match = path.match(/root\['([^']+)'\]/);
      return match ? match[1] : null;
    };

    Object.keys(changes.type_changes || {}).forEach(path => {
      const section = extractSection(path);
      if (section) sections.add(section);
    });

    Object.keys(changes.values_changed || {}).forEach(path => {
      const section = extractSection(path);
      if (section) sections.add(section);
    });

    Object.keys(changes.iterable_item_added || {}).forEach(path => {
      const section = extractSection(path);
      if (section) sections.add(section);
    });

    Object.keys(changes.iterable_item_removed || {}).forEach(path => {
      const section = extractSection(path);
      if (section) sections.add(section);
    });

    return Array.from(sections);
  }, [changes]);

  const renderValue = (value: any): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside">
          {value.map((item, index) => (
            <li key={index} className="ml-4">{renderValue(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="ml-4">
              <span className="font-medium">{key}: </span>
              {renderValue(val)}
            </div>
          ))}
        </div>
      );
    }
    return <span>{String(value)}</span>;
  };

  const isValueChanged = (section: string, key: string) => {
    const path = `root['${section}']${key ? `['${key}']` : ''}`;
    return (
      (changes.type_changes && path in changes.type_changes) ||
      (changes.values_changed && path in changes.values_changed) ||
      (changes.iterable_item_added && path in changes.iterable_item_added) ||
      (changes.iterable_item_removed && path in changes.iterable_item_removed)
    );
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden mt-8">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resume Comparison</h2>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {getChangedSections.map(section => (
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
                    isValueChanged(section, '') ? 'bg-green-50 dark:bg-green-900/20 p-2 rounded' : ''
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