import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import DiffViewer from 'react-diff-viewer';

type ResumeData = Record<string, unknown> | string | number | boolean | null | undefined;

interface DiffProps {
  original: Record<string, ResumeData>;
  optimized: Record<string, ResumeData>;
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

  const preprocessData = (data: ResumeData, indent = 0): string => {
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
            return `${'  '.repeat(indent + 1)}${formattedKey}: ${preprocessData(value as ResumeData, indent + 2)}`;
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
          acc.push([key, value as ResumeData]);
        }
        return acc;
      }, [] as [string, ResumeData][]);

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
    <div className="w-full vanara-card rounded-2xl shadow-xl overflow-hidden mt-8">
      <div className="p-6 vanara-gradient">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🐒</span>
          </div>
          <h2 className="text-xl font-bold text-white">Vanara Transformation Analysis</h2>
        </div>
        <p className="text-white/80 text-sm mt-2">Compare your original resume with the vanara-optimized version</p>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sections.map(section => (
          <div key={section} className="w-full">
            <button
              onClick={() => toggleSection(section)}
              className="w-full flex items-center justify-between p-6 hover:bg-[#F1F8E9]/30 dark:hover:bg-[#2D5A3D]/10 transition-colors group"
            >
              <h3 className="text-lg font-semibold text-[#2D5A3D] dark:text-[#F4A261] capitalize group-hover:text-[#2D5A3D] dark:group-hover:text-[#F4A261] transition-colors">
                {section.replace(/_/g, ' ')}
              </h3>
              {expandedSections.has(section) ? (
                <ChevronUpIcon className="w-5 h-5 text-[#2D5A3D] dark:text-[#F4A261]" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-[#2D5A3D] dark:text-[#F4A261]" />
              )}
            </button>
            
            {expandedSections.has(section) && (
              <div className="px-6 pb-6 bg-[#F1F8E9]/10 dark:bg-[#2D5A3D]/5">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <DiffViewer
                    oldValue={preprocessData(original[section])}
                    newValue={preprocessData(optimized[section])}
                    splitView={true}
                    showDiffOnly={false}
                    styles={{
                      variables: {
                        light: {
                          codeFoldGutterBackground: '#F1F8E9',
                          codeFoldBackground: '#F1F8E9',
                          addedBackground: '#E8F5E8',
                          removedBackground: '#FFEBEE',
                          wordAddedBackground: '#C8E6C9',
                          wordRemovedBackground: '#FFCDD2',
                          addedGutterBackground: '#2D5A3D',
                          removedGutterBackground: '#D32F2F',
                          gutterBackground: '#FAFAFA',
                          gutterBackgroundDark: '#F5F5F5',
                          highlightBackground: '#FFFBF0',
                          highlightGutterBackground: '#F4A261'
                        },
                        dark: {
                          codeFoldGutterBackground: '#2D5A3D',
                          codeFoldBackground: '#2D5A3D',
                          addedBackground: '#1B4332',
                          removedBackground: '#4A1A1A',
                          wordAddedBackground: '#2D5A3D',
                          wordRemovedBackground: '#6B1A1A',
                          addedGutterBackground: '#F4A261',
                          removedGutterBackground: '#E76F51',
                          gutterBackground: '#1F2937',
                          gutterBackgroundDark: '#111827',
                          highlightBackground: '#374151',
                          highlightGutterBackground: '#F4A261'
                        }
                      }
                    }}
                  />
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