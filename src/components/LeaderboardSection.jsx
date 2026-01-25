import React, { useState } from 'react';
import { Trophy, User, Book, BarChart2 } from 'lucide-react';
import RulebookModal from './RulebookModal';

const LeaderboardSection = ({ leaderboard = [], currentUserId, loading, onOpenScoreModal }) => {
  const [showRulebookModal, setShowRulebookModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-zinc-400">Loading leaderboard…</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-zinc-900/50 rounded-lg p-2.5 sm:p-3 md:p-4 mb-3 sm:mb-4 border border-zinc-800/50">
        <p className="text-zinc-300 text-[11px] sm:text-xs md:text-sm flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
          Ranking is based on total points. All logged-in candidates can see the leaderboard.
        </p>
      </div>

      {/* Rulebook & Your breakdown */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowRulebookModal(true)}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs sm:text-sm font-medium border border-zinc-700/50 transition-colors"
        >
          <Book className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Rulebook
        </button>
        {onOpenScoreModal && (
          <button
            onClick={onOpenScoreModal}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 text-xs sm:text-sm font-medium border border-amber-500/40 transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Your breakdown
          </button>
        )}
      </div>

      <div className="bg-zinc-900/50 rounded-lg border border-zinc-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900/30 border-b border-zinc-800/50">
              <tr>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm font-semibold text-zinc-300">Rank</th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm font-semibold text-zinc-300">Candidate</th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-right text-xs sm:text-sm font-semibold text-zinc-300">Max Streak</th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-right text-xs sm:text-sm font-semibold text-zinc-300">DSA</th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-right text-xs sm:text-sm font-semibold text-zinc-300">LPs</th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-right text-xs sm:text-sm font-semibold text-zinc-300">LLDs</th>
                <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-right text-xs sm:text-sm font-semibold text-zinc-300">Total pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-zinc-500 text-sm">
                    No entries yet. Add progress to appear on the leaderboard.
                  </td>
                </tr>
              )}
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.userId === currentUserId;
                return (
                  <tr
                    key={entry.userId}
                    className={`transition-colors ${
                      isCurrentUser ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : 'hover:bg-zinc-900/30'
                    }`}
                  >
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                      <span className={`font-bold ${rank <= 3 ? 'text-amber-500' : 'text-zinc-400'}`}>
                        #{rank}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {entry.photoURL ? (
                          <img
                            src={entry.photoURL}
                            alt={entry.displayName}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-zinc-700 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-zinc-400" />
                          </div>
                        )}
                        <span className="text-zinc-100 font-medium text-sm sm:text-base truncate">
                          {entry.displayName || 'Anonymous'}
                          {isCurrentUser && (
                            <span className="ml-1.5 text-blue-400 text-xs font-normal">(you)</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-right">
                      <span className="text-zinc-300 font-medium text-sm sm:text-base">{entry.maxStreak ?? 0}</span>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-right">
                      <span className="text-zinc-300 font-medium text-sm sm:text-base">{entry.dsaSolved ?? 0}</span>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-right">
                      <span className="text-zinc-300 font-medium text-sm sm:text-base">{entry.lpsFinished ?? 0}</span>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-right">
                      <span className="text-zinc-300 font-medium text-sm sm:text-base">{entry.lldsFinished ?? 0}</span>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-right">
                      <span className="text-amber-400 font-semibold text-sm sm:text-base">{entry.totalPoints ?? 0}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showRulebookModal && <RulebookModal onClose={() => setShowRulebookModal(false)} />}
    </div>
  );
};

export default LeaderboardSection;
