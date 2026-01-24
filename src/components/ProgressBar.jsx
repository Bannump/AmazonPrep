import React from 'react';
import { problems } from '../data/problems';
import { getDSAProblems } from '../utils/storage';

const ProgressBar = () => {
  const dsaData = getDSAProblems();
  const completedCount = Object.values(dsaData).filter(p => p.status === 'Done').length;
  const totalProblems = problems.length;
  const progressPercentage = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;

  return (
    <div className="w-full bg-zinc-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-white">Global Progress</h2>
        <span className="text-amber-500 font-bold text-lg">
          {completedCount} / {totalProblems} ({progressPercentage}%)
        </span>
      </div>
      <div className="w-full bg-zinc-700 rounded-full h-3">
        <div
          className="bg-amber-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
