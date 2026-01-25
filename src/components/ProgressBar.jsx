import React from 'react';
import { problems } from '../data/problems';
import { Info } from 'lucide-react';

const ProgressBar = ({ dsaData = {}, refreshTrigger = 0, totalPoints, onPointsClick }) => {
  const completedCount = Object.values(dsaData).filter(p => p && p.status === 'Done').length;
  const totalProblems = problems.length;
  const progressPercentage = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;

  return (
    <div className="w-full bg-zinc-900/50 rounded-lg p-2.5 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6 border border-zinc-800/50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-0 mb-1.5 sm:mb-2">
        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-zinc-100">Global Progress</h2>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-blue-400 font-bold text-sm sm:text-base md:text-lg">
            {completedCount} / {totalProblems} ({progressPercentage}%)
          </span>
          {typeof totalPoints === 'number' && (
            <button
              type="button"
              onClick={onPointsClick}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-semibold hover:bg-amber-500/30 transition-colors"
              title="Points breakdown"
            >
              <Info className="w-3 h-3" />
              {Math.round(totalPoints)} pts
            </button>
          )}
        </div>
      </div>
      <div className="w-full bg-zinc-800/50 rounded-full h-2 sm:h-2.5 md:h-3">
        <div
          className="bg-blue-500 h-2 sm:h-2.5 md:h-3 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
