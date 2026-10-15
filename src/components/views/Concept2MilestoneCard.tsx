import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/sound';
import { Sparkles, Layers, ShieldCheck, Check } from 'lucide-react';
import { formatINR } from '../../utils/calculations';

type CardFinish = 'silver' | 'gold' | 'obsidian';

interface Concept2MilestoneCardProps {
  className?: string;
  compact?: boolean;
}

export const Concept2MilestoneCard: React.FC<Concept2MilestoneCardProps> = ({ 
  className = '',
  compact = false 
}) => {
  const { userProfile, reducedMotion } = useApp();
  const [activeFinish, setActiveFinish] = useState<CardFinish>('silver');
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Parallax tracking on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 24;
    const y = (e.clientY - rect.top - rect.height / 2) / 24;
    setMouseTilt({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  const setFinish = (finish: CardFinish) => {
    sound.playClick();
    setActiveFinish(finish);
  };

  return (
    <div 
      className={`relative rounded-3xl bg-gradient-to-b from-[#181B22] to-[#0E1015] border border-[#30343B] p-5 sm:p-6 overflow-hidden flex flex-col justify-between select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardContainerRef}
    >
      {/* Background Soft Directional Studio Lighting */}
      <div className="absolute top-0 right-10 w-64 h-64 bg-white/[0.03] blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 left-10 w-48 h-48 bg-[#D5B477]/[0.025] blur-3xl pointer-events-none rounded-full" />

      {/* Top Header of the Milestone Vault Widget */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-[#D5B477] animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A2A5AC]">
            CONCEPT 2 MILESTONE VAULT
          </span>
        </div>

        {/* Card Finish Switchers */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#090A0C] border border-[#30343B]">
          <button
            onClick={() => setFinish('silver')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
              activeFinish === 'silver'
                ? 'bg-[#E6EDF5] text-[#090A0C] font-bold shadow-sm'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
            }`}
            title="Silver Finish (Classic)"
          >
            Silver
          </button>
          <button
            onClick={() => setFinish('gold')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
              activeFinish === 'gold'
                ? 'bg-[#D5B477] text-[#090A0C] font-bold shadow-sm'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
            }`}
            title="Gold Finish (Growth)"
          >
            Gold
          </button>
          <button
            onClick={() => setFinish('obsidian')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
              activeFinish === 'obsidian'
                ? 'bg-[#303642] text-[#F4F1EA] font-bold shadow-sm border border-white/20'
                : 'text-[#A2A5AC] hover:text-[#F4F1EA]'
            }`}
            title="Obsidian Finish (Corpus)"
          >
            Obsidian
          </button>
        </div>
      </div>

      {/* 3D PERSPECTIVE STAGE CONTAINER */}
      <div className="relative w-full h-[290px] sm:h-[320px] flex items-center justify-center my-auto py-2">
        <div 
          className="relative w-[240px] sm:w-[260px] h-[300px] flex items-center justify-center"
          style={{
            perspective: '1200px',
            transform: `rotateX(${-mouseTilt.y * 0.35}deg) rotateY(${mouseTilt.x * 0.35}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.35s ease-out'
          }}
        >
          {/* THE ASYMMETRIC 3D METALLIC SILVER CARD */}
          <div
            className={`relative select-none cursor-pointer z-20 ${
              reducedMotion ? '' : 'animate-card-floating'
            }`}
            style={{
              transform: reducedMotion 
                ? 'translateY(-2px) rotateX(15deg) rotateY(-24deg) rotateZ(32deg)' 
                : undefined,
              transformStyle: 'preserve-3d',
            }}
            onClick={() => {
              const finishes: CardFinish[] = ['silver', 'gold', 'obsidian'];
              const next = finishes[(finishes.indexOf(activeFinish) + 1) % finishes.length];
              setFinish(next);
            }}
          >
            {/* Card Chassis: Vertical Card with Sharp Diagonal Reflection Seam */}
            <div 
              className="w-[180px] sm:w-[195px] h-[280px] sm:h-[300px] rounded-[16px] p-4 relative overflow-hidden transition-all duration-500"
              style={{
                background: activeFinish === 'silver'
                  ? 'linear-gradient(134deg, #F0F4F8 0%, #D4DDE8 32%, #A8B4C2 41%, #14171E 42%, #0A0C10 70%, #050608 100%)'
                  : activeFinish === 'gold'
                  ? 'linear-gradient(134deg, #FFF4DC 0%, #E8CD96 32%, #D5B477 41%, #241D12 42%, #0F0C07 70%, #050402 100%)'
                  : 'linear-gradient(134deg, #5A6270 0%, #303642 32%, #1C2028 41%, #0D0E12 42%, #060709 70%, #020203 100%)',
                boxShadow: `
                  0 35px 80px -15px rgba(0, 0, 0, 0.95),
                  0 12px 30px -8px rgba(0, 0, 0, 0.8),
                  inset 0 1.5px 2px rgba(255, 255, 255, 0.85),
                  inset -1.5px -1.5px 2px rgba(0, 0, 0, 0.85),
                  0 0 0 1px rgba(255, 255, 255, 0.28)
                `
              }}
            >
              {/* 1. Razor-sharp 1px diagonal specular reflection seam */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    linear-gradient(134deg, 
                      rgba(255,255,255,0.4) 0%, 
                      rgba(255,255,255,0.15) 35%, 
                      rgba(255,255,255,0.95) 41%, 
                      rgba(0,0,0,0.6) 42%, 
                      rgba(0,0,0,0.8) 75%, 
                      rgba(255,255,255,0.15) 100%
                    )
                  `
                }}
              />

              {/* 2. Soft Moving Specular Highlight across the brushed metal */}
              <div 
                className={`absolute inset-0 pointer-events-none ${
                  reducedMotion ? 'hidden' : 'animate-card-shimmer'
                }`}
                style={{
                  background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.3) 48%, rgba(255,255,255,0.7) 52%, transparent 80%)',
                  backgroundSize: '200% 200%'
                }}
              />

              {/* 3. Specular Rim Edge on the right boundary */}
              <div 
                className="absolute inset-y-0 right-0 w-[2.5px] pointer-events-none opacity-85"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.2) 100%)',
                  boxShadow: '0 0 8px rgba(255,255,255,0.85)'
                }}
              />

              {/* 4. Fine Metallic Chamfered Edge */}
              <div className="absolute inset-0 rounded-[16px] pointer-events-none border border-white/30" />

              {/* CARD CONTENT */}
              <div className="relative z-10 w-full h-full flex flex-col justify-between">
                {/* Top Wordmark: "futura" in lowercase */}
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm sm:text-base tracking-widest lowercase text-white/90 drop-shadow-sm">
                    futura
                  </span>
                  <span className="text-[8px] font-mono tracking-widest text-white/60 uppercase">
                    Vault
                  </span>
                </div>

                {/* EMV Microchip Contacts */}
                <div className="w-9 h-7 rounded-md bg-gradient-to-br from-[#E2E6EC] via-[#A8B2C0] to-[#757E8C] p-[1px] shadow-sm relative overflow-hidden border border-white/50 -mt-6">
                  <div className="w-full h-full rounded-[3px] bg-[#C2CAD4] relative flex items-center justify-center">
                    <div className="absolute inset-x-0 h-[1px] bg-black/35 top-2" />
                    <div className="absolute inset-x-0 h-[1px] bg-black/35 bottom-2" />
                    <div className="absolute inset-y-0 w-[1px] bg-black/35 left-2.5" />
                    <div className="absolute inset-y-0 w-[1px] bg-black/35 right-2.5" />
                    <div className="w-2.5 h-2.5 rounded-full border border-black/35" />
                  </div>
                </div>

                {/* Bottom Row: Contactless Symbol & Target Balance */}
                <div className="flex items-end justify-between pb-0.5">
                  <div className="text-left">
                    <span className="block text-[8px] font-mono text-white/60 uppercase">Target Corpus</span>
                    <span className="text-[13px] font-mono font-bold text-white tracking-tight drop-shadow-sm">
                      {formatINR(userProfile.goalTargetAmount)}
                    </span>
                  </div>

                  {/* Contactless Radio Wave Symbol */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/80 drop-shadow-sm shrink-0">
                    <path d="M12 4C16.4183 4 20 7.58172 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M12 7.5C14.7614 7.5 17 9.73858 17 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M12 11C13.1046 11 14 11.8954 14 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <circle cx="12" cy="13.5" r="1.2" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* THE ANGULAR METALLIC PEDESTAL */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-[42%] w-[210px] pointer-events-none z-10 flex flex-col items-center">
            {/* Illuminated Top Facet of the Pedestal (Trapezoid in perspective) */}
            <div 
              className={`w-full h-7 relative ${
                reducedMotion ? '' : 'animate-pedestal-glow'
              }`}
              style={{
                clipPath: 'polygon(16% 0%, 84% 0%, 100% 100%, 0% 100%)',
                background: 'linear-gradient(90deg, #8E97A4 0%, #E6EDF5 30%, #FFFFFF 50%, #CAD2DC 70%, #76808E 100%)',
                boxShadow: '0 0 24px rgba(255, 255, 255, 0.45)'
              }}
            >
              {/* Highlight Ridge across the illuminated top facet */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-white opacity-95" />
            </div>

            {/* Dark Beveled Underside of Pedestal */}
            <div 
              className="w-full h-8 relative -mt-[1px]"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 86% 100%, 14% 100%)',
                background: 'linear-gradient(180deg, #1C2028 0%, #0E1015 60%, #050608 100%)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Sharp Bevel Seams */}
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/20" />
            </div>

            {/* Floor Contact Shadow */}
            <div 
              className="w-[220px] h-6 -mt-3 blur-md rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 80%)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Vault Status Footnote */}
      <div className="flex items-center justify-between pt-3 border-t border-[#30343B]/60 text-xs font-mono text-[#A2A5AC] z-10">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8BC6A1]" />
          <span>Secured Vault Token</span>
        </div>
        <span className="text-[#F4F1EA]">Click card or tabs to toggle alloy</span>
      </div>
    </div>
  );
};
