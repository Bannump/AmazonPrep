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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search problems by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50"
          />
        </div>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-4 py-2 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50"
        >
          <option value="All">All Status</option>
          <option value="Todo">Todo</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="bg-zinc-900/50 rounded-lg border border-zinc-800/50 overflow-hidden">
        <div className="overflow-x-auto">
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
                    <td className="px-4 py-3 text-zinc-300 font-mono">{problem.id}</td>
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
                          <span className="text-blue-400 font-mono">{formatTime(elapsedTime)}</span>
                        </div>
                      ) : problemData.timeTaken ? (
                        <span className="font-mono">{problemData.timeTaken}</span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {status === 'Done' ? (
                          <>
                            <button
                              onClick={() => handleUnmarkDone(problem.id)}
                              className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded text-sm transition-colors"
                            >
                              Undo
                            </button>
                            {problemData.solution && (
                              <button
                                onClick={() => {
                                  setShowSolutionModal(problem.id);
                                  setSolutionText(problemData.solution);
                                }}
                                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-sm transition-colors"
                              >
                                View Solution
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handlePractice(problem.id)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-zinc-50 rounded text-sm transition-colors flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Practice
                            </button>
                            {isActive && (
                              <>
                                <button
                                  onClick={() => handleCancelTimer(problem.id)}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-zinc-50 rounded text-sm transition-colors flex items-center gap-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  Cancel Timer
                                </button>
                                <button
                                  onClick={() => handleMarkDone(problem.id)}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-zinc-50 rounded text-sm transition-colors"
                                >
                                  Mark Done
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

      {showSolutionModal !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800/50 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
              <h3 className="text-xl font-semibold text-zinc-100">
                Solution for Problem {problems.find(p => p.id === showSolutionModal)?.id}
              </h3>
              <button
                onClick={() => {
                  setShowSolutionModal(null);
                  setSolutionText('');
                  setPendingTimeTaken(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <textarea
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                placeholder="Paste your solution here..."
                className="w-full h-64 p-3 bg-zinc-900 border border-zinc-900 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 font-mono text-sm"
              />
            </div>
            <div className="p-4 border-t border-zinc-800/50 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowSolutionModal(null);
                  setSolutionText('');
                  setPendingTimeTaken(null);
                }}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveSolution(showSolutionModal)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-zinc-50 rounded transition-colors"
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
