// Firestore storage utility for user-specific data
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
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
