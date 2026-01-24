import React from 'react';
import { problems } from '../data/problems';

const ProgressBar = ({ dsaData = {}, refreshTrigger = 0 }) => {
  const completedCount = Object.values(dsaData).filter(p => p.status === 'Done').length;
  const totalProblems = problems.length;
  const progressPercentage = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;

  return (
    <div className="w-full bg-zinc-900/50 rounded-lg p-4 mb-6 border border-zinc-800/50">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-zinc-100">Global Progress</h2>
        <span className="text-blue-400 font-bold text-lg">
          {completedCount} / {totalProblems} ({progressPercentage}%)
        </span>
      </div>
      <div className="w-full bg-zinc-800/50 rounded-full h-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
