import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 38 : 30;

  return (
    <div className={`flex flex-col select-none ${className}`}>
      <div className="flex items-center gap-2">
        {/* Modern Deal Shopping Icon */}
        <div
          style={{ width: iconSize, height: iconSize }}
          className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#111111] to-[#232F3E] text-white shadow-md shadow-black/10 shrink-0 border border-white/10"
        >
          {/* Shopping bag with deal tag and curved smile accent */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-white"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {/* Amazon Orange Sparkle Dot */}
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF9900] ring-2 ring-white dark:ring-[#111111]" />
        </div>

        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1 font-extrabold tracking-tight">
            <span className="text-[#111111] dark:text-white font-['Outfit',sans-serif] text-base md:text-lg">
              Deals
            </span>
            <span className="text-[#FF9900] font-['Outfit',sans-serif] text-base md:text-lg">
              Smart
            </span>
            <span className="hidden xs:inline text-xs font-semibold px-1.5 py-0.5 rounded bg-[#FF9900]/10 text-[#FF9900] border border-[#FF9900]/30 ml-0.5">
              PRO
            </span>
          </div>
          {showTagline && (
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-tight">
              Smart Deals. Better Prices. Smarter Shopping.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
