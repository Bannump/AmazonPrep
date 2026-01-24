// Unified storage utility that uses Firestore for logged-in users, localStorage as fallback
import * as firestoreStorage from './firestoreStorage';
import * as localStorage from './storage';

export const getDSAProblems = async (userId = null) => {
  if (userId) {
    return await firestoreStorage.getDSAProblems(userId);
  }
  return localStorage.getDSAProblems();
};

export const saveDSAProblem = async (problemId, data, userId = null) => {
  if (userId) {
    const problems = await firestoreStorage.getDSAProblems(userId);
    problems[problemId] = { ...problems[problemId], ...data };
    await firestoreStorage.saveDSAProblems(userId, problems);
  } else {
    localStorage.saveDSAProblem(problemId, data);
  }
};

export const getLeadershipPrinciples = async (userId = null) => {
  if (userId) {
    return await firestoreStorage.getLeadershipPrinciples(userId);
  }
  return localStorage.getLeadershipPrinciples();
};

export const saveLeadershipPrinciple = async (principleId, data, userId = null) => {
  if (userId) {
    const principles = await firestoreStorage.getLeadershipPrinciples(userId);
    principles[principleId] = { ...principles[principleId], ...data };
    await firestoreStorage.saveLeadershipPrinciples(userId, principles);
  } else {
    localStorage.saveLeadershipPrinciple(principleId, data);
  }
};

export const getLLDProblems = async (userId = null) => {
  if (userId) {
    return await firestoreStorage.getLLDProblems(userId);
  }
  return localStorage.getLLDProblems();
};

export const saveLLDProblem = async (problemId, data, userId = null) => {
  if (userId) {
    const problems = await firestoreStorage.getLLDProblems(userId);
    problems[problemId] = { ...problems[problemId], ...data };
    await firestoreStorage.saveLLDProblems(userId, problems);
  } else {
    localStorage.saveLLDProblem(problemId, data);
  }
};

export const getActiveTimers = async (userId = null) => {
  if (userId) {
    return await firestoreStorage.getActiveTimers(userId);
  }
  return localStorage.getActiveTimers();
};

export const saveActiveTimer = async (problemId, startTime, userId = null) => {
  if (userId) {
    const timers = await firestoreStorage.getActiveTimers(userId);
    timers[problemId] = startTime;
    await firestoreStorage.saveActiveTimers(userId, timers);
  } else {
    localStorage.saveActiveTimer(problemId, startTime);
  }
};

export const removeActiveTimer = async (problemId, userId = null) => {
  if (userId) {
    const timers = await firestoreStorage.getActiveTimers(userId);
    delete timers[problemId];
    await firestoreStorage.saveActiveTimers(userId, timers);
  } else {
    localStorage.removeActiveTimer(problemId);
  }
};

export const exportAllData = async (userId = null) => {
  if (userId) {
    return await firestoreStorage.exportAllData(userId);
  }
  return localStorage.exportAllData();
};

export const importAllData = (data) => {
  // Import to localStorage (for now)
  // In production, you might want to import to Firestore
  localStorage.importAllData(data);
};
