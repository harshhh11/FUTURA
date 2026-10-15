import React from 'react';

export const RockyTerrain: React.FC = () => {
  return (
    <div className="absolute -bottom-10 sm:-bottom-16 left-0 right-0 w-full h-[320px] pointer-events-none select-none z-0 overflow-hidden">
      {/* Directional rim lighting from behind rocks */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80%] max-w-[900px] h-[140px] bg-gradient-to-t from-transparent via-[#A9B8C8]/15 to-transparent blur-3xl rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[90px] bg-[#D5B477]/12 blur-2xl rounded-full" />

      {/* Stylized Rocky Monolith Foreground matching Concept 2 video storyboard */}
      <svg 
        viewBox="0 0 1200 320" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover filter contrast-125"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="rockBase" x1="600" y1="0" x2="600" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#282E3B" />
            <stop offset="20%" stopColor="#191C24" />
            <stop offset="65%" stopColor="#0E1015" />
            <stop offset="100%" stopColor="#090A0C" />
          </linearGradient>

          <linearGradient id="rimLight" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="10%" stopColor="rgba(169, 184, 200, 0.1)" />
            <stop offset="40%" stopColor="rgba(213, 180, 119, 0.55)" />
            <stop offset="60%" stopColor="rgba(169, 184, 200, 0.7)" />
            <stop offset="90%" stopColor="rgba(169, 184, 200, 0.15)" />
          </linearGradient>

          <linearGradient id="facetHighlight" x1="500" y1="40" x2="650" y2="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4A5364" stopOpacity="0.7" />
            <stop offset="45%" stopColor="#252A35" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#12151C" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Primary Jagged Rock Silhouette */}
        <path 
          d="M0 320 L0 240 L70 210 L140 230 L220 190 L300 220 L380 150 L490 180 L580 115 L680 150 L770 95 L860 145 L950 110 L1040 170 L1120 150 L1200 220 L1200 320 Z" 
          fill="url(#rockBase)" 
        />

        {/* Sharp Rock Facets & 3D Edges */}
        <path 
          d="M380 150 L490 180 L450 270 L300 220 Z" 
          fill="#1E232D" 
          stroke="rgba(169, 184, 200, 0.15)" 
          strokeWidth="1.2"
        />
        <path 
          d="M580 115 L680 150 L640 280 L490 180 Z" 
          fill="url(#facetHighlight)" 
          stroke="rgba(169, 184, 200, 0.22)" 
          strokeWidth="1.2"
        />
        <path 
          d="M770 95 L860 145 L800 295 L640 280 L680 150 Z" 
          fill="#222732" 
          stroke="rgba(255, 255, 255, 0.1)" 
          strokeWidth="1.2"
        />
        <path 
          d="M860 145 L950 110 L920 285 L800 295 Z" 
          fill="#171A22" 
          stroke="rgba(169, 184, 200, 0.12)" 
          strokeWidth="1"
        />
        <path 
          d="M950 110 L1040 170 L990 300 L920 285 Z" 
          fill="#262C38" 
          stroke="rgba(169, 184, 200, 0.18)" 
          strokeWidth="1.2"
        />

        {/* Specular Edge Highlighting Line */}
        <path 
          d="M0 240 L70 210 L140 230 L220 190 L300 220 L380 150 L490 180 L580 115 L680 150 L770 95 L860 145 L950 110 L1040 170 L1120 150 L1200 220" 
          stroke="url(#rimLight)" 
          strokeWidth="3" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Specular Points on Peaks */}
        <circle cx="770" cy="95" r="3.5" fill="#D5B477" opacity="0.9" />
        <circle cx="580" cy="115" r="3" fill="#A9B8C8" opacity="0.8" />
        <circle cx="950" cy="110" r="2.5" fill="#F4F1EA" opacity="0.7" />
      </svg>
    </div>
  );
};
