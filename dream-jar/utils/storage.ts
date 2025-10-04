import { Goal, User } from '@/types';

const GOALS_KEY = 'dreamjar_goals';
const USER_KEY = 'dreamjar_user';

// Goals storage
export const getGoals = (): Goal[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(GOALS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading goals:', error);
    return [];
  }
};

export const saveGoals = (goals: Goal[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving goals:', error);
  }
};

// User storage
export const getUser = (): User => {
  if (typeof window === 'undefined') {
    return {
      id: '1',
      name: 'Alex',
      avatar: '🌟',
      created_at: new Date().toISOString(),
    };
  }
  
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Create default user if none exists
    const defaultUser: User = {
      id: '1',
      name: 'Alex',
      avatar: '🌟',
      created_at: new Date().toISOString(),
    };
    
    saveUser(defaultUser);
    return defaultUser;
  } catch (error) {
    console.error('Error loading user:', error);
    return {
      id: '1',
      name: 'Alex',
      avatar: '🌟',
      created_at: new Date().toISOString(),
    };
  }
};

export const saveUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateTotalSaved = (goals: Goal[]): number => {
  return goals.reduce((total, goal) => total + goal.current_amount, 0);
};