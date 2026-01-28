import React, { useEffect } from 'react';
import { X, Info, Flame, CheckCircle } from 'lucide-react';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function ScoreBreakdownModal({
  totalPoints,
  breakdown,
  streak,
  checkIn,
  onClose
}) {
  const alreadyCheckedInToday = !!(streak && streak.lastLoginDate === todayStr());

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  const b = breakdown || {};
  const base = b.base || {};
  const flat = b.flatBonus || {};
  const bulk = b.bulk || {};
  const str = b.streak || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl"
        role="dialog"
        aria-labelledby="score-modal-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-4 border-b border-zinc-700 bg-zinc-900">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-500" />
            <h2 id="score-modal-title" className="text-lg font-bold text-zinc-100">
              Points Breakdown
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Total */}
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <span className="font-semibold text-zinc-100">Total points</span>
            <span className="font-bold text-amber-400 text-lg">{Math.round(totalPoints)}</span>
          </div>

          {/* A. Base points */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">A. Base points</h3>
            <ul className="space-y-1.5 text-sm">
              <li className="flex justify-between">
                <span className="text-zinc-400">DSA Easy × {base.dsa?.easy ?? 0} @ 1</span>
                <span>+{((base.dsa?.easy ?? 0) * 1).toFixed(0)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-400">DSA Medium × {base.dsa?.medium ?? 0} @ 3</span>
                <span>+{((base.dsa?.medium ?? 0) * 3).toFixed(0)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-400">DSA Hard × {base.dsa?.hard ?? 0} @ 6</span>
                <span>+{((base.dsa?.hard ?? 0) * 6).toFixed(0)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-400">Leadership (Finalized) × {base.leadership?.count ?? 0} @ 10</span>
                <span>+{(base.leadership?.pts ?? 0).toFixed(0)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-400">LLD (Completed) × {base.lld?.count ?? 0} @ 6</span>
                <span>+{(base.lld?.pts ?? 0).toFixed(0)}</span>
              </li>
            </ul>
          </section>

          {/* B. Completion & bulk bonuses */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">B. Completion &amp; bulk bonuses</h3>
            <ul className="space-y-1.5 text-sm">
              <li className="flex justify-between">
                <span className="text-zinc-400">Flat +1 per Done × {flat.count ?? 0}</span>
                <span>+{(flat.pts ?? 0).toFixed(0)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-400">Every 5 DSA: {bulk.dsa?.fives ?? 0} × 7</span>
                <span>+{(bulk.dsa?.pts ?? 0).toFixed(0)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-400">Every 5 Leadership: {bulk.leadership?.fives ?? 0} × 13</span>
                <span>+{(bulk.leadership?.pts ?? 0).toFixed(0)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-400">Every 5 LLD: {bulk.lld?.fives ?? 0} × 7</span>
                <span>+{(bulk.lld?.pts ?? 0).toFixed(0)}</span>
              </li>
            </ul>
          </section>

          {/* C. Continuous Login Streak (Daily Bonus) */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              C. Continuous Login Streak (Daily Bonus)
            </h3>
            {str.inPenalty ? (
              <>
                <p className="text-sm text-amber-200/90">
                  You missed a day. −1 pts applied, streak reset. Log in 2 consecutive days to start earning again.
                </p>
                {(str.missCount ?? 0) > 0 && (
                  <p className="text-sm text-red-400/90 mt-1">
                    Miss penalty: −1 × {str.missCount} = {str.penaltyDeduction ?? 0}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-zinc-300">
                  Day {str.days || 0} → +{(str.pts ?? 0).toFixed(0)} pts
                </p>
                {(str.missCount ?? 0) > 0 && (
                  <p className="text-sm text-red-400/90 mt-1">
                    Miss penalty: −1 × {str.missCount} = {str.penaltyDeduction ?? 0}
                  </p>
                )}
              </>
            )}
          </section>

          {/* Check-in */}
          <div className="pt-2 border-t border-zinc-700">
            <p className="text-xs text-zinc-500 mb-2">
              Check in each day to grow your streak. +1 per day from Day 2 (Day 1 = 0). If you miss a day: −1 pts, streak resets; log in 2 consecutive days to start earning again.
            </p>
            <button
              onClick={() => {
                checkIn();
                onClose();
              }}
              disabled={alreadyCheckedInToday}
              className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                alreadyCheckedInToday
                  ? 'bg-zinc-700 text-zinc-500 cursor-default'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {alreadyCheckedInToday ? "Checked in today" : "Check-in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
