"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Goal, User } from "@/types";
import {
  getGoals,
  saveGoals,
  getUser,
  calculateTotalSaved,
  generateId,
} from "@/utils/storage";
import { triggerConfettiCelebration } from "@/utils/confetti";
import GoalCard from "@/components/GoalCard";
import AddGoalModal from "@/components/AddGoalModal";
import GoalDetailsModal from "@/components/GoalDetailsModal";
import AddFundsModal from "@/components/AddFundsModal";

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isGoalDetailsModalOpen, setIsGoalDetailsModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const headerRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLDivElement>(null);
  const goalsGridRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = () => {
      const loadedGoals = getGoals();
      const loadedUser = getUser();

      setGoals(loadedGoals);
      setUser(loadedUser);
      setIsLoading(false);
    };

    // Small delay to show loading state
    setTimeout(loadData, 500);
  }, []);

  // Animations
  useEffect(() => {
    if (!isLoading && headerRef.current && totalRef.current && fabRef.current) {
      const tl = gsap.timeline();

      // Header animation
      tl.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // Total saved animation
      tl.fromTo(
        totalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4"
      );

      // Enhanced animations for total saved card
      const totalCard = totalRef.current.querySelector(".total-card");
      const totalAmount = totalRef.current.querySelector(".total-amount");
      const totalLabel = totalRef.current.querySelector(".total-label");
      const totalSubtitle = totalRef.current.querySelector(".total-subtitle");

      // Pulsing glow effect
      gsap.to(totalCard, {
        boxShadow:
          "0 0 40px rgba(183, 148, 244, 0.5), 0 0 80px rgba(183, 148, 244, 0.3), inset 0 0 20px rgba(183, 148, 244, 0.1)",
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });

      // Subtle floating animation
      gsap.to(totalCard, {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });

      // Animated number counting effect (if totalSaved > 0)
      if (totalSaved > 0) {
        gsap.fromTo(
          totalAmount,
          {
            scale: 0.8,
            opacity: 0.7,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "back.out(1.7)",
            delay: 0.5,
          }
        );

        // Subtle pulse on the amount
        gsap.to(totalAmount, {
          scale: 1.02,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: 1,
        });
      }

      // Staggered text animations
      gsap.fromTo(
        [totalLabel, totalSubtitle],
        {
          y: 20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.3,
        }
      );

      // FAB animation
      tl.fromTo(
        fabRef.current,
        { scale: 0, rotate: -180 },
        { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3"
      );

      // FAB floating animation
      gsap.to(fabRef.current, {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }
  }, [isLoading]);

  const totalSaved = calculateTotalSaved(goals);

  const handleAddGoal = (goalData: Omit<Goal, "id" | "created_at">) => {
    const newGoal: Goal = {
      ...goalData,
      id: generateId(),
      created_at: new Date().toISOString(),
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const handleEditGoal = (goalData: Omit<Goal, "id" | "created_at">) => {
    if (!editingGoal) return;

    const updatedGoal: Goal = {
      ...editingGoal,
      ...goalData,
    };

    const updatedGoals = goals.map((goal) =>
      goal.id === editingGoal.id ? updatedGoal : goal
    );

    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    setEditingGoal(null);
  };

  const openGoalDetails = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsGoalDetailsModalOpen(true);
  };

  const closeGoalDetails = () => {
    setIsGoalDetailsModalOpen(false);
    setSelectedGoal(null);
  };

  const openAddFundsModal = () => {
    setIsAddFundsModalOpen(true);
  };

  const closeAddFundsModal = () => {
    setIsAddFundsModalOpen(false);
  };

  const openAddGoalModal = () => {
    setIsAddGoalModalOpen(true);
  };

  const closeAddGoalModal = () => {
    setIsAddGoalModalOpen(false);
    setEditingGoal(null);
  };

  const handleAddFunds = (goalId: string, amount: number) => {
    const targetGoal = goals.find((goal) => goal.id === goalId);
    const wasCompleted = targetGoal
      ? targetGoal.current_amount >= targetGoal.goal_amount
      : false;

    const updatedGoals = goals.map((goal) =>
      goal.id === goalId
        ? { ...goal, current_amount: goal.current_amount + amount }
        : goal
    );

    // Check if goal was just completed
    const updatedGoal = updatedGoals.find((goal) => goal.id === goalId);
    const isNowCompleted = updatedGoal
      ? updatedGoal.current_amount >= updatedGoal.goal_amount
      : false;

    if (!wasCompleted && isNowCompleted) {
      // Trigger celebration for newly completed goal
      setTimeout(() => triggerConfettiCelebration(), 300);
    }

    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const handleGoalComplete = (goal: Goal) => {
    triggerConfettiCelebration();
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0A17] via-[#1a1025] to-[#2a1f3d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading your dreams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0A17] via-[#1a1025] to-[#2a1f3d] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/15 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-pink-500/15 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/4 w-48 h-48 bg-purple-400/15 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-pink-400/15 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-600/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-28 h-28 bg-purple-300/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-1/3 w-32 h-32 bg-pink-300/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header ref={headerRef} className="text-center mb-16">
          <div
            className="inline-flex items-center gap-6 bg-gradient-to-r from-purple-900/40 to-purple-800/40 backdrop-blur-md border border-purple-500/30 rounded-3xl px-12 py-8 shadow-2xl"
            style={{
              boxShadow:
                "0 0 40px rgba(183, 148, 244, 0.3), inset 0 0 40px rgba(183, 148, 244, 0.1)",
            }}
          >
            <div className="text-7xl">{user?.avatar || "🌟"}</div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {getTimeBasedGreeting()}, Nate!
              </h1>
              <p className="text-purple-200/80 text-xl">
                Here's your progress 🌙
              </p>
            </div>
          </div>
        </header>

        {/* Total Saved */}
        <div ref={totalRef} className="text-center mb-16">
          <div className="total-card w-full max-w-4xl mx-auto bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-md border border-purple-400/40 rounded-3xl px-20 py-16 shadow-2xl relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl animate-pulse"></div>
              <div
                className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-lg animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-1/2 left-1/3 w-8 h-8 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-md animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <p className="total-label text-purple-200/90 text-3xl mb-6 font-medium">
                Total Saved
              </p>
              <p className="total-amount text-9xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-6 filter drop-shadow-lg">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(totalSaved)}
              </p>
              <p className="total-subtitle text-purple-300/70 text-2xl">
                Across all goals
              </p>
            </div>

            {/* Sparkle effects */}
            <div
              className="absolute top-8 right-8 text-2xl animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              ✨
            </div>
            <div
              className="absolute bottom-8 left-8 text-xl animate-bounce"
              style={{ animationDelay: "1.5s" }}
            >
              💫
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div ref={goalsGridRef} className="mb-20">
          {goals.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">✨</div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Your dream jar is empty
              </h2>
              <p className="text-purple-200/70 text-lg mb-8 max-w-md mx-auto">
                Start your savings journey by adding your first goal. Every
                dream begins with a single step!
              </p>
              <button
                onClick={openAddGoalModal}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 ease-out transform hover:scale-105"
              >
                <span className="text-2xl">+</span>
                Add Your First Goal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onClick={openGoalDetails}
                  onComplete={handleGoalComplete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button - Add Money */}
        {goals.length > 0 && (
          <button
            ref={fabRef}
            onClick={openAddFundsModal}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl font-light transition-all duration-500 ease-out transform hover:scale-110 z-20"
            title="Add Money"
          >
            💰
          </button>
        )}

        {/* Add Goal Button - only show when there are goals */}
        {goals.length > 0 && (
          <button
            onClick={openAddGoalModal}
            className="fixed bottom-8 left-8 w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl font-light transition-all duration-500 ease-out transform hover:scale-110 z-20"
            title="Add Goal"
          >
            +
          </button>
        )}
      </div>

      {/* Add/Edit Goal Modal */}
      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={closeAddGoalModal}
        onSubmit={editingGoal ? handleEditGoal : handleAddGoal}
        editingGoal={editingGoal}
      />

      {/* Goal Details Modal */}
      <GoalDetailsModal
        goal={selectedGoal}
        isOpen={isGoalDetailsModalOpen}
        onClose={closeGoalDetails}
        onAddFunds={handleAddFunds}
      />

      {/* Add Funds Modal */}
      <AddFundsModal
        goals={goals}
        isOpen={isAddFundsModalOpen}
        onClose={closeAddFundsModal}
        onAddFunds={handleAddFunds}
      />
    </div>
  );
}
