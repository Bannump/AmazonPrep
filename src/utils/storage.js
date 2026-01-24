// Storage utility functions for localStorage

const STORAGE_KEYS = {
  DSA_PROBLEMS: 'amazon_prep_dsa_problems',
  LEADERSHIP_PRINCIPLES: 'amazon_prep_leadership_principles',
  LLD_PROBLEMS: 'amazon_prep_lld_problems',
  ACTIVE_TIMERS: 'amazon_prep_active_timers'
};

export const getDSAProblems = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.DSA_PROBLEMS);
  return stored ? JSON.parse(stored) : {};
};

export const saveDSAProblem = (problemId, data) => {
  const problems = getDSAProblems();
  problems[problemId] = { ...problems[problemId], ...data };
  localStorage.setItem(STORAGE_KEYS.DSA_PROBLEMS, JSON.stringify(problems));
};

export const getLeadershipPrinciples = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.LEADERSHIP_PRINCIPLES);
  return stored ? JSON.parse(stored) : {};
};

export const saveLeadershipPrinciple = (principleId, data) => {
  const principles = getLeadershipPrinciples();
  principles[principleId] = { ...principles[principleId], ...data };
  localStorage.setItem(STORAGE_KEYS.LEADERSHIP_PRINCIPLES, JSON.stringify(principles));
};

export const getLLDProblems = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.LLD_PROBLEMS);
  return stored ? JSON.parse(stored) : {};
};

export const saveLLDProblem = (problemId, data) => {
  const problems = getLLDProblems();
  problems[problemId] = { ...problems[problemId], ...data };
  localStorage.setItem(STORAGE_KEYS.LLD_PROBLEMS, JSON.stringify(problems));
};

export const getActiveTimers = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_TIMERS);
  return stored ? JSON.parse(stored) : {};
};

export const saveActiveTimer = (problemId, startTime) => {
  const timers = getActiveTimers();
  timers[problemId] = startTime;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_TIMERS, JSON.stringify(timers));
};

export const removeActiveTimer = (problemId) => {
  const timers = getActiveTimers();
  delete timers[problemId];
  localStorage.setItem(STORAGE_KEYS.ACTIVE_TIMERS, JSON.stringify(timers));
};

export const exportAllData = () => {
  return {
    dsaProblems: getDSAProblems(),
    leadershipPrinciples: getLeadershipPrinciples(),
    lldProblems: getLLDProblems(),
    activeTimers: getActiveTimers(),
    exportDate: new Date().toISOString()
  };
};

export const importAllData = (data) => {
  if (data.dsaProblems) {
    localStorage.setItem(STORAGE_KEYS.DSA_PROBLEMS, JSON.stringify(data.dsaProblems));
  }
  if (data.leadershipPrinciples) {
    localStorage.setItem(STORAGE_KEYS.LEADERSHIP_PRINCIPLES, JSON.stringify(data.leadershipPrinciples));
  }
  if (data.lldProblems) {
    localStorage.setItem(STORAGE_KEYS.LLD_PROBLEMS, JSON.stringify(data.lldProblems));
  }
  if (data.activeTimers) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TIMERS, JSON.stringify(data.activeTimers));
  }
};
