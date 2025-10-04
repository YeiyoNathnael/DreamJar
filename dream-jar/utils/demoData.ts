import { Goal } from '@/types';
import { generateId } from './storage';

export const createDemoGoals = (): Goal[] => {
  const demoGoals: Goal[] = [
    {
      id: generateId(),
      name: 'Dream Vacation',
      description: 'A trip to Japan to see the cherry blossoms',
      emoji: '✈️',
      goal_amount: 5000,
      current_amount: 1250,
      priority: 1,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    },
    {
      id: generateId(),
      name: 'New Laptop',
      description: 'MacBook Pro for development work',
      emoji: '💻',
      goal_amount: 2500,
      current_amount: 800,
      priority: 2,
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    },
    {
      id: generateId(),
      name: 'Emergency Fund',
      description: 'Safety net for unexpected expenses',
      emoji: '🛡️',
      goal_amount: 10000,
      current_amount: 3200,
      priority: 1,
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    },
    {
      id: generateId(),
      name: 'New Car',
      description: 'Reliable transportation upgrade',
      emoji: '🚗',
      goal_amount: 25000,
      current_amount: 5500,
      priority: 3,
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    },
    {
      id: generateId(),
      name: 'Home Down Payment',
      description: 'First home purchase savings',
      emoji: '🏡',
      goal_amount: 50000,
      current_amount: 12000,
      priority: 1,
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    },
    {
      id: generateId(),
      name: 'Guitar Lessons',
      description: 'Learn to play acoustic guitar',
      emoji: '🎸',
      goal_amount: 1000,
      current_amount: 750,
      priority: 3,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    },
  ];

  return demoGoals;
};