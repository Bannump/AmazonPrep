import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Clock, CheckCircle2, Circle, X, XCircle } from 'lucide-react';
import { problems } from '../data/problems';
import * as userStorage from '../utils/userStorage';

const DSASection = ({ onDataUpdate, userId = null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dsaData, setDsaData] = useState({});
  const [activeTimers, setActiveTimers] = useState({});
  const [showSolutionModal, setShowSolutionModal] = useState(null);
  const [solutionText, setSolutionText] = useState('');
  const [pendingTimeTaken, setPendingTimeTaken] = useState(null);

  useEffect(() => {
    loadData();
    loadTimers();
    // Update timers every second
    const interval = setInterval(() => {
      loadTimers();
    }, 1000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadData = async () => {
    const data = await userStorage.getDSAProblems(userId);
    setDsaData(data);
    // Notify parent component of data update
    if (onDataUpdate) {
      onDataUpdate();
    }
  };

  const loadTimers = async () => {
    const timers = await userStorage.getActiveTimers(userId);
    setActiveTimers(timers);
  };

  const getLeetCodeUrl = (title) => {
    // Convert to lowercase, replace spaces with hyphens, remove special characters
    const slug = title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[()',]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
    return `https://leetcode.com/problems/${slug}/`;
  };

  const handlePractice = async (problemId) => {
    const problem = problems.find(p => p.id === problemId);
    if (!problem) return;

    const url = getLeetCodeUrl(problem.title);
    window.open(url, '_blank');

    // Start timer
    const startTime = Date.now();
    await userStorage.saveActiveTimer(problemId, startTime, userId);
    setActiveTimers({ ...activeTimers, [problemId]: startTime });
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getElapsedTime = (problemId) => {
    const startTime = activeTimers[problemId];
    if (!startTime) return null;
    return Date.now() - startTime;
  };

  const handleCancelTimer = async (problemId) => {
    await userStorage.removeActiveTimer(problemId, userId);
    const newTimers = { ...activeTimers };
    delete newTimers[problemId];
    setActiveTimers(newTimers);
  };

  const handleMarkDone = async (problemId) => {
    const elapsedTime = getElapsedTime(problemId);
    let timeTaken = null;
    
    if (elapsedTime !== null) {
      timeTaken = formatTime(elapsedTime);
      await userStorage.removeActiveTimer(problemId, userId);
      const newTimers = { ...activeTimers };
      delete newTimers[problemId];
      setActiveTimers(newTimers);
    }

    // Store pending time and show solution modal
    setPendingTimeTaken(timeTaken);
    setShowSolutionModal(problemId);
    setSolutionText(dsaData[problemId]?.solution || '');
  };

  const handleSaveSolution = async (problemId) => {
    const problemData = dsaData[problemId] || {};
    // Use pending time if available, otherwise keep existing time
    const timeTaken = pendingTimeTaken || problemData.timeTaken || '';

    await userStorage.saveDSAProblem(problemId, {
      status: 'Done',
      timeTaken,
      solution: solutionText
    }, userId);
    await loadData();
    setShowSolutionModal(null);
    setSolutionText('');
    setPendingTimeTaken(null);
  };

  const handleUnmarkDone = async (problemId) => {
    await userStorage.saveDSAProblem(problemId, { status: 'Todo' }, userId);
    await loadData();
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.id.toString().includes(searchQuery);
    const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
    const problemData = dsaData[problem.id] || {};
    const status = problemData.status || 'Todo';
    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Filters - Stack on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 sm:pl-9 md:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-2 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 text-xs sm:text-sm md:text-base min-h-[40px] sm:min-h-[44px] touch-manipulation"
          />
        </div>
        <div className="flex gap-1.5 sm:gap-2 md:gap-4">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="flex-1 sm:flex-none px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-2 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-100 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 min-h-[40px] sm:min-h-[44px] touch-manipulation"
          >
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-2 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-100 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 min-h-[40px] sm:min-h-[44px] touch-manipulation"
          >
            <option value="All">All</option>
            <option value="Todo">Todo</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      {/* Mobile: Card Layout, Desktop: Table */}
      <div className="hidden md:block bg-zinc-900/50 rounded-lg border border-zinc-800/50 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full">
            <thead className="bg-zinc-900/30 border-b border-zinc-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">Difficulty</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">Time Taken</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {filteredProblems.map((problem) => {
                const problemData = dsaData[problem.id] || {};
                const status = problemData.status || 'Todo';
                const isActive = activeTimers[problem.id] !== undefined;
                const elapsedTime = isActive ? getElapsedTime(problem.id) : null;

                return (
                  <tr key={problem.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-4 py-3">
                      {status === 'Done' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-500" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-300 font-mono text-sm">{problem.id}</td>
                    <td className="px-4 py-3 text-zinc-100 font-medium">{problem.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {isActive && elapsedTime ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400 animate-pulse" />
                          <span className="text-blue-400 font-mono text-sm">{formatTime(elapsedTime)}</span>
                        </div>
                      ) : problemData.timeTaken ? (
                        <span className="font-mono text-sm">{problemData.timeTaken}</span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {status === 'Done' ? (
                          <>
                            <button
                              onClick={() => handleUnmarkDone(problem.id)}
                              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-100 rounded text-sm transition-colors min-h-[36px] touch-manipulation"
                            >
                              Undo
                            </button>
                            {problemData.solution && (
                              <button
                                onClick={() => {
                                  setShowSolutionModal(problem.id);
                                  setSolutionText(problemData.solution);
                                }}
                                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 active:bg-blue-500/40 text-blue-400 rounded text-sm transition-colors min-h-[36px] touch-manipulation"
                              >
                                View Solution
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handlePractice(problem.id)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-zinc-50 rounded text-sm transition-colors flex items-center gap-1.5 min-h-[36px] touch-manipulation"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Practice
                            </button>
                            {isActive && (
                              <>
                                <button
                                  onClick={() => handleCancelTimer(problem.id)}
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-zinc-50 rounded text-sm transition-colors flex items-center gap-1.5 min-h-[36px] touch-manipulation"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleMarkDone(problem.id)}
                                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-zinc-50 rounded text-sm transition-colors min-h-[36px] touch-manipulation"
                                >
                                  Done
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-2 sm:space-y-3">
        {filteredProblems.map((problem) => {
          const problemData = dsaData[problem.id] || {};
          const status = problemData.status || 'Todo';
          const isActive = activeTimers[problem.id] !== undefined;
          const elapsedTime = isActive ? getElapsedTime(problem.id) : null;

          return (
            <div key={problem.id} className="bg-zinc-900/50 rounded-lg border border-zinc-800/50 p-2.5 sm:p-3 md:p-4 space-y-2 sm:space-y-2.5">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  {status === 'Done' ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-zinc-400 font-mono text-xs sm:text-sm">#{problem.id}</span>
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <h3 className="text-zinc-100 font-medium mt-0.5 sm:mt-1 text-sm sm:text-base break-words leading-tight">{problem.title}</h3>
                  </div>
                </div>
              </div>

              {/* Time Taken */}
              {isActive && elapsedTime ? (
                <div className="flex items-center gap-1.5 sm:gap-2 text-blue-400">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                  <span className="font-mono text-xs sm:text-sm">{formatTime(elapsedTime)}</span>
                </div>
              ) : problemData.timeTaken ? (
                <div className="text-zinc-400 text-xs sm:text-sm">
                  <span className="font-mono">{problemData.timeTaken}</span>
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1.5 sm:pt-2">
                {status === 'Done' ? (
                  <>
                    <button
                      onClick={() => handleUnmarkDone(problem.id)}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-100 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[40px] sm:min-h-[44px] touch-manipulation"
                    >
                      Undo
                    </button>
                    {problemData.solution && (
                      <button
                        onClick={() => {
                          setShowSolutionModal(problem.id);
                          setSolutionText(problemData.solution);
                        }}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-500/20 hover:bg-blue-500/30 active:bg-blue-500/40 text-blue-400 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[40px] sm:min-h-[44px] touch-manipulation"
                      >
                        View Solution
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handlePractice(problem.id)}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-zinc-50 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 sm:gap-2 min-h-[40px] sm:min-h-[44px] touch-manipulation"
                    >
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Practice
                    </button>
                    {isActive && (
                      <>
                        <button
                          onClick={() => handleCancelTimer(problem.id)}
                          className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-zinc-50 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 sm:gap-2 min-h-[40px] sm:min-h-[44px] touch-manipulation"
                        >
                          <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Cancel
                        </button>
                        <button
                          onClick={() => handleMarkDone(problem.id)}
                          className="px-3 sm:px-4 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-zinc-50 rounded-lg text-xs sm:text-sm font-medium transition-colors min-h-[40px] sm:min-h-[44px] touch-manipulation"
                        >
                          Done
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showSolutionModal !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800/50 w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-zinc-800/50">
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-100">
                Solution for Problem {problems.find(p => p.id === showSolutionModal)?.id}
              </h3>
              <button
                onClick={() => {
                  setShowSolutionModal(null);
                  setSolutionText('');
                  setPendingTimeTaken(null);
                }}
                className="text-zinc-400 hover:text-white active:text-zinc-200 p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <textarea
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                placeholder="Paste your solution here..."
                className="w-full min-h-[200px] sm:min-h-[256px] p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 font-mono text-sm resize-y"
              />
            </div>
            <div className="p-3 sm:p-4 border-t border-zinc-800/50 flex flex-col sm:flex-row justify-end gap-2 sm:gap-2">
              <button
                onClick={() => {
                  setShowSolutionModal(null);
                  setSolutionText('');
                  setPendingTimeTaken(null);
                }}
                className="w-full sm:w-auto px-4 py-3 bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 text-zinc-100 rounded-lg transition-colors font-medium min-h-[44px] touch-manipulation"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveSolution(showSolutionModal)}
                className="w-full sm:w-auto px-4 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-zinc-50 rounded-lg transition-colors font-medium min-h-[44px] touch-manipulation"
              >
                Save Solution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSASection;
