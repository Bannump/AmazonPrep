// Firestore storage utility for user-specific data
import { doc, setDoc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getDb } from '../config/firebase';

const getUserDocRef = (userId) => {
  const db = getDb();
  return doc(db, 'users', userId);
};

export const saveDSAProblems = async (userId, problems) => {
  try {
    const userRef = getUserDocRef(userId);
    await setDoc(userRef, { dsaProblems: problems }, { merge: true });
  } catch (error) {
    console.error('Error saving DSA problems:', error);
    throw error;
  }
};

export const getDSAProblems = async (userId) => {
  try {
    const userRef = getUserDocRef(userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().dsaProblems || {};
    }
    return {};
  } catch (error) {
    console.error('Error getting DSA problems:', error);
    return {};
  }
};

export const saveLeadershipPrinciples = async (userId, principles) => {
  try {
    const userRef = getUserDocRef(userId);
    await setDoc(userRef, { leadershipPrinciples: principles }, { merge: true });
  } catch (error) {
    console.error('Error saving leadership principles:', error);
    throw error;
  }
};

export const getLeadershipPrinciples = async (userId) => {
  try {
    const userRef = getUserDocRef(userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().leadershipPrinciples || {};
    }
    return {};
  } catch (error) {
    console.error('Error getting leadership principles:', error);
    return {};
  }
};

export const saveLLDProblems = async (userId, problems) => {
  try {
    const userRef = getUserDocRef(userId);
    await setDoc(userRef, { lldProblems: problems }, { merge: true });
  } catch (error) {
    console.error('Error saving LLD problems:', error);
    throw error;
  }
};

export const getLLDProblems = async (userId) => {
  try {
    const userRef = getUserDocRef(userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().lldProblems || {};
    }
    return {};
  } catch (error) {
    console.error('Error getting LLD problems:', error);
    return {};
  }
};

export const saveActiveTimers = async (userId, timers) => {
  try {
    const userRef = getUserDocRef(userId);
    await setDoc(userRef, { activeTimers: timers }, { merge: true });
  } catch (error) {
    console.error('Error saving active timers:', error);
    throw error;
  }
};

export const getActiveTimers = async (userId) => {
  try {
    const userRef = getUserDocRef(userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().activeTimers || {};
    }
    return {};
  } catch (error) {
    console.error('Error getting active timers:', error);
    return {};
  }
};

// --- Leaderboard ---

const getLeaderboardColRef = () => {
  const db = getDb();
  return collection(db, 'leaderboard');
};

const getLeaderboardDocRef = (userId) => {
  const db = getDb();
  return doc(db, 'leaderboard', userId);
};

/** Fetch leaderboard sorted by completedCount desc. Each item: { userId, displayName, photoURL, completedCount, updatedAt } */
export const getLeaderboard = async () => {
  try {
    const col = getLeaderboardColRef();
    const q = query(col, orderBy('completedCount', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ userId: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

/** Create or update a user's leaderboard entry. Call when DSA completed count may have changed. */
export const updateLeaderboardEntry = async (userId, { displayName, photoURL, completedCount }) => {
  try {
    const ref = getLeaderboardDocRef(userId);
    await setDoc(ref, {
      userId,
      displayName: displayName || 'Anonymous',
      photoURL: photoURL || null,
      completedCount: typeof completedCount === 'number' ? completedCount : 0,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating leaderboard entry:', error);
    // Non-fatal: do not throw so DSA flow is undisturbed
  }
};

/** Read leaderboardMeta from users/{userId}: { lastRank, lastCompletedCount }. */
export const getLeaderboardMeta = async (userId) => {
  try {
    const userRef = getUserDocRef(userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data().leaderboardMeta || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting leaderboard meta:', error);
    return null;
  }
};

/** Save leaderboardMeta to users/{userId}. */
export const setLeaderboardMeta = async (userId, { lastRank, lastCompletedCount }) => {
  try {
    const userRef = getUserDocRef(userId);
    await setDoc(userRef, { leaderboardMeta: { lastRank, lastCompletedCount } }, { merge: true });
  } catch (error) {
    console.error('Error setting leaderboard meta:', error);
  }
};

// ---

export const exportAllData = async (userId) => {
  try {
    const userRef = getUserDocRef(userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        dsaProblems: data.dsaProblems || {},
        leadershipPrinciples: data.leadershipPrinciples || {},
        lldProblems: data.lldProblems || {},
        activeTimers: data.activeTimers || {},
        exportDate: new Date().toISOString()
      };
    }
    return {
      dsaProblems: {},
      leadershipPrinciples: {},
      lldProblems: {},
      activeTimers: {},
      exportDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return {
      dsaProblems: {},
      leadershipPrinciples: {},
      lldProblems: {},
      activeTimers: {},
      exportDate: new Date().toISOString()
    };
  }
};
