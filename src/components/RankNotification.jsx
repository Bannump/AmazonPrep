import React, { useEffect } from 'react';
import { ArrowUp, ArrowDown, X } from 'lucide-react';

/**
 * @param {{
 *   type: 'rank_up' | 'rank_down',
 *   prevRank: number,
 *   newRank: number,
 *   surpassed?: string[],
 *   surpassedBy?: string[],
 *   onDismiss: () => void
 * }} props
 */
const RankNotification = ({ type, prevRank, newRank, surpassed = [], surpassedBy = [], onDismiss }) => {
  const isUp = type === 'rank_up';

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onDismiss();
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div
        className={`relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden border-2 ${
          isUp ? 'bg-emerald-950/95 border-emerald-500/50' : 'bg-red-950/95 border-red-500/50'
        }`}
        role="alertdialog"
        aria-labelledby="rank-notification-title"
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  isUp ? 'bg-emerald-500/30 text-emerald-400' : 'bg-red-500/30 text-red-400'
                }`}
              >
                {isUp ? (
                  <ArrowUp className="w-7 h-7 animate-bounce" aria-hidden />
                ) : (
                  <ArrowDown className="w-7 h-7" aria-hidden />
                )}
              </div>
              <div className="min-w-0">
                <h2 id="rank-notification-title" className="font-bold text-lg text-zinc-100">
                  {isUp ? 'Rank improved!' : 'Rank update'}
                </h2>
                <p className="text-sm text-zinc-300 mt-0.5">
                  {isUp
                    ? `You moved from #${prevRank} to #${newRank}`
                    : `You dropped from #${prevRank} to #${newRank}`}
                </p>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isUp && surpassed.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-xs font-semibold text-emerald-300/90 mb-1.5">You passed:</p>
              <p className="text-sm text-emerald-100">{surpassed.join(', ')}</p>
            </div>
          )}

          {!isUp && surpassedBy.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-xs font-semibold text-red-300/90 mb-1.5">You were surpassed by:</p>
              <p className="text-sm text-red-100">{surpassedBy.join(', ')}</p>
            </div>
          )}

          <button
            onClick={onDismiss}
            className={`mt-4 w-full py-2.5 rounded-lg font-semibold transition-colors ${
              isUp
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankNotification;
