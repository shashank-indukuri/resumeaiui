import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import DiffViewer from 'react-diff-viewer';

interface DiffProps {
  original: any;
  optimized: any;
}

const ResumeComparison: React.FC<DiffProps> = ({ original, optimized }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
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

  const capitalizeKey = (key: string): string => {
    return key
      .replace(/_/g, ' ') // Convert snake_case to spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const preprocessData = (data: any, indent = 0): string => {
    if (data === null || data === undefined) {
      return 'None';
    }

    if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
      return String(data);
    }

    if (Array.isArray(data)) {
      if (data.length === 0) return 'Empty list';
      
      // Check if array contains objects
      if (typeof data[0] === 'object' && data[0] !== null) {
        return data.map((item) => {
          const itemLines = Object.entries(item).map(([key, value]) => {
            const formattedKey = capitalizeKey(key);
            return `${'  '.repeat(indent + 1)}${formattedKey}: ${preprocessData(value, indent + 2)}`;
          });
          return itemLines.join('\n');
        }).join('\n\n');
      }
      
      return data.map((item) => {
        return `${'  '.repeat(indent + 1)}${preprocessData(item, indent + 1)}`;
      }).join('\n');
    }

    if (typeof data === 'object') {
      const uniqueEntries = Object.entries(data).reduce((acc, [key, value]) => {
        if (!acc.some(([k]) => k === key)) {
          acc.push([key, value]);
        }
        return acc;
      }, [] as [string, any][]);

      return uniqueEntries
        .map(([key, value]) => {
          const formattedKey = capitalizeKey(key);
          return `${'  '.repeat(indent)}${formattedKey}: ${preprocessData(value, indent + 1)}`;
        })
        .join('\n');
    }

    return 'Unknown type';
  };

  const sections = Object.keys(original || {}).filter(
    section => section !== '__typename' && typeof original[section] !== 'function'
  );

  if (!original || !optimized) {
    return null;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden mt-8">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 mb-4">
        <h2 className="text-lg font-semibold text-white">Resume Comparison</h2>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sections.map(section => (
          <div key={section} className="w-full py-4">
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
              <div className="p-4 mt-2">
                <DiffViewer
                  oldValue={preprocessData(original[section])}
                  newValue={preprocessData(optimized[section])}
                  splitView={true}
                  showDiffOnly={false}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeComparison;