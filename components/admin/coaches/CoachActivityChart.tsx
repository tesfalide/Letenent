// components/admin/coaches/CoachActivityChart.tsx
// Interactive Coaching Activity Trend Visualizer

import React, { useState, useEffect } from 'react';
import { CoachChartDataPoint } from '@/types';
import { adminCoachService } from '@/lib/services/adminCoachService';
import { BarChart3, Users, Dumbbell, Folder, MessageSquare } from 'lucide-react';

interface CoachActivityChartProps {
  coachId: string;
}

type MetricKey = 'traineeActivity' | 'workoutActivity' | 'programActivity' | 'messages';

interface MetricConfig {
  key: MetricKey;
  label: string;
  color: string;
  fill: string;
  icon: React.ComponentType<{ className?: string }>;
}

const METRICS: MetricConfig[] = [
  {
    key: 'traineeActivity',
    label: 'Trainee Activity',
    color: '#1877F2',
    fill: 'rgba(24, 119, 242, 0.15)',
    icon: Users,
  },
  {
    key: 'workoutActivity',
    label: 'Workout Activity',
    color: '#10B981',
    fill: 'rgba(16, 185, 129, 0.15)',
    icon: Dumbbell,
  },
  {
    key: 'programActivity',
    label: 'Program Activity',
    color: '#F59E0B',
    fill: 'rgba(245, 158, 11, 0.15)',
    icon: Folder,
  },
  {
    key: 'messages',
    label: 'Messages',
    color: '#8B5CF6',
    fill: 'rgba(139, 92, 246, 0.15)',
    icon: MessageSquare,
  },
];

export const CoachActivityChart: React.FC<CoachActivityChartProps> = ({ coachId }) => {
  const [range, setRange] = useState<'7D' | '30D' | '90D' | '6M'>('30D');
  const [dataPoints, setDataPoints] = useState<CoachChartDataPoint[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey | 'ALL'>('ALL');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    adminCoachService
      .getCoachActivityChartData(coachId, range)
      .then((points) => {
        if (isMounted) {
          setDataPoints(points);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching chart points:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [coachId, range]);

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4 animate-pulse">
        <div className="h-5 w-40 bg-zinc-800 rounded" />
        <div className="h-52 bg-zinc-800/60 rounded-xl" />
      </div>
    );
  }

  // Calculate max value for SVG scaling
  const allValues = dataPoints.flatMap((d) =>
    selectedMetric === 'ALL'
      ? [d.traineeActivity, d.workoutActivity, d.programActivity, d.messages]
      : [d[selectedMetric]]
  );
  const maxValue = Math.max(...allValues, 10) * 1.2;

  // Chart dimensions
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (dataPoints.length <= 1) return paddingLeft;
    return paddingLeft + (index / (dataPoints.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return paddingTop + chartHeight - (value / maxValue) * chartHeight;
  };

  const renderLine = (metric: MetricConfig) => {
    if (selectedMetric !== 'ALL' && selectedMetric !== metric.key) return null;

    const pathPoints = dataPoints.map((d, i) => `${getX(i)},${getY(d[metric.key])}`);
    const linePath = `M ${pathPoints.join(' L ')}`;

    // Area path for subtle glowing background under line
    const areaPath = `M ${getX(0)},${paddingTop + chartHeight} L ${pathPoints.join(' L ')} L ${getX(
      dataPoints.length - 1
    )},${paddingTop + chartHeight} Z`;

    return (
      <g key={metric.key}>
        {/* Fill area */}
        <path d={areaPath} fill={metric.fill} />
        {/* Stroke Line */}
        <path
          d={linePath}
          fill="none"
          stroke={metric.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Interactive Data Point Circles */}
        {dataPoints.map((d, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(d[metric.key])}
            r={hoveredIndex === i ? '5' : '3'}
            fill={metric.color}
            stroke="#09090b"
            strokeWidth="2"
            className="transition-all duration-150"
          />
        ))}
      </g>
    );
  };

  const activePoint = hoveredIndex !== null ? dataPoints[hoveredIndex] : null;

  return (
    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
      {/* Header with Title and Range Picker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#1877F2]" />
            <span>Coaching Activity</span>
          </h3>
          <p className="text-[11px] text-zinc-400">
            Activity telemetry across workout logging, programming, and athlete interactions.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
          {(['7D', '30D', '90D', '6M'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                range === r
                  ? 'bg-[#1877F2] text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <button
          onClick={() => setSelectedMetric('ALL')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            selectedMetric === 'ALL'
              ? 'bg-zinc-200 text-zinc-950'
              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
          }`}
        >
          All Metrics
        </button>
        {METRICS.map((m) => {
          const Icon = m.icon;
          const isSelected = selectedMetric === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                isSelected
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: m.color }}
              />
              <Icon className="w-3 h-3" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + chartHeight * ratio;
            const value = Math.round(maxValue * (1 - ratio));
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#27272a"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#71717a"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Metric Lines */}
          {METRICS.map(renderLine)}

          {/* Hover highlight bar */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={paddingTop}
              x2={getX(hoveredIndex)}
              y2={paddingTop + chartHeight}
              stroke="#52525b"
              strokeDasharray="2 2"
              strokeWidth="1.5"
            />
          )}

          {/* X Axis Date Labels */}
          {dataPoints.map((d, i) => {
            // Show every 1-2 points to avoid crowding
            const showLabel =
              dataPoints.length <= 8 ||
              i % Math.ceil(dataPoints.length / 6) === 0 ||
              i === dataPoints.length - 1;
            if (!showLabel) return null;

            return (
              <text
                key={i}
                x={getX(i)}
                y={svgHeight - 8}
                textAnchor="middle"
                fill="#71717a"
                fontSize="10"
              >
                {d.label}
              </text>
            );
          })}

          {/* Invisible interactive hover rects */}
          {dataPoints.map((_, i) => (
            <rect
              key={i}
              x={getX(i) - (chartWidth / dataPoints.length) / 2}
              y={paddingTop}
              width={chartWidth / dataPoints.length}
              height={chartHeight}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              className="cursor-crosshair"
            />
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activePoint && hoveredIndex !== null && (
          <div
            className="absolute top-2 pointer-events-none z-10 px-3 py-2 rounded-xl bg-zinc-950/95 border border-zinc-700 shadow-2xl text-[11px] backdrop-blur-md transition-all space-y-1"
            style={{
              left: `${Math.min(Math.max((hoveredIndex / dataPoints.length) * 100, 10), 80)}%`,
            }}
          >
            <div className="font-bold text-white border-b border-zinc-800 pb-1">
              {activePoint.label}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between gap-3 text-[#1877F2]">
                <span>Trainee Activity:</span>
                <span className="font-bold">{activePoint.traineeActivity}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-emerald-400">
                <span>Workout Activity:</span>
                <span className="font-bold">{activePoint.workoutActivity}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-amber-400">
                <span>Program Activity:</span>
                <span className="font-bold">{activePoint.programActivity}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-purple-400">
                <span>Messages:</span>
                <span className="font-bold">{activePoint.messages}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
