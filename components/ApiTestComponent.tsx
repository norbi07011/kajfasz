/**
 * API Connection Test Component
 * Simple component to test API connectivity and configuration
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../src/api/client';

interface HealthStatus {
  status: 'testing' | 'healthy' | 'unhealthy';
  timestamp: string;
  error?: string;
  responseTime?: number;
}

export const ApiTestComponent: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus>({ 
    status: 'testing', 
    timestamp: new Date().toISOString() 
  });

  const testConnection = async () => {
    setHealth({ status: 'testing', timestamp: new Date().toISOString() });
    
    const startTime = Date.now();
    
    try {
      await apiClient.healthCheck();
      const responseTime = Date.now() - startTime;
      
      setHealth({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        responseTime
      });
    } catch (error) {
      setHealth({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusColor = () => {
    switch (health.status) {
      case 'healthy': return 'text-green-500';
      case 'unhealthy': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusIcon = () => {
    switch (health.status) {
      case 'healthy': return '✅';
      case 'unhealthy': return '❌';
      default: return '🔄';
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-3">API Connection Status</h3>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getStatusIcon()}</span>
          <span className={`font-medium ${getStatusColor()}`}>
            {health.status.toUpperCase()}
          </span>
        </div>
        
        <div className="text-sm text-gray-300">
          <p>Last check: {new Date(health.timestamp).toLocaleTimeString()}</p>
          {health.responseTime && (
            <p>Response time: {health.responseTime}ms</p>
          )}
          {health.error && (
            <p className="text-red-400">Error: {health.error}</p>
          )}
        </div>
        
        <button
          onClick={testConnection}
          disabled={health.status === 'testing'}
          className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm"
        >
          {health.status === 'testing' ? 'Testing...' : 'Test Again'}
        </button>
      </div>
    </div>
  );
};

export default ApiTestComponent;