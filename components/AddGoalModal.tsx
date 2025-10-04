"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Goal } from "@/types";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<Goal, "id" | "created_at">) => void;
  editingGoal?: Goal | null;
}

const EMOJI_OPTIONS = [
  "🏠",
  "🚗",
  "✈️",
  "🎓",
  "💍",
  "🏖️",
  "🎮",
  "📱",
  "💻",
  "🎸",
  "📚",
  "🍕",
  "☕",
  "🎨",
  "🏆",
  "💎",
  "🌟",
  "🚀",
  "🔥",
  "💡",
  "🎯",
  "🌈",
  "⭐",
  "🎉",
];

export default function AddGoalModal({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
}: AddGoalModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    emoji: "🎯",
    goal_amount: "",
    current_amount: "",
    priority: 1 as 1 | 2 | 3,
  });

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        name: editingGoal.name,
        description: editingGoal.description,
        emoji: editingGoal.emoji,
        goal_amount: editingGoal.goal_amount.toString(),
        current_amount: editingGoal.current_amount.toString(),
        priority: editingGoal.priority,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        emoji: "🎯",
        goal_amount: "",
        current_amount: "",
        priority: 1,
      });
    }
  }, [editingGoal, isOpen]);

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

    if (!formData.name.trim() || !formData.goal_amount) return;

    const goalData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      emoji: formData.emoji,
      goal_amount: parseFloat(formData.goal_amount),
      current_amount: parseFloat(formData.current_amount) || 0,
      priority: formData.priority,
    };

    onSubmit(goalData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
          <h2 className="text-2xl font-bold text-white mb-2">
            {editingGoal ? "Edit Goal" : "Add New Goal"}
          </h2>
          <p className="text-purple-200/70">
            {editingGoal
              ? "Update your savings goal"
              : "Create a new savings goal"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji Selection */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Choose an emoji
            </label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleInputChange("emoji", emoji)}
                  className={`w-10 h-10 rounded-lg text-2xl flex items-center justify-center transition-all duration-200 ${
                    formData.emoji === emoji
                      ? "bg-purple-600 scale-110"
                      : "bg-purple-800/30 hover:bg-purple-700/50"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Name */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Goal Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Dream Vacation"
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your goal..."
              rows={3}
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors resize-none"
            />
          </div>

          {/* Goal Amount */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Goal Amount *
            </label>
            <input
              type="number"
              value={formData.goal_amount}
              onChange={(e) => handleInputChange("goal_amount", e.target.value)}
              placeholder="1000"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
              required
            />
          </div>

          {/* Current Amount */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Current Amount
            </label>
            <input
              type="number"
              value={formData.current_amount}
              onChange={(e) =>
                handleInputChange("current_amount", e.target.value)
              }
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition-colors"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => handleInputChange("priority", priority)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData.priority === priority
                      ? priority === 1
                        ? "bg-red-600 text-white"
                        : priority === 2
                        ? "bg-yellow-600 text-white"
                        : "bg-green-600 text-white"
                      : "bg-purple-800/30 text-purple-200 hover:bg-purple-700/50"
                  }`}
                >
                  {priority === 1 ? "High" : priority === 2 ? "Medium" : "Low"}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-purple-800/50 hover:bg-purple-700/50 text-purple-200 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all duration-200"
            >
              {editingGoal ? "Update Goal" : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
