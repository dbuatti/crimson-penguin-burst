import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  gradientId: string;
  startColor: string;
  endColor: string;
  backgroundColor?: string;
  children?: React.ReactNode; // Added children prop for custom content
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 128,
  strokeWidth = 12,
  gradientId,
  startColor,
  endColor,
  backgroundColor = 'hsl(var(--muted))',
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size}> {/* Removed -rotate-90 from SVG */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>
      <circle
        stroke={backgroundColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} {/* Apply rotation to circle */}
      />
      <circle
        stroke={`url(#${gradientId})`}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference + ' ' + circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} {/* Apply rotation to circle */}
        style={{ transition: 'stroke-dashoffset 0.35s' }}
      />
      {children && (
        <foreignObject x="0" y="0" width={size} height={size}> {/* Removed rotation from foreignObject */}
          <div className="flex items-center justify-center w-full h-full"> {/* Removed rotation from inner div */}
            {children}
          </div>
        </foreignObject>
      )}
    </svg>
  );
};

export default CircularProgress;