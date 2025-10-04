'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Goal } from '@/types';

interface GoalDetailsModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onAddFunds: (goalId: string, amount: number) => void;
}

export default function GoalDetailsModal({ goal, isOpen, onClose, onAddFunds }: GoalDetailsModalProps) {
  const [fundAmount, setFundAmount] = useState('');
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;

    if (isOpen && overlay && modal) {
      // Show animation
      gsap.set(overlay, { display: 'flex' });
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        modal,
        { scale: 0.8, y: 50, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );

      // Celebration animation for completed goals
      if (goal && goal.current_amount >= goal.goal_amount) {
        // Golden glow animation
        gsap.to(modal, {
          boxShadow: "0 0 40px rgba(255, 215, 0, 0.6), 0 0 80px rgba(255, 215, 0, 0.3)",
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });

        // Floating confetti animation
        const confettiElements = modal.querySelectorAll('.confetti-piece');
        if (confettiElements.length > 0) {
          gsap.set(confettiElements, { 
            opacity: 0,
            scale: 0,
            rotation: 0,
            y: 0,
          });

          gsap.to(confettiElements, {
            opacity: 1,
            scale: 1,
            rotation: 360,
            y: -40,
            duration: 2,
            stagger: 0.1,
            repeat: -1,
            repeatDelay: 3,
            ease: "power2.out",
          });

          gsap.to(confettiElements, {
            y: 30,
            opacity: 0,
            duration: 1.5,
            delay: 2,
            stagger: 0.1,
            repeat: -1,
            repeatDelay: 4.5,
            ease: "power2.in",
          });
        }
      }
    } else if (!isOpen && overlay && modal) {
      // Hide animation
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
        },
      });
      gsap.to(modal, {
        scale: 0.8,
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [isOpen, goal]);

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !fundAmount || parseFloat(fundAmount) <= 0) return;

    onAddFunds(goal.id, parseFloat(fundAmount));
    setFundAmount('');
    setIsAddingFunds(false);
    onClose();
  };

  if (!goal || !isOpen) return null;

  const progress = Math.min((goal.current_amount / goal.goal_amount) * 100, 100);
  const isCompleted = goal.current_amount >= goal.goal_amount;
  const formattedCurrent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(goal.current_amount);
  const formattedGoal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(goal.goal_amount);

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'High Priority';
      case 2: return 'Medium Priority';
      case 3: return 'Low Priority';
      default: return 'Unknown Priority';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-red-400';
      case 2: return 'text-yellow-400';
      case 3: return 'text-green-400';
      default: return 'text-purple-400';
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ display: 'none' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className={`backdrop-blur-md rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden ${
          isCompleted
            ? 'bg-gradient-to-br from-yellow-600/95 to-amber-700/95 border border-yellow-400/40'
            : 'bg-gradient-to-br from-purple-900/95 to-purple-800/95 border border-purple-500/30'
        }`}
      >
        {/* Celebration confetti for completed goals */}
        {isCompleted && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="confetti-piece absolute top-4 left-8 text-2xl">🎉</div>
            <div className="confetti-piece absolute top-8 right-12 text-xl">✨</div>
            <div className="confetti-piece absolute top-6 left-1/3 text-lg">🌟</div>
            <div className="confetti-piece absolute top-10 right-1/4 text-xl">⭐</div>
            <div className="confetti-piece absolute top-12 left-12 text-lg">💫</div>
            <div className="confetti-piece absolute top-14 right-8 text-xl">🎊</div>
            <div className="confetti-piece absolute top-5 left-1/2 text-lg">✨</div>
            <div className="confetti-piece absolute top-16 right-1/3 text-xl">🌟</div>
          </div>
        )}

        {/* Success crown for completed goals */}
        {isCompleted && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce">
            👑
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${
            isCompleted
              ? 'bg-yellow-700/50 hover:bg-yellow-600/50 text-yellow-100'
              : 'bg-purple-800/50 hover:bg-purple-700/50 text-purple-200'
          }`}
        >
          ×
        </button>

        {/* Goal emoji and name */}
        <div className="text-center mb-6 relative z-10">
          <div className={`text-6xl mb-4 ${isCompleted ? 'animate-pulse' : ''}`}>
            {goal.emoji}
          </div>
          {isCompleted && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-black px-4 py-2 rounded-full text-lg font-bold mb-4 animate-pulse">
              🎯 GOAL COMPLETED! 🎉
            </div>
          )}
          <h2 className={`text-2xl font-bold mb-2 ${
            isCompleted ? 'text-yellow-50' : 'text-white'
          }`}>{goal.name}</h2>
          <p className={`text-lg ${
            isCompleted ? 'text-yellow-100/80' : 'text-purple-200/70'
          }`}>{goal.description}</p>
        </div>

        {/* Goal details */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-purple-200">Goal Amount:</span>
            <span className="text-white font-semibold">{formattedGoal}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-purple-200">Current Amount:</span>
            <span className="text-white font-semibold">{formattedCurrent}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-purple-200">Priority:</span>
            <span className={`font-semibold ${getPriorityColor(goal.priority)}`}>
              {getPriorityLabel(goal.priority)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${
              isCompleted ? 'text-yellow-100' : 'text-purple-200'
            }`}>Progress</span>
            <span className={`text-sm font-medium ${
              isCompleted ? 'text-yellow-200' : 'text-purple-300'
            }`}>
              {progress.toFixed(1)}%
            </span>
          </div>
          
          <div className={`w-full rounded-full h-3 overflow-hidden ${
            isCompleted ? 'bg-yellow-900/30' : 'bg-purple-900/30'
          }`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-400 animate-pulse'
                  : 'bg-gradient-to-r from-purple-400 to-pink-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {isCompleted && (
            <div className="text-center mt-3">
              <span className="inline-flex items-center gap-1 text-yellow-200 text-sm font-bold">
                🏆 Mission Accomplished!
              </span>
            </div>
          )}
        </div>

        {/* Add funds section */}
        <div className="relative z-10">
          {isCompleted ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">🎊</div>
              <p className="text-yellow-100 text-lg font-semibold mb-2">
                Congratulations!
              </p>
              <p className="text-yellow-200/80">
                You&apos;ve successfully reached your goal!
              </p>
            </div>
          ) : !isAddingFunds ? (
            <button
              onClick={() => setIsAddingFunds(true)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-semibold text-lg transition-all duration-500 ease-out transform hover:scale-105"
            >
              💰 Add Funds
            </button>
          ) : (
          <form onSubmit={handleAddFunds} className="space-y-4">
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Amount to add
              </label>
              <input
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
                autoFocus
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddingFunds(false);
                  setFundAmount('');
                }}
                className="flex-1 py-3 bg-purple-800/50 hover:bg-purple-700/50 text-purple-200 rounded-lg transition-all duration-500 ease-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all duration-500 ease-out"
              >
                Add Funds
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}