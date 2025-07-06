"use client";
import React from "react";

interface VanaraLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "text";
  className?: string;
}

export default function VanaraLogo({ 
  size = "md", 
  variant = "full", 
  className = "" 
}: VanaraLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl", 
    xl: "text-3xl"
  };

  // Stylized Vanara symbol - geometric interpretation
  const VanaraIcon = () => (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Main body - abstract vanara silhouette */}
        <path
          d="M20 4C24.5 4 28 7.5 28 12C28 14 27 15.5 25.5 16.5L32 22C33 23 33 24.5 32 25.5L28 29.5C27 30.5 25.5 30.5 24.5 29.5L20 25L15.5 29.5C14.5 30.5 13 30.5 12 29.5L8 25.5C7 24.5 7 23 8 22L14.5 16.5C13 15.5 12 14 12 12C12 7.5 15.5 4 20 4Z"
          fill="url(#vanaraGradient)"
          className="drop-shadow-sm"
        />
        
        {/* Intelligence symbol - abstract brain/crown */}
        <circle
          cx="20"
          cy="12"
          r="3"
          fill="url(#goldGradient)"
          className="opacity-90"
        />
        
        {/* Agility lines - movement indicators */}
        <path
          d="M16 20L18 18M22 18L24 20M18 24L20 22L22 24"
          stroke="url(#goldGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-70"
        />
        
        <defs>
          <linearGradient id="vanaraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D5A3D" />
            <stop offset="100%" stopColor="#264653" />
          </linearGradient>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4A261" />
            <stop offset="100%" stopColor="#E76F51" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  if (variant === "icon") {
    return <VanaraIcon />;
  }

  if (variant === "text") {
    return (
      <span className={`${textSizeClasses[size]} font-bold vanara-text-gradient ${className}`}>
        Vanara.ai
      </span>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <VanaraIcon />
      <span className={`${textSizeClasses[size]} font-bold vanara-text-gradient`}>
        Vanara.ai
      </span>
    </div>
  );
}