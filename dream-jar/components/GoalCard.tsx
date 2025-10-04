"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Goal } from "@/types";

interface GoalCardProps {
  goal: Goal;
  onClick: (goal: Goal) => void;
  onComplete?: (goal: Goal) => void;
}

export default function GoalCard({ goal, onClick, onComplete }: GoalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prevCompletedRef = useRef(false);

  const isCompleted = goal.current_amount >= goal.goal_amount;

  // Trigger celebration when goal becomes completed
  useEffect(() => {
    if (!prevCompletedRef.current && isCompleted && onComplete) {
      onComplete(goal);
    }
    prevCompletedRef.current = isCompleted;
  }, [isCompleted, goal, onComplete]);

  useEffect(() => {
    const card = cardRef.current;

    if (card) {
      // Initial animation
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        }
      );

      // Smooth floating animation (optimized for performance)
      gsap.to(card, {
        y: isCompleted ? -8 : -5,
        duration: isCompleted ? 2.5 : 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Golden glow for completed goals (reduced frequency)
      if (isCompleted) {
        gsap.to(card, {
          boxShadow:
            "0 0 25px rgba(255, 215, 0, 0.4), 0 0 50px rgba(255, 215, 0, 0.2)",
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Smooth hover animations
      const handleMouseEnter = () => {
        gsap.to(card, {
          scale: isCompleted ? 1.06 : 1.03,
          y: isCompleted ? -12 : -10,
          duration: 0.4,
          ease: "power1.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          scale: 1,
          y: isCompleted ? -8 : -5,
          duration: 0.5,
          ease: "power1.inOut",
        });
      };

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [isCompleted]);

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(goal)}
      className={`relative backdrop-blur-sm rounded-2xl p-8 shadow-2xl transition-all duration-300 cursor-pointer group ${
        isCompleted
          ? "bg-gradient-to-br from-yellow-500/30 to-amber-600/40 border border-yellow-400/40 hover:shadow-yellow-500/30"
          : "bg-gradient-to-br from-purple-900/20 to-purple-800/30 border border-purple-500/20 hover:shadow-purple-500/20"
      }`}
    >
      {/* Hover glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
          isCompleted
            ? "bg-gradient-to-br from-yellow-400/0 group-hover:from-yellow-400/15 to-amber-400/0 group-hover:to-amber-400/15"
            : "bg-gradient-to-br from-purple-400/0 group-hover:from-purple-400/10 to-pink-400/0 group-hover:to-pink-400/10"
        }`}
      />

      {/* Completion crown */}
      {isCompleted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce">
          👑
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Emoji */}
        <div
          className={`text-6xl mb-6 group-hover:scale-110 transition-transform duration-500 ease-out ${
            isCompleted ? "animate-pulse" : ""
          }`}
        >
          {goal.emoji}
        </div>

        {/* Goal name */}
        <h3
          className={`font-semibold text-xl mb-2 transition-colors duration-300 ${
            isCompleted
              ? "text-yellow-100 group-hover:text-yellow-50"
              : "text-white group-hover:text-purple-200"
          }`}
        >
          {goal.name}
        </h3>

        {/* Completion badge */}
        {isCompleted && (
          <div
            className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold mb-3"
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            🎯 COMPLETED!
          </div>
        )}

        {/* Subtle progress indicator */}
        <div
          className={`w-full rounded-full h-1 mt-4 ${
            isCompleted ? "bg-yellow-900/30" : "bg-purple-900/30"
          }`}
        >
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isCompleted
                ? "bg-gradient-to-r from-yellow-400 to-amber-400"
                : "bg-gradient-to-r from-purple-400 to-pink-400"
            }`}
            style={{
              width: `${Math.min(
                (goal.current_amount / goal.goal_amount) * 100,
                100
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
