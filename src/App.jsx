import React, { useState } from 'react';
import { Code2, Users, Box, Download, Upload } from 'lucide-react';
import ProgressBar from './components/ProgressBar';
import DSASection from './components/DSASection';
import LeadershipPrinciplesSection from './components/LeadershipPrinciplesSection';
import LLDSection from './components/LLDSection';
import { exportAllData, importAllData } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState('dsa');

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amazon-prep-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            importAllData(data);
            alert('Data imported successfully! Please refresh the page.');
            window.location.reload();
          } catch (error) {
            alert('Error importing data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const tabs = [
    { id: 'dsa', label: 'DSA Problems', icon: Code2 },
    { id: 'behavioral', label: 'Leadership Principles', icon: Users },
    { id: 'lld', label: 'LLD Lab', icon: Box }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Amazon Interview Prep Dashboard</h1>
              <p className="text-sm text-zinc-400 mt-1">Track your progress across DSA, Behavioral, and LLD</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Backup
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import Backup
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <ProgressBar />

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-zinc-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 flex items-center gap-2 font-semibold transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-zinc-400 hover:text-zinc-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'dsa' && <DSASection />}
          {activeTab === 'behavioral' && <LeadershipPrinciplesSection />}
          {activeTab === 'lld' && <LLDSection />}
        </div>
      </main>
    </div>
  );
}

export default App;
