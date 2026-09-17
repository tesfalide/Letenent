// components/coach/WeeklyActiveChart.tsx
// Interactive Weekly Active Clients Bar Chart matching the Hevy Coach inspiration

import React, { useState } from 'react';
import { INITIAL_WEEKLY_ACTIVE, WeeklyActivePoint } from '@/lib/mock-data';

interface WeeklyActiveChartProps {
  data?: WeeklyActivePoint[];
  isBright?: boolean;
}

export const WeeklyActiveChart: React.FC<WeeklyActiveChartProps> = ({
  data = INITIAL_WEEKLY_ACTIVE,
  isBright = false,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chart configuration
  const yTicks = [16, 12, 8, 4, 0];
  const maxVal = 16;
  const chartHeight = 220; // px
  const chartWidth = 380;

  return (
    <div className="w-full flex flex-col justify-between h-full select-none">
      {/* Tooltip display on hover */}
      <div className="h-6 flex items-center justify-between text-xs mb-2">
        {hoveredIndex !== null && data[hoveredIndex] ? (
          <span className="font-semibold text-blue-600 dark:text-blue-400 animate-fadeIn flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            Week of {data[hoveredIndex].dateLabel || `Week ${hoveredIndex + 1}`}:{' '}
            <strong className="font-black text-slate-900 dark:text-white">
              {data[hoveredIndex].activeCount.toFixed(1)} active clients
            </strong>
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 dark:text-zinc-500">
            Hover over bars to inspect weekly active volume
          </span>
        )}
      </div>

      {/* Main Chart Canvas */}
      <div className="relative w-full" style={{ height: `${chartHeight}px` }}>
        {/* Y Axis Grid Lines & Labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-2">
          {yTicks.map((tick, i) => (
            <div key={tick} className="flex items-center w-full" style={{ height: '0px' }}>
              <span
                className={`text-[10px] font-mono w-6 text-right pr-2 ${
                  isBright ? 'text-slate-400' : 'text-zinc-500'
                }`}
              >
                {tick}
              </span>
              <div
                className={`flex-1 border-b ${
                  tick === 0
                    ? isBright ? 'border-slate-300' : 'border-zinc-700'
                    : isBright ? 'border-slate-200/60 border-dashed' : 'border-zinc-800/80 border-dashed'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="absolute inset-0 pl-8 pr-3 flex items-end justify-between gap-1.5 sm:gap-2">
          {data.map((point, index) => {
            const heightPercent = Math.min(100, Math.max(3, (point.activeCount / maxVal) * 100));
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={point.id}
                className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating tooltip badge on hover */}
                {isHovered && (
                  <div className="absolute -top-7 z-20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap pointer-events-none">
                    {point.activeCount.toFixed(1)}
                  </div>
                )}

                {/* The Bar */}
                <div
                  className={`w-full max-w-[20px] rounded-t-sm transition-all duration-200 ${
                    isHovered
                      ? 'bg-blue-500 scale-y-[1.02] shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                      : 'bg-[#1877F2] hover:bg-blue-500'
                  }`}
                  style={{
                    height: `${heightPercent}%`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X Axis Labels */}
      <div className="pl-8 pr-3 flex items-center justify-between mt-2 pt-1 text-[10px] font-medium text-slate-400 dark:text-zinc-500">
        {data.map((point, index) => (
          <div
            key={point.id}
            className="flex-1 text-center truncate"
            style={{ visibility: point.showAxisLabel ? 'visible' : 'hidden' }}
          >
            {point.dateLabel}
          </div>
        ))}
      </div>
    </div>
  );
};
