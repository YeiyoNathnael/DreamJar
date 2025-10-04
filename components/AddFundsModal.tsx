"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Goal } from "@/types";

interface AddFundsModalProps {
  goals: Goal[];
  isOpen: boolean;
  onClose: () => void;
  onAddFunds: (goalId: string, amount: number) => void;
}

export default function AddFundsModal({
  goals,
  isOpen,
  onClose,
  onAddFunds,
}: AddFundsModalProps) {
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [amount, setAmount] = useState("");

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (goals.length > 0 && !selectedGoalId) {
      setSelectedGoalId(goals[0].id);
    }
  }, [goals, selectedGoalId]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;

    if (isOpen && overlay && modal) {
      // Show animation
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        modal,
        { scale: 0.8, y: 50, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    } else if (!isOpen && overlay && modal) {
      // Hide animation
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
        },
      });
      gsap.to(modal, {
        scale: 0.8,
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId || !amount || parseFloat(amount) <= 0) return;

    onAddFunds(selectedGoalId, parseFloat(amount));
    setAmount("");
    onClose();
  };

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ display: "none" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-purple-900/90 to-purple-800/90 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💰</div>
          <h2 className="text-2xl font-bold text-white mb-2">Add Money</h2>
          <p className="text-purple-200/70">
            Choose a goal and add funds to it
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Selection */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-3">
              Select Goal
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedGoalId === goal.id
                      ? "bg-purple-600/40 border border-purple-400/50"
                      : "bg-purple-800/30 hover:bg-purple-700/40 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.emoji}</span>
                    <div className="flex-1">
                      <div className="text-white font-medium">{goal.name}</div>
                      <div className="text-purple-200/60 text-sm">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(goal.current_amount)}{" "}
                        /{" "}
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(goal.goal_amount)}
                      </div>
                    </div>
                    {selectedGoalId === goal.id && (
                      <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Amount to Add
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors text-lg"
              required
            />
          </div>

          {/* Selected Goal Preview */}
          {selectedGoal && (
            <div className="bg-purple-800/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{selectedGoal.emoji}</span>
                <span className="text-white font-medium">
                  {selectedGoal.name}
                </span>
              </div>
              <div className="text-purple-200/70 text-sm">
                Adding {amount ? `$${parseFloat(amount).toFixed(2)}` : "$0.00"}{" "}
                will bring your total to{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(
                  selectedGoal.current_amount + (parseFloat(amount) || 0)
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-purple-800/50 hover:bg-purple-700/50 text-purple-200 rounded-lg transition-all duration-500 ease-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all duration-500 ease-out"
            >
              Add Money
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
