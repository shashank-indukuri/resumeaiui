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

  const getChangeType = (path: string) => {
    if (changes.type_changes?.[path]) return 'modified';
    if (changes.values_changed?.[path]) return 'modified';
    if (changes.iterable_item_added?.[path]) return 'added';
    if (changes.iterable_item_removed?.[path]) return 'removed';
    return null;
  };

  const renderValue = (value: any, path: string = ''): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">None</span>;
    }

    const changeType = getChangeType(path);
    const changeStyles = {
      added: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-1 rounded',
      removed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-1 rounded line-through',
      modified: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-1 rounded'
    };

    if (Array.isArray(value)) {
      return (
        <ul className="space-y-2">
          {value.map((item, index) => {
            const itemPath = `${path}[${index}]`;
            const itemChangeType = getChangeType(itemPath);
            return (
              <li 
                key={index}
                className={`ml-4 ${itemChangeType ? changeStyles[itemChangeType] : ''}`}
              >
                {typeof item === 'object' ? 
                  renderValue(item, itemPath) : 
                  <span>{String(item)}</span>
                }
              </li>
            );
          })}
        </ul>
      );
    }

    if (typeof value === 'object') {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([key, val]) => {
            const newPath = path ? `${path}['${key}']` : `root['${key}']`;
            const fieldChangeType = getChangeType(newPath);
            return (
              <div 
                key={key} 
                className={`ml-4 ${fieldChangeType ? changeStyles[fieldChangeType] : ''}`}
              >
                <span className="font-medium capitalize">{key.replace(/_/g, ' ')}: </span>
                {renderValue(val, newPath)}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <span className={changeType ? changeStyles[changeType] : ''}>
        {String(value)}
      </span>
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
      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
        <h2 className="text-lg font-semibold text-white">Resume Comparison</h2>
        <div className="flex gap-4 mt-2 text-sm text-white/90">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
            <span>Added</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span>Removed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span>Modified</span>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sections.map(section => (
          <div key={section} className="w-full">
            <button
              onClick={() => toggleSection(section)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 capitalize flex items-center gap-2">
                {section.replace(/_/g, ' ')}
                {getChangeType(`root['${section}']`) && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    Changed
                  </span>
                )}
              </h3>
              {expandedSections.has(section) ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedSections.has(section) && (
              <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Original Version</span>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    {renderValue(original[section], `root['${section}']`)}
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Optimized Version</span>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    {renderValue(optimized[section], `root['${section}']`)}
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