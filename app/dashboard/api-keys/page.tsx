"use client"

import { useAuth } from '@/contexts/AuthContext';
import { ApiService } from '@/lib/api';
import { useState } from 'react';
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ApiKeysPage() {
  const { user, refreshUser } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [revokingKeys, setRevokingKeys] = useState<Set<string>>(new Set());
  const [revokeConfirmDialog, setRevokeConfirmDialog] = useState<{
    keyId: string;
    keyName: string;
  } | null>(null);
  const [showRevokedKeys, setShowRevokedKeys] = useState(false);

  if (!user) return null;

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    setIsCreating(true);
    try {
      const newKey = await ApiService.createApiKey(newKeyName);
      setNewlyCreatedKey(newKey.key);
      setNewKeyName('');
      setShowNewKeyDialog(false);
      await refreshUser();
      toast.success('API key created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create API key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!revokeConfirmDialog) return;

    const newRevokingKeys = new Set(revokingKeys);
    newRevokingKeys.add(keyId);
    setRevokingKeys(newRevokingKeys);

    try {
      await ApiService.revokeApiKey(keyId);
      await refreshUser();
      toast.success('API key revoked successfully!');
      setRevokeConfirmDialog(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to revoke API key');
    } finally {
      const updatedRevokingKeys = new Set(revokingKeys);
      updatedRevokingKeys.delete(keyId);
      setRevokingKeys(updatedRevokingKeys);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('API key copied to clipboard');
    } catch {
      toast.error('Failed to copy API key');
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 12) + '•'.repeat(key.length - 16) + key.substring(key.length - 4);
  };

  // Separate active and revoked keys
  const activeKeys = user.api_keys.filter(key => key.is_active);
  const revokedKeys = user.api_keys.filter(key => !key.is_active);

  const renderApiKey = (apiKey: any, showRevoke: boolean = true) => (
    <div key={apiKey.key_id} className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <Key size={16} className="text-gray-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {apiKey.name || 'Unnamed Key'}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Created {formatDate(apiKey.created_at)}</span>
                {apiKey.last_used_at && (
                  <span>Last used {formatDate(apiKey.last_used_at)}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-50 rounded p-3 font-mono text-sm">
                {visibleKeys.has(apiKey.key_id)
                  ? apiKey.key
                  : maskApiKey(apiKey.key)}
              </div>
              <button
                onClick={() => toggleKeyVisibility(apiKey.key_id)}
                className="p-2 text-gray-400 hover:text-gray-600"
                title={visibleKeys.has(apiKey.key_id) ? 'Hide key' : 'Show key'}
              >
                {visibleKeys.has(apiKey.key_id) ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(apiKey.key)}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Copy API key"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              apiKey.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {apiKey.is_active ? 'Active' : 'Revoked'}
          </span>
          {showRevoke && apiKey.is_active && (
            <button
              onClick={() => setRevokeConfirmDialog({
                keyId: apiKey.key_id,
                keyName: apiKey.name || 'Unnamed Key'
              })}
              disabled={revokingKeys.has(apiKey.key_id)}
              className="p-2 text-red-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Revoke API key"
            >
              {revokingKeys.has(apiKey.key_id) ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">API Keys</h1>
          <p className="text-gray-600">
            Manage your API keys for accessing the Codeset API.
          </p>
        </div>
        <button
          onClick={() => setShowNewKeyDialog(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          <span>Create API Key</span>
        </button>
      </div>

      {/* New Key Alert */}
      {newlyCreatedKey && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Key className="text-green-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800">
                API Key Created Successfully
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Make sure to copy your API key now. You won't be able to see it again!
              </p>
              <div className="mt-3 bg-green-100 rounded p-3">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-green-800 break-all">
                    {newlyCreatedKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(newlyCreatedKey)}
                    className="ml-2 flex-shrink-0 p-1 text-green-600 hover:text-green-800"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setNewlyCreatedKey(null)}
                className="mt-2 text-sm text-green-600 hover:text-green-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active API Keys */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Active API Keys</h3>
          <p className="text-sm text-gray-500">These keys can be used to access the API</p>
        </div>

        {activeKeys.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {activeKeys.map((apiKey) => renderApiKey(apiKey, true))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Key size={48} className="mx-auto text-gray-300 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No active API keys</h4>
            <p className="text-gray-600 mb-6">
              Create your first API key to start using the Codeset API.
            </p>
            <button
              onClick={() => setShowNewKeyDialog(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} />
              <span>Create API Key</span>
            </button>
          </div>
        )}
      </div>

      {/* Revoked API Keys */}
      {revokedKeys.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div
            className="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setShowRevokedKeys(!showRevokedKeys)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Revoked API Keys</h3>
                <p className="text-sm text-gray-500">
                  {revokedKeys.length} revoked key{revokedKeys.length !== 1 ? 's' : ''} - these keys cannot access the API
                </p>
              </div>
              <button className="text-gray-400">
                {showRevokedKeys ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {showRevokedKeys && (
            <div className="divide-y divide-gray-200">
              {revokedKeys.map((apiKey) => renderApiKey(apiKey, false))}
            </div>
          )}
        </div>
      )}

      {/* Create Key Dialog */}
      {showNewKeyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New API Key
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="keyName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API, Development"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Choose a descriptive name to identify this API key.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowNewKeyDialog(false);
                  setNewKeyName('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={isCreating || !newKeyName.trim()}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create API Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Dialog */}
      {revokeConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Revoke API Key
                </h3>
                <p className="text-sm text-gray-500">
                  The key will be disabled but remain visible for audit purposes.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to revoke the API key "{revokeConfirmDialog.keyName}"?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Any applications using this API key will lose access immediately. The key will be moved to the revoked keys section.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRevokeConfirmDialog(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRevokeKey(revokeConfirmDialog.keyId)}
                disabled={revokingKeys.has(revokeConfirmDialog.keyId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {revokingKeys.has(revokeConfirmDialog.keyId) ? 'Revoking...' : 'Revoke API Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}