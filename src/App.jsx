import React, { useState, useEffect, useCallback } from 'react';
import { Code2, Users, Box, Download, Upload, LogOut, User, Trophy } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import ProgressBar from './components/ProgressBar';
import DSASection from './components/DSASection';
import LeadershipPrinciplesSection from './components/LeadershipPrinciplesSection';
import LLDSection from './components/LLDSection';
import LeaderboardSection from './components/LeaderboardSection';
import RankNotification from './components/RankNotification';
import ScoreBreakdownModal from './components/ScoreBreakdownModal';
import { useScoreCenter } from './hooks/useScoreCenter';
import { exportAllData } from './utils/userStorage';
import { importAllData } from './utils/storage';
import { getDSAProblems } from './utils/storage';
import {
  getLeaderboard,
  updateLeaderboardEntry,
  getLeaderboardMeta,
  setLeaderboardMeta
} from './utils/firestoreStorage';

function App() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dsa');
  const [dsaData, setDsaData] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const [rankNotification, setRankNotification] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const { totalPoints, breakdown, streak, checkIn, dsaDoneCount, leadershipCount, lldCount } = useScoreCenter({
    dsaData,
    userId: currentUser?.uid ?? null,
    refreshTrigger
  });

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

  const processLeaderboard = useCallback(async (list, user, fallbackTotalPoints) => {
    setLeaderboard(list);
    setLeaderboardLoading(false);
    if (!user) {
      setUserRank(null);
      return;
    }
    const idx = list.findIndex((e) => e.userId === user.uid);
    const newRank = idx >= 0 ? idx + 1 : null;
    const myEntry = idx >= 0 ? list[idx] : null;
    const lastTotalPoints = myEntry?.totalPoints ?? fallbackTotalPoints ?? 0;
    setUserRank(newRank);

    let meta = null;
    try {
      meta = await getLeaderboardMeta(user.uid);
    } catch (_) {}

    if (meta != null && meta.lastRank != null && newRank != null) {
      if (newRank < meta.lastRank) {
        const surpassed = list.slice(newRank, meta.lastRank).map((e) => e.displayName || 'Anonymous');
        setRankNotification({
          type: 'rank_up',
          prevRank: meta.lastRank,
          newRank,
          surpassed,
          lastCompletedCount: lastTotalPoints
        });
        return;
      }
      if (newRank > meta.lastRank) {
        const above = list
          .slice(0, newRank - 1)
          .reverse()
          .slice(0, 3)
          .map((e) => e.displayName || 'Anonymous');
        setRankNotification({
          type: 'rank_down',
          prevRank: meta.lastRank,
          newRank,
          surpassedBy: above,
          lastCompletedCount: lastTotalPoints
        });
        return;
      }
    }
    if (newRank != null) {
      try {
        await setLeaderboardMeta(user.uid, { lastRank: newRank, lastCompletedCount: lastTotalPoints });
      } catch (_) {}
    }
  }, []);

  // Sync leaderboard entry when DSA, LP, LLD, streak, or points change, then fetch and process
  useEffect(() => {
    if (!currentUser) {
      setLeaderboardLoading(false);
      setLeaderboard([]);
      setUserRank(null);
      return;
    }
    const run = async () => {
      setLeaderboardLoading(true);
      try {
        await updateLeaderboardEntry(currentUser.uid, {
          displayName: currentUser.displayName || null,
          photoURL: currentUser.photoURL || null,
          dsaSolved: dsaDoneCount ?? 0,
          lpsFinished: leadershipCount ?? 0,
          lldsFinished: lldCount ?? 0,
          maxStreak: streak?.maxStreak ?? 0,
          totalPoints: totalPoints ?? 0
        });
      } catch (_) {}
      try {
        const list = await getLeaderboard();
        await processLeaderboard(list, currentUser, totalPoints);
      } catch (_) {
        setLeaderboard([]);
        setUserRank(null);
        setLeaderboardLoading(false);
      }
    };
    run();
  }, [currentUser, dsaData, processLeaderboard, totalPoints, dsaDoneCount, leadershipCount, lldCount, streak]);

  // Refetch leaderboard when opening the Leaderboard tab
  useEffect(() => {
    if (!currentUser || activeTab !== 'leaderboard') return;
    const run = async () => {
      setLeaderboardLoading(true);
      try {
        const list = await getLeaderboard();
        await processLeaderboard(list, currentUser, totalPoints);
      } catch (_) {
        setLeaderboardLoading(false);
      }
    };
    run();
  }, [currentUser, activeTab, processLeaderboard, totalPoints]);

  const handleRankNotificationDismiss = useCallback(async () => {
    if (!rankNotification || !currentUser) {
      setRankNotification(null);
      return;
    }
    try {
      await setLeaderboardMeta(currentUser.uid, {
        lastRank: rankNotification.newRank,
        lastCompletedCount: rankNotification.lastCompletedCount ?? 0
      });
    } catch (_) {}
    setRankNotification(null);
  }, [rankNotification, currentUser]);

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

  const handleLeadershipUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLldUpdate = () => {
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
    { id: 'lld', label: 'LLD Lab', icon: Box },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="bg-zinc-950 border-b border-zinc-900/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4">
          {/* Single row: title left, actions (incl. profile) right — profile always top-right on all screens */}
          <div className="flex flex-row items-center justify-between gap-2">
            {/* Title Section */}
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-zinc-100 truncate">
                Amazon Interview Prep
              </h1>
              <p className="text-[10px] sm:text-xs md:text-sm text-zinc-400 mt-0.5">
                <span className="hidden sm:inline">Track your progress across DSA, Behavioral, and LLD</span>
                <span className="sm:hidden">DSA • Behavioral • LLD</span>
                {currentUser?.displayName && (
                  <span className="hidden sm:inline ml-1 sm:ml-2 text-blue-400">
                    • {currentUser.displayName.split(' ')[0]}
                  </span>
                )}
              </p>
            </div>
            
            {/* Actions Section */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Export/Import - Show on small screens and up */}
              <button
                onClick={handleExport}
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-zinc-50 rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 min-h-[40px] sm:min-h-[44px] touch-manipulation"
                aria-label="Export backup"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="hidden md:inline text-sm">Export</span>
              </button>
              <button
                onClick={handleImport}
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-zinc-950 hover:bg-zinc-900 active:bg-zinc-800 text-zinc-100 rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 border border-zinc-900 min-h-[40px] sm:min-h-[44px] touch-manipulation"
                aria-label="Import backup"
              >
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="hidden md:inline text-sm">Import</span>
              </button>
              
              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1 sm:gap-1.5 sm:gap-2 px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-zinc-900 active:bg-zinc-800 transition-colors border border-zinc-800 min-h-[40px] sm:min-h-[44px] touch-manipulation"
                  aria-label="Profile menu"
                >
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Profile'}
                      className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full border-2 border-zinc-700 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-zinc-400" />
                    </div>
                  )}
                  <span className="hidden lg:inline text-sm text-zinc-300">
                    {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                  </span>
                </button>

                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-[calc(100vw-1rem)] max-w-[280px] sm:w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-20 overflow-hidden">
                      <div className="p-3 sm:p-4 border-b border-zinc-800">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {currentUser?.photoURL ? (
                            <img
                              src={currentUser.photoURL}
                              alt={currentUser.displayName || 'Profile'}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-zinc-700 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-zinc-100 truncate">
                              {currentUser?.displayName || 'User'}
                            </p>
                            <p className="text-[10px] sm:text-xs text-zinc-400 truncate">
                              {currentUser?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm text-zinc-300 hover:bg-zinc-800 active:bg-zinc-700 rounded-lg transition-colors flex items-center gap-2 min-h-[40px] sm:min-h-[44px] touch-manipulation"
                        >
                          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
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

      <main className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex-1 min-w-0">
            <ProgressBar
              dsaData={dsaData}
              refreshTrigger={refreshTrigger}
              totalPoints={totalPoints}
              onPointsClick={() => setShowScoreModal(true)}
            />
          </div>
          {userRank != null && (
            <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-200">Rank #{userRank}</span>
            </div>
          )}
        </div>

        {/* Tabs - Center on mobile, left-aligned on larger screens; scrollable on mobile */}
        <div className="overflow-x-auto -mx-2.5 sm:mx-0 mb-3 sm:mb-4 md:mb-6 border-b border-zinc-800/50 scrollbar-hide">
          <div className="flex justify-center sm:justify-start gap-0.5 sm:gap-1 md:gap-2 px-2.5 sm:px-0 min-w-max sm:min-w-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 flex items-center gap-1 sm:gap-1.5 md:gap-2 font-semibold text-xs sm:text-sm md:text-base transition-colors border-b-2 whitespace-nowrap min-h-[40px] sm:min-h-[44px] touch-manipulation ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-300 active:text-zinc-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-[11px]">
                    {tab.id === 'dsa' ? 'DSA' : tab.id === 'behavioral' ? 'LP' : tab.id === 'lld' ? 'LLD' : 'Board'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pb-4 sm:pb-0">
          {activeTab === 'dsa' && <DSASection onDataUpdate={handleDSAUpdate} userId={currentUser?.uid} />}
          {activeTab === 'behavioral' && (
            <LeadershipPrinciplesSection userId={currentUser?.uid} onDataUpdate={handleLeadershipUpdate} />
          )}
          {activeTab === 'lld' && (
            <LLDSection userId={currentUser?.uid} onDataUpdate={handleLldUpdate} />
          )}
          {activeTab === 'leaderboard' && (
            <LeaderboardSection
              leaderboard={leaderboard}
              currentUserId={currentUser?.uid}
              loading={leaderboardLoading}
              onOpenScoreModal={() => setShowScoreModal(true)}
            />
          )}
        </div>
      </main>

      {rankNotification && (
        <RankNotification
          type={rankNotification.type}
          prevRank={rankNotification.prevRank}
          newRank={rankNotification.newRank}
          surpassed={rankNotification.surpassed}
          surpassedBy={rankNotification.surpassedBy}
          onDismiss={handleRankNotificationDismiss}
        />
      )}

      {showScoreModal && (
        <ScoreBreakdownModal
          totalPoints={totalPoints}
          breakdown={breakdown}
          streak={streak}
          checkIn={checkIn}
          onClose={() => setShowScoreModal(false)}
        />
      )}
    </div>
  );
}

export default App;
