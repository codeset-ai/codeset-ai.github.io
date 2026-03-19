'use client';

import { useState, useEffect } from 'react';
import { ApiService, Dataset, Sample } from '@/lib/api';
import { Database, FileText, Calendar, Tag, Code, Eye, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import SampleDetailsModal from '@/components/SampleDetailsModal';

export default function DashboardDatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalSamples, setTotalSamples] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const datasetsData = await ApiService.getDatasets();
        setDatasets(datasetsData);
        if (datasetsData.length > 0) {
          setSelectedDataset(datasetsData[0].name);
          setCurrentPage(1);
          setSearchQuery('');
          setDebouncedSearchQuery('');
        }
      } catch (error) {
        console.error('Failed to load datasets:', error);
        toast.error('Failed to load datasets');
      } finally {
        setLoadingDatasets(false);
      }
    };

    loadDatasets();
  }, []);

  useEffect(() => {
    const loadSamples = async () => {
      if (!selectedDataset) return;

      setLoadingSamples(true);
      try {
        const response = await ApiService.getSamples(selectedDataset, currentPage, pageSize, debouncedSearchQuery);
        setSamples(response.samples);
        setTotalSamples(response.total_count || 0);
      } catch (error) {
        console.error('Failed to load samples:', error);
        toast.error('Failed to load samples');
      } finally {
        setLoadingSamples(false);
      }
    };

    loadSamples();
  }, [selectedDataset, currentPage, pageSize, debouncedSearchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSampleClick = (sample: Sample) => {
    setSelectedSample(sample);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalSamples / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalSamples);

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

  const selectedDatasetInfo = datasets.find((d) => d.name === selectedDataset);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Datasets</h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Browse the datasets available to evaluate code agents on the platform.
        </p>
      </div>

      {loadingDatasets ? (
        <div className="flex items-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6366F1]" />
          <span>Loading datasets...</span>
        </div>
      ) : datasets.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-gray-200 bg-white">
          <Database size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No datasets found</h4>
          <p className="text-gray-600">There are no datasets available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select dataset</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {datasets.map((dataset) => (
                <button
                  key={dataset.name}
                  onClick={() => {
                    setSelectedDataset(dataset.name);
                    setCurrentPage(1);
                    setSearchQuery('');
                    setDebouncedSearchQuery('');
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedDataset === dataset.name
                      ? 'border-[#6366F1] bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Database size={20} className="text-gray-400" />
                    <h3 className="font-medium text-gray-900">{dataset.name}</h3>
                  </div>
                  {dataset.description && (
                    <p className="text-sm text-gray-600 mb-2">{dataset.description}</p>
                  )}
                  {dataset.sample_count != null && (
                    <p className="text-xs text-gray-500">{dataset.sample_count} samples</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {selectedDataset && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedDatasetInfo?.name ?? selectedDataset}
                    </h3>
                    {selectedDatasetInfo?.description && (
                      <p className="text-sm text-gray-600 mt-1">{selectedDatasetInfo.description}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {totalSamples > 0 ? `${startIndex}-${endIndex} of ${totalSamples} samples` : '0 samples'}
                  </div>
                </div>

                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by instance ID..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {loadingSamples ? (
                <div className="p-8 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6366F1]" />
                    <span>Loading samples...</span>
                  </div>
                </div>
              ) : samples.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {samples.map((sample) => (
                    <div
                      key={sample.sample_id}
                      className="group p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleSampleClick(sample)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText size={16} className="text-gray-400" />
                            <h4 className="text-lg font-medium text-gray-900 truncate">{sample.sample_id}</h4>
                            <span
                              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getLanguageColor(sample.language)}`}
                            >
                              <Code size={12} className="mr-1" />
                              {sample.language}
                            </span>
                          </div>

                          {sample.description && (
                            <p className="text-sm text-gray-600 mb-3">{sample.description}</p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Tag size={14} />
                                <span>{sample.dataset}</span>
                              </span>
                              {sample.created_at && (
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  <span>Created {formatDate(sample.created_at)}</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye size={14} />
                              <span>View details</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No samples found</h4>
                  <p className="text-gray-600">This dataset has no samples yet.</p>
                </div>
              )}

              {samples.length > 0 && totalPages > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label htmlFor="page-size" className="text-sm text-gray-700">
                        Show:
                      </label>
                      <select
                        id="page-size"
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-sm text-gray-700">per page</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          if (pageNum > totalPages) return null;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1 text-sm rounded ${
                                currentPage === pageNum
                                  ? 'bg-[#6366F1] text-white'
                                  : 'border border-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <SampleDetailsModal
        sample={selectedSample}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSample(null);
        }}
      />
    </div>
  );
}
