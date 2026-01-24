import React, { useState, useEffect } from 'react';
import { Code2, Users, Box, Download, Upload, LogOut, User } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import ProgressBar from './components/ProgressBar';
import DSASection from './components/DSASection';
import LeadershipPrinciplesSection from './components/LeadershipPrinciplesSection';
import LLDSection from './components/LLDSection';
import { exportAllData } from './utils/userStorage';
import { importAllData } from './utils/storage';
import { getDSAProblems } from './utils/storage';

function App() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dsa');
  const [dsaData, setDsaData] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadDSAData();
    } else {
      setDsaData(getDSAProblems());
    }
  }, [currentUser]);

  // Close profile menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showProfileMenu]);

  const loadDSAData = async () => {
    if (currentUser) {
      const { getDSAProblems } = await import('./utils/userStorage');
      const data = await getDSAProblems(currentUser.uid);
      setDsaData(data);
    }
  };

  const handleDSAUpdate = async () => {
    if (currentUser) {
      await loadDSAData();
    } else {
      setDsaData(getDSAProblems());
    }
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportAllData(currentUser?.uid || null);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `amazon-prep-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
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

  if (!currentUser) {
    return <Login />;
  }

  const tabs = [
    { id: 'dsa', label: 'DSA Problems', icon: Code2 },
    { id: 'behavioral', label: 'Leadership Principles', icon: Users },
    { id: 'lld', label: 'LLD Lab', icon: Box }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="bg-zinc-950 border-b border-zinc-900/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">Amazon Interview Prep Dashboard</h1>
              <p className="text-sm text-zinc-400 mt-1">
                Track your progress across DSA, Behavioral, and LLD
                {currentUser?.displayName && (
                  <span className="ml-2 text-blue-400">
                    • Welcome back, {currentUser.displayName.split(' ')[0]}!
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-zinc-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export Backup</span>
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-100 rounded-lg transition-colors flex items-center gap-2 border border-zinc-900"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import Backup</span>
              </button>
              
              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors border border-zinc-800"
                  aria-label="Profile menu"
                >
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Profile'}
                      className="w-8 h-8 rounded-full border-2 border-zinc-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-zinc-400" />
                    </div>
                  )}
                  <span className="hidden md:inline text-sm text-zinc-300">
                    {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                  </span>
                </button>

                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-20 overflow-hidden">
                      <div className="p-4 border-b border-zinc-800">
                        <div className="flex items-center gap-3">
                          {currentUser?.photoURL ? (
                            <img
                              src={currentUser.photoURL}
                              alt={currentUser.displayName || 'Profile'}
                              className="w-12 h-12 rounded-full border-2 border-zinc-700"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
                              <User className="w-6 h-6 text-zinc-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-100 truncate">
                              {currentUser?.displayName || 'User'}
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                              {currentUser?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressBar dsaData={dsaData} refreshTrigger={refreshTrigger} />

        <div className="flex flex-wrap gap-2 mb-6 border-b border-zinc-800/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 flex items-center gap-2 font-semibold transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div>
          {activeTab === 'dsa' && <DSASection onDataUpdate={handleDSAUpdate} userId={currentUser?.uid} />}
          {activeTab === 'behavioral' && <LeadershipPrinciplesSection userId={currentUser?.uid} />}
          {activeTab === 'lld' && <LLDSection userId={currentUser?.uid} />}
        </div>
      </main>
    </div>
  );
}

export default App;
