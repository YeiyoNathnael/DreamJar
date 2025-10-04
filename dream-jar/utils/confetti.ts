import { gsap } from 'gsap';

export const triggerConfettiCelebration = () => {
  // Create confetti container
  const confettiContainer = document.createElement('div');
  confettiContainer.style.position = 'fixed';
  confettiContainer.style.top = '0';
  confettiContainer.style.left = '0';
  confettiContainer.style.width = '100%';
  confettiContainer.style.height = '100%';
  confettiContainer.style.pointerEvents = 'none';
  confettiContainer.style.zIndex = '9999';
  confettiContainer.style.overflow = 'hidden';
  
  document.body.appendChild(confettiContainer);
  
  // Confetti emojis
  const confettiTypes = ['🎉', '🎊', '✨', '🌟', '⭐', '💫', '🎯', '🏆', '👑', '💰'];
  
  // Create multiple confetti pieces
  const confettiPieces: HTMLElement[] = [];
  
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement('div');
    piece.innerHTML = confettiTypes[Math.floor(Math.random() * confettiTypes.length)];
    piece.style.position = 'absolute';
    piece.style.fontSize = `${Math.random() * 20 + 20}px`;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = '-50px';
    piece.style.opacity = '0';
    piece.style.transform = 'scale(0)';
    
    confettiContainer.appendChild(piece);
    confettiPieces.push(piece);
  }
  
  // Animate confetti explosion
  gsap.set(confettiPieces, {
    y: -50,
    opacity: 0,
    scale: 0,
    rotation: 0,
  });
  
  // Staggered explosion effect
  gsap.to(confettiPieces, {
    y: window.innerHeight + 100,
    opacity: 1,
    scale: 1,
    rotation: 720,
    duration: 3,
    stagger: 0.05,
    ease: "power2.out",
  });
  
  // Fade out effect
  gsap.to(confettiPieces, {
    opacity: 0,
    duration: 1,
    delay: 2,
    ease: "power2.in",
  });
  
  // Clean up after animation
  setTimeout(() => {
    if (confettiContainer.parentNode) {
      confettiContainer.parentNode.removeChild(confettiContainer);
    }
  }, 4000);
  
  // Screen flash effect
  const flash = document.createElement('div');
  flash.style.position = 'fixed';
  flash.style.top = '0';
  flash.style.left = '0';
  flash.style.width = '100%';
  flash.style.height = '100%';
  flash.style.background = 'rgba(255, 215, 0, 0.3)';
  flash.style.pointerEvents = 'none';
  flash.style.zIndex = '9998';
  flash.style.opacity = '0';
  
  document.body.appendChild(flash);
  
  gsap.to(flash, {
    opacity: 1,
    duration: 0.1,
    ease: "power2.out",
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      if (flash.parentNode) {
        flash.parentNode.removeChild(flash);
      }
    }
  });
};