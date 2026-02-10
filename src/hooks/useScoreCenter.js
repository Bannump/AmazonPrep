import { useState, useEffect, useCallback, useMemo } from 'react';
import { problems } from '../data/problems';
import { lldProblems } from '../data/lldProblems';
import { leadershipPrinciples } from '../data/leadershipPrinciples';
import * as userStorage from '../utils/userStorage';

// --- Points constants ---
const BASE = { easy: 1, medium: 3, hard: 6, leadership: 10, lld: 6 };
const FLAT_BONUS = 1;
const BULK = { dsa: 7, leadership: 13, lld: 7 };
const STREAK_PTS_PER_DAY = 1;   // +1 per login from Day 2 onward (Day 1 = 0); no penalty for missing

const STORAGE_PREFIX = 'scoreCenter_streak';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso, n) {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function yesterdayISO() {
  return addDays(todayISO(), -1);
}

function getStreakKey(userId) {
  return userId ? `${STORAGE_PREFIX}_${userId}` : STORAGE_PREFIX;
}

function loadStreak(userId) {
  try {
    const raw = localStorage.getItem(getStreakKey(userId));
    if (!raw) return { lastLoginDate: null, currentStreak: 0, streakState: 'none', penaltyEndDate: null, missCount: 0, maxStreak: 0 };
    const p = JSON.parse(raw);
    return {
      lastLoginDate: p.lastLoginDate || null,
      currentStreak: typeof p.currentStreak === 'number' ? p.currentStreak : 0,
      streakState: p.streakState || 'none',
      penaltyEndDate: p.penaltyEndDate || null,
      missCount: typeof p.missCount === 'number' ? p.missCount : 0,
      maxStreak: typeof p.maxStreak === 'number' ? p.maxStreak : 0
    };
  } catch (_) {
    return { lastLoginDate: null, currentStreak: 0, streakState: 'none', penaltyEndDate: null, missCount: 0, maxStreak: 0 };
  }
}

function saveStreak(userId, data) {
  try {
    localStorage.setItem(getStreakKey(userId), JSON.stringify(data));
  } catch (_) {}
}

/**
 * Check-in / streak update. Call on page load (once per day) or when user clicks Check-in.
 * Mutates and persists streak; returns the updated streak for the same day (idempotent).
 */
function runCheckIn(userId) {
  const today = todayISO();
  const yesterday = yesterdayISO();
  const prev = loadStreak(userId);

  // Already checked in today
  if (prev.lastLoginDate === today) {
    return prev;
  }

  let next = { ...prev };

  // First ever
  if (!prev.lastLoginDate) {
    next = { lastLoginDate: today, currentStreak: 1, streakState: 'active', penaltyEndDate: null, missCount: prev.missCount || 0 };
    saveStreak(userId, next);
    return next;
  }

  // In penalty: on next login, restart at Day 1 (no wait). Must log in 2 consecutive days to earn again.
  if (prev.streakState === 'penalty') {
    next = { lastLoginDate: today, currentStreak: 1, streakState: 'active', penaltyEndDate: null, missCount: prev.missCount || 0 };
    saveStreak(userId, next);
    return next;
  }

  // Consecutive: yesterday
  if (prev.lastLoginDate === yesterday) {
    next = {
      lastLoginDate: today,
      currentStreak: (prev.currentStreak || 0) + 1,
      streakState: 'active',
      penaltyEndDate: null,
      missCount: prev.missCount || 0
    };
    saveStreak(userId, next);
    return next;
  }

  // Missed at least one day -> streak resets, enter penalty (no point deduction)
  next = {
    lastLoginDate: today,
    currentStreak: 0,
    streakState: 'penalty',
    penaltyEndDate: null,
    missCount: (prev.missCount || 0) + 1
  };
  saveStreak(userId, next);
  return next;
}

function isLldCompleted(data) {
  if (!data || typeof data !== 'object') return false;
  const has =
    (data.resourceLink && String(data.resourceLink).trim()) ||
    (data.keyClasses && String(data.keyClasses).trim()) ||
    (data.githubLink && String(data.githubLink).trim()) ||
    (data.excalidrawLink && String(data.excalidrawLink).trim());
  return !!has;
}

/**
 * useScoreCenter({ dsaData, userId, refreshTrigger })
 * - Fetches leadership and LLD from userStorage when userId/refreshTrigger.
 * - Runs check-in on mount (and when userId becomes available) for streak.
 * - Computes totalPoints and breakdown from dsaData, leadership, lld, and streak.
 */
export function useScoreCenter({ dsaData = {}, userId = null, refreshTrigger = 0 }) {
  const [leadershipData, setLeadershipData] = useState({});
  const [lldData, setLldData] = useState({});
  const [streak, setStreak] = useState(() => loadStreak(userId));

  // Fetch leadership and LLD
  useEffect(() => {
    if (userId == null) {
      setLeadershipData({});
      setLldData({});
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [l, ll] = await Promise.all([
          userStorage.getLeadershipPrinciples(userId),
          userStorage.getLLDProblems(userId)
        ]);
        if (!cancelled) {
          setLeadershipData(l || {});
          setLldData(ll || {});
        }
      } catch (_) {
        if (!cancelled) {
          setLeadershipData({});
          setLldData({});
        }
      }
    })();
    return () => { cancelled = true; };
  }, [userId, refreshTrigger]);

  const checkIn = useCallback(() => {
    const next = runCheckIn(userId);
    setStreak(next);
    return next;
  }, [userId]);

  // On mount / when userId changes: run check-in (idempotent per day; also initializes streak from storage)
  useEffect(() => {
    if (userId == null) {
      setStreak(loadStreak(null));
      return;
    }
    const next = runCheckIn(userId);
    setStreak(next);
  }, [userId]);

  const { totalPoints, breakdown, dsaDoneCount, leadershipCount, lldCount } = useMemo(() => {
    const problemById = Object.fromEntries(problems.map((p) => [p.id, p]));

    // DSA: by difficulty (only Done)
    let dsaEasy = 0,
      dsaMedium = 0,
      dsaHard = 0;
    let dsaDoneCount = 0;
    for (const [id, d] of Object.entries(dsaData || {})) {
      if (d && d.status === 'Done') {
        dsaDoneCount += 1;
        const p = problemById[id];
        const diff = (p && p.difficulty) || 'Medium';
        if (diff === 'Easy') dsaEasy += 1;
        else if (diff === 'Hard') dsaHard += 1;
        else dsaMedium += 1;
      }
    }

    const baseDsa = dsaEasy * BASE.easy + dsaMedium * BASE.medium + dsaHard * BASE.hard;

    // Leadership: Finalized
    let leadershipCount = 0;
    for (const p of leadershipPrinciples) {
      const d = leadershipData[p.id];
      if (d && d.status === 'Finalized') leadershipCount += 1;
    }
    const baseLeadership = leadershipCount * BASE.leadership;

    // LLD: Completed (has any of resourceLink, keyClasses, githubLink, excalidrawLink)
    let lldCount = 0;
    for (const p of lldProblems) {
      if (isLldCompleted(lldData[p.id])) lldCount += 1;
    }
    const baseLld = lldCount * BASE.lld;

    // Flat +1 per Done entry (DSA Done, Leadership Finalized, LLD Completed)
    const flatCount = dsaDoneCount + leadershipCount + lldCount;
    const flatBonus = flatCount * FLAT_BONUS;

    // Bulk: every 5
    const bulkDsaFives = Math.floor(dsaDoneCount / 5);
    const bulkLeadershipFives = Math.floor(leadershipCount / 5);
    const bulkLldFives = Math.floor(lldCount / 5);
    const bulkDsa = bulkDsaFives * BULK.dsa;
    const bulkLeadership = bulkLeadershipFives * BULK.leadership;
    const bulkLld = bulkLldFives * BULK.lld;

    // Streak: +1 per login from Day 2 (Day 1 = 0, Day 2 = +1, Day 3 = +2, ...); no penalty for missing
    const streakDays = streak.streakState === 'active' ? (streak.currentStreak || 0) : 0;
    const streakPts = streakDays >= 2 ? (streakDays - 1) * STREAK_PTS_PER_DAY : 0;

    const total =
      baseDsa +
      baseLeadership +
      baseLld +
      flatBonus +
      bulkDsa +
      bulkLeadership +
      bulkLld +
      streakPts;

    const breakdown = {
      base: {
        dsa: { easy: dsaEasy, medium: dsaMedium, hard: dsaHard, pts: baseDsa },
        leadership: { count: leadershipCount, pts: baseLeadership },
        lld: { count: lldCount, pts: baseLld }
      },
      flatBonus: { count: flatCount, pts: flatBonus, each: FLAT_BONUS },
      bulk: {
        dsa: { fives: bulkDsaFives, pts: bulkDsa, each: BULK.dsa },
        leadership: { fives: bulkLeadershipFives, pts: bulkLeadership, each: BULK.leadership },
        lld: { fives: bulkLldFives, pts: bulkLld, each: BULK.lld }
      },
      streak: {
        days: streakDays,
        pts: streakPts,
        state: streak.streakState,
        inPenalty: streak.streakState === 'penalty',
        penaltyEndDate: streak.penaltyEndDate,
        missCount: streak.missCount || 0
      },
      total
    };

    return { totalPoints: total, breakdown, dsaDoneCount, leadershipCount, lldCount };
  }, [dsaData, leadershipData, lldData, streak]);

  return {
    totalPoints,
    breakdown,
    streak,
    checkIn,
    leadershipData,
    lldData,
    dsaDoneCount,
    leadershipCount,
    lldCount
  };
}
