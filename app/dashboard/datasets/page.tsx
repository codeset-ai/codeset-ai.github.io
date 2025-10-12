"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ApiService, Dataset, Sample } from '@/lib/api';
import { Database, FileText, Calendar, Tag, Code, Eye } from 'lucide-react';
import { toast } from 'sonner';
import SampleDetailsModal from '@/components/SampleDetailsModal';

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

  if (!user) return null;

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Datasets</h1>
          <p className="text-gray-600">
            Browse available datasets and their samples.
          </p>
        </div>
      </div>

      {/* Dataset Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="text-blue-600" size={20} />
          <h3 className="text-lg font-medium text-gray-900">Select Dataset</h3>
        </div>
        
        {loadingDatasets ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading datasets...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {datasets.map((dataset) => (
                <option key={dataset.name} value={dataset.name}>
                  {dataset.name}
                </option>
              ))}
            </select>
            
            {selectedDatasetInfo && (
              <div className="text-sm text-gray-600">
                {selectedDatasetInfo.description && (
                  <p className="mb-2">{selectedDatasetInfo.description}</p>
                )}
                <div className="flex items-center space-x-4">
                  {selectedDatasetInfo.sample_count !== undefined && (
                    <span className="flex items-center space-x-1">
                      <FileText size={14} />
                      <span>{selectedDatasetInfo.sample_count} samples</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Samples List */}
      {selectedDataset && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <FileText className="text-green-600" size={20} />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Samples in {selectedDataset}
                </h3>
                <p className="text-sm text-gray-500">
                  {loadingSamples ? 'Loading...' : `${samples.length} sample${samples.length !== 1 ? 's' : ''} found`}
                </p>
              </div>
            </div>
          </div>

          {loadingSamples ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
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
                        {sample.version && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            v{sample.version}
                          </span>
                        )}
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
