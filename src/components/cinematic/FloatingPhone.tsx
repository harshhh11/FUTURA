import React, { ReactNode } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface FloatingPhoneProps {
  children: ReactNode;
  tiltAngle?: { x: number; y: number };
  baseRotation?: number; // e.g. -2 for left phone, +3 for right phone
  translateY?: number;
  className?: string;
  isFloating?: boolean;
  reverseFloat?: boolean;
  scale?: number;
  glowColor?: string;
}

export const FloatingPhone: React.FC<FloatingPhoneProps> = ({
  children,
  tiltAngle = { x: 0, y: 0 },
  baseRotation = 0,
  translateY = 0,
  className = '',
  isFloating = true,
  reverseFloat = false,
  scale = 1,
  glowColor = 'rgba(169, 184, 200, 0.15)',
}) => {
  return (
    <div
      className={`relative transition-transform duration-700 ease-out select-none ${
        isFloating ? (reverseFloat ? 'animate-float-reverse' : 'animate-float-slow') : ''
      } ${className}`}
      style={{
        transform: `perspective(1200px) rotateX(${tiltAngle.x}deg) rotateY(${tiltAngle.y}deg) rotate(${baseRotation}deg) translateY(${translateY}px) scale(${scale})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Outer Titanium Chassis & Thin Silver Rim Reflection */}
      <div 
        className="w-[295px] sm:w-[325px] h-[610px] sm:h-[665px] rounded-[50px] p-[10px] bg-gradient-to-b from-[#383E4C] via-[#1B1E26] to-[#0D0F14] relative transition-shadow duration-300"
        style={{
          boxShadow: `
            0 30px 80px -15px rgba(0, 0, 0, 0.95),
            0 0 50px -10px ${glowColor},
            inset 0 1px 1px rgba(255, 255, 255, 0.25),
            inset 0 -1px 1px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(169, 184, 200, 0.3)
          `
        }}
      >
        {/* Subtle Chamfered Edge Sheen */}
        <div className="absolute inset-0 rounded-[50px] pointer-events-none border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />

        {/* Side physical buttons */}
        <div className="absolute -left-[12px] top-[125px] w-[3px] h-[28px] bg-[#2A2F3B] rounded-l-sm" />
        <div className="absolute -left-[12px] top-[170px] w-[3px] h-[48px] bg-[#2A2F3B] rounded-l-sm" />
        <div className="absolute -left-[12px] top-[230px] w-[3px] h-[48px] bg-[#2A2F3B] rounded-l-sm" />
        <div className="absolute -right-[12px] top-[180px] w-[3px] h-[70px] bg-[#2A2F3B] rounded-r-sm" />

        {/* Inner Glass Display Bezel */}
        <div className="w-full h-full rounded-[42px] bg-[#090A0C] border border-[#1E232E] overflow-hidden flex flex-col relative shadow-inner">
          {/* Status Bar */}
          <div className="h-10 px-6 pt-2.5 flex items-center justify-between text-[11px] font-semibold text-[#F4F1EA] z-30 shrink-0">
            <span className="font-mono text-[11px]">9:41</span>

            {/* Dynamic Island Pill */}
            <div className="w-20 h-5 bg-black rounded-full border border-[#222733] flex items-center justify-between px-2.5 mx-auto -translate-x-1 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#15171D] border border-white/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#1E232E]" />
            </div>

            <div className="flex items-center space-x-1 text-[#F4F1EA]/90">
              <span className="text-[9px] font-mono font-bold mr-0.5">5G</span>
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Glare Glass Highlight overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.035] to-transparent z-20" />

          {/* Actual Screen UI Content */}
          <div className="flex-1 overflow-hidden px-4 pb-4 pt-1 text-[#F4F1EA] flex flex-col">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="h-4 flex items-center justify-center shrink-0 z-30">
            <div className="w-32 h-1 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
