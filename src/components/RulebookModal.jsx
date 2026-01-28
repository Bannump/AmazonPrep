import React, { useEffect } from 'react';
import { X, Book, Flame } from 'lucide-react';

// Rules only — same numbers as useScoreCenter
const BASE = { easy: 1, medium: 3, hard: 6, leadership: 10, lld: 6 };
const FLAT_BONUS = 1;
const BULK = { dsa: 7, leadership: 13, lld: 7 };
const MISS_PENALTY = 1;

export default function RulebookModal({ onClose }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl"
        role="dialog"
        aria-labelledby="rulebook-modal-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-4 border-b border-zinc-700 bg-zinc-900">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-amber-500" />
            <h2 id="rulebook-modal-title" className="text-lg font-bold text-zinc-100">
              Rulebook
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
          <p className="text-sm text-zinc-400">
            How points are calculated. Use &quot;Your breakdown&quot; in the Leaderboard to see your own score.
          </p>

          {/* A. Base points */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">A. Base points</h3>
            <ul className="space-y-1.5 text-sm text-zinc-300">
              <li>Easy DSA: <span className="text-amber-400/90">{BASE.easy}</span> pts each</li>
              <li>Medium DSA: <span className="text-amber-400/90">{BASE.medium}</span> pts each</li>
              <li>Hard DSA: <span className="text-amber-400/90">{BASE.hard}</span> pts each</li>
              <li>Leadership Story (Finalized): <span className="text-amber-400/90">{BASE.leadership}</span> pts each</li>
              <li>LLD Question (Completed): <span className="text-amber-400/90">{BASE.lld}</span> pts each</li>
            </ul>
          </section>

          {/* B. Completion & Bulk Bonuses */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">B. Completion &amp; Bulk Bonuses</h3>
            <ul className="space-y-1.5 text-sm text-zinc-300">
              <li>Every entry (DSA, LLD, or Story) marked Done: flat +<span className="text-amber-400/90">{FLAT_BONUS}</span> bonus pt</li>
              <li>Every 5 DSA completed: +<span className="text-amber-400/90">{BULK.dsa}</span> bonus pts</li>
              <li>Every 5 Leadership Stories completed: +<span className="text-amber-400/90">{BULK.leadership}</span> bonus pts</li>
              <li>Every 5 LLDs completed: +<span className="text-amber-400/90">{BULK.lld}</span> bonus pts</li>
            </ul>
          </section>

          {/* C. Continuous Login Streak (Daily Bonus) */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              C. Continuous Login Streak (Daily Bonus)
            </h3>
            <p className="text-sm text-zinc-300 mb-2">
              +1 for each login after 2 consecutive logins (Day 1 = 0, Day 2 = +1, Day 3 = +1, …).
            </p>
            <p className="text-sm text-amber-200/90">
              <strong>MISS RULE:</strong> If a day is missed: <span className="text-red-400">−{MISS_PENALTY} pts</span> to the total, streak resets, and you must log in 2 consecutive days after that to start earning bonus points again.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
