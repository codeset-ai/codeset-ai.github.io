"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sample } from "@/lib/api";
import { Calendar, Code, GitBranch, Hash, FileText, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SampleDetailsModalProps {
  sample: Sample | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SampleDetailsModal({ sample, isOpen, onClose }: SampleDetailsModalProps) {
  const [expandedTests, setExpandedTests] = useState<{
    failToPass: boolean;
    passToPass: boolean;
    failToFail: boolean;
  }>({
    failToPass: false,
    passToPass: false,
    failToFail: false,
  });

  if (!sample) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      python: 'bg-blue-100 text-blue-800',
      javascript: 'bg-yellow-100 text-yellow-800',
      typescript: 'bg-blue-100 text-blue-800',
      java: 'bg-orange-100 text-orange-800',
      cpp: 'bg-purple-100 text-purple-800',
      c: 'bg-gray-100 text-gray-800',
      rust: 'bg-orange-100 text-orange-800',
      go: 'bg-cyan-100 text-cyan-800',
    };
    return colors[language.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const parseDiff = (diff: string) => {
    const lines = diff.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('+')) {
        return { type: 'addition', content: line, lineNumber: index + 1 };
      } else if (line.startsWith('-')) {
        return { type: 'deletion', content: line, lineNumber: index + 1 };
      } else if (line.startsWith('@@')) {
        return { type: 'header', content: line, lineNumber: index + 1 };
      } else {
        return { type: 'context', content: line, lineNumber: index + 1 };
      }
    });
  };

  const DiffHighlighter = ({ diff, language }: { diff: string; language: string }) => {
    const parsedDiff = parseDiff(diff);
    
    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-600 shadow-lg">
        <div className="bg-gray-800 px-4 py-3 text-sm text-gray-300 border-b border-gray-700 font-medium">
          Diff - {language}
        </div>
        <div className="overflow-x-auto">
          <div className="text-sm">
            {parsedDiff.map((line, index) => (
              <div
                key={index}
                className={`px-4 py-1.5 flex ${
                  line.type === 'addition'
                    ? 'bg-green-900 text-green-100'
                    : line.type === 'deletion'
                    ? 'bg-red-900 text-red-100'
                    : line.type === 'header'
                    ? 'bg-blue-900 text-blue-100 font-semibold'
                    : 'text-gray-300'
                }`}
              >
                <span className="w-12 text-gray-500 text-xs mr-4 flex-shrink-0">
                  {line.lineNumber}
                </span>
                <span className="break-all font-mono">{line.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const CodeHighlighter = ({ code, language }: { code: string; language: string }) => {
    const getLanguageFromExtension = (lang: string) => {
      const langMap: { [key: string]: string } = {
        python: 'python',
        javascript: 'javascript',
        typescript: 'typescript',
        java: 'java',
        cpp: 'cpp',
        c: 'c',
        rust: 'rust',
        go: 'go',
      };
      return langMap[lang.toLowerCase()] || 'text';
    };

    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-600 shadow-lg">
        <div className="bg-gray-800 px-4 py-3 text-sm text-gray-300 border-b border-gray-700 font-medium">
          {language}
        </div>
        <SyntaxHighlighter
          language={getLanguageFromExtension(language)}
          style={tomorrow}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
          showLineNumbers
          wrapLines
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  const toggleTestExpansion = (testType: keyof typeof expandedTests) => {
    setExpandedTests(prev => ({
      ...prev,
      [testType]: !prev[testType]
    }));
  };

  const TestList = ({ tests, testType, color, icon: Icon }: {
    tests: string[];
    testType: keyof typeof expandedTests;
    color: string;
    icon: React.ComponentType<any>;
  }) => {
    const isExpanded = expandedTests[testType];
    
    return (
      <div className={`${color} p-4 rounded-lg`}>
        <div 
          className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => toggleTestExpansion(testType)}
        >
          <Icon size={16} className={color.includes('red') ? 'text-red-600' : color.includes('green') ? 'text-green-600' : 'text-yellow-600'} />
          <span className="font-medium">
            {testType === 'failToPass' ? 'Fail to Pass' : 
             testType === 'passToPass' ? 'Pass to Pass' : 'Fail to Fail'}
          </span>
          <span className="text-sm opacity-75">
            ({tests.length} tests)
          </span>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
        
        {isExpanded && (
          <div className="mt-3 max-h-60 overflow-y-auto">
            <div className="space-y-1">
              {tests.map((test, index) => (
                <div key={index} className="text-sm font-mono bg-white bg-opacity-50 p-2 rounded border-l-2 border-current break-words">
                  {test}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-7xl max-h-[90vh] overflow-y-auto border-2 border-gray-300">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="flex items-center gap-3">
            <FileText size={20} />
            <span className="truncate">{sample.sample_id}</span>
            <Badge className={getLanguageColor(sample.language)}>
              {sample.language}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Problem Statement</h4>
                <p className="text-sm text-gray-600">{sample.problem_statement}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Repository</h4>
                <div className="flex items-center gap-2">
                  <GitBranch size={14} />
                  <span className="text-sm text-gray-600">{sample.repo}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Base Commit</h4>
                <div className="flex items-center gap-2">
                  <Hash size={14} />
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {sample.base_commit.substring(0, 8)}
                  </code>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Version</h4>
                <Badge variant="outline">v{sample.version}</Badge>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Created</h4>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span className="text-sm text-gray-600">{formatDate(sample.created_at)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Verifier</h4>
                <Badge variant="secondary">{sample.verifier}</Badge>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                <Badge className={sample.latest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {sample.latest ? 'Latest' : 'Outdated'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Test Results</h4>
            <div className="space-y-4">
              <TestList
                tests={sample.fail_to_pass}
                testType="failToPass"
                color="bg-red-50 text-red-900"
                icon={XCircle}
              />
              <TestList
                tests={sample.pass_to_pass}
                testType="passToPass"
                color="bg-green-50 text-green-900"
                icon={CheckCircle}
              />
              <TestList
                tests={sample.fail_to_fail}
                testType="failToFail"
                color="bg-yellow-50 text-yellow-900"
                icon={AlertCircle}
              />
            </div>
          </div>

          {/* Code Patches */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Code Changes</h4>
            
            {sample.patch && (
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Main Patch</h5>
                <DiffHighlighter diff={sample.patch} language={sample.language} />
              </div>
            )}

            {sample.non_code_patch && (
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Non-Code Patch</h5>
                <DiffHighlighter diff={sample.non_code_patch} language={sample.language} />
              </div>
            )}

            {sample.test_patch && (
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Test Patch</h5>
                <DiffHighlighter diff={sample.test_patch} language={sample.language} />
              </div>
            )}
          </div>

          {/* Hints */}
          {sample.hints_text && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Hints</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">{sample.hints_text}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
