"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ApiService, Dataset, Sample } from '@/lib/api';
import { Database, FileText, Calendar, Tag, Code, Eye } from 'lucide-react';
import { toast } from 'sonner';
import SampleDetailsModal from '@/components/SampleDetailsModal';
import LandingLayout from '../landing-layout';

export default function DatasetsPage() {
  const { user } = useAuth();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [loadingDatasets, setLoadingDatasets] = useState(true);
  const [loadingSamples, setLoadingSamples] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const datasetsData = await ApiService.getDatasets();
        setDatasets(datasetsData);
        if (datasetsData.length > 0) {
          setSelectedDataset(datasetsData[0].name);
        }
      } catch (error) {
        console.error('Failed to load datasets:', error);
        toast.error('Failed to load datasets');
      } finally {
        setLoadingDatasets(false);
      }
    };

    if (user) {
      loadDatasets();
    }
  }, [user]);

  useEffect(() => {
    const loadSamples = async () => {
      if (!selectedDataset) return;

      setLoadingSamples(true);
      try {
        const samplesData = await ApiService.getSamples(selectedDataset);
        console.log(samplesData);
        setSamples(samplesData);
      } catch (error) {
        console.error('Failed to load samples:', error);
        toast.error('Failed to load samples');
      } finally {
        setLoadingSamples(false);
      }
    };

    loadSamples();
  }, [selectedDataset]);

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

  const selectedDatasetInfo = datasets.find(d => d.name === selectedDataset);

  return (
    <LandingLayout>
      <div className="min-h-screen bg-white text-black font-mono py-24">
        <div className="max-w-6xl mx-auto px-8">
          <h1 className="text-4xl font-medium mb-8">Datasets</h1>
          <p className="text-gray-600 mb-12 max-w-2xl">
            Explore our collection of coding problems and solutions across different programming languages.
          </p>

          {!user ? (
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <Database size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in required</h3>
                <p className="text-gray-600 mb-4">
                  Please sign in to view datasets and samples.
                </p>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          ) : loadingDatasets ? (
            <div className="text-center py-16">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                <span className="text-gray-600">Loading datasets...</span>
              </div>
            </div>
          ) : datasets.length === 0 ? (
            <div className="text-center py-16">
              <Database size={48} className="mx-auto text-gray-300 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No datasets found</h4>
              <p className="text-gray-600">
                There are no datasets available at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Dataset Selection */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Select Dataset</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {datasets.map((dataset) => (
                    <button
                      key={dataset.name}
                      onClick={() => setSelectedDataset(dataset.name)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        selectedDataset === dataset.name
                          ? 'border-black bg-white'
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
                      {dataset.sample_count && (
                        <p className="text-xs text-gray-500">
                          {dataset.sample_count} samples
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Samples List */}
              {selectedDataset && (
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedDatasetInfo?.name || selectedDataset}
                        </h3>
                        {selectedDatasetInfo?.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedDatasetInfo.description}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {samples.length} samples
                      </div>
                    </div>
                  </div>

                  {loadingSamples ? (
                    <div className="p-8 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                        <span className="text-gray-600">Loading samples...</span>
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
                              <div className="flex items-center space-x-3 mb-2">
                                <FileText size={16} className="text-gray-400" />
                                <h4 className="text-lg font-medium text-gray-900 truncate">
                                  {sample.sample_id}
                                </h4>
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getLanguageColor(sample.language)}`}>
                                  <Code size={12} className="mr-1" />
                                  {sample.language}
                                </span>
                              </div>
                              
                              {sample.description && (
                                <p className="text-sm text-gray-600 mb-3">
                                  {sample.description}
                                </p>
                              )}
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <Tag size={14} />
                                    <span>{sample.dataset}</span>
                                  </span>
                                  {sample.created_at && (
                                    <span className="flex items-center space-x-1">
                                      <Calendar size={14} />
                                      <span>Created {formatDate(sample.created_at)}</span>
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Eye size={14} />
                                  <span>Click to see details</span>
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
                      <p className="text-gray-600">
                        This dataset doesn't contain any samples yet.
                      </p>
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
      </div>
    </LandingLayout>
  );
}
