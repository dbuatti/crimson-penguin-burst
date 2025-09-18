import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays, addDays, subWeeks, addWeeks, subMonths, addMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface ChartDataPoint {
  date: string; // 'yyyy-MM-dd' or 'yyyy-MM-dd (Wxx)'
  value: number; // completion percentage
}

interface HabitCompletionChartProps {
  title: string;
  data: ChartDataPoint[];
  averagePercentage: number;
  timeRangeOptions: { label: string; value: string; }[];
  selectedTimeRange: string;
  onTimeRangeChange: (range: string) => void;
  onNavigateDates: (direction: 'prev' | 'next') => void;
  dateRangeLabel: string;
  chartType: 'daily' | 'weekly';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="rounded-lg border bg-popover p-2 text-sm shadow-md">
        <p className="text-muted-foreground">{label}</p>
        <p className="text-foreground font-medium">{value}%</p>
      </div>
    );
  }
  return null;
};

const HabitCompletionChart: React.FC<HabitCompletionChartProps> = ({
  title,
  data,
  averagePercentage,
  timeRangeOptions,
  selectedTimeRange,
  onTimeRangeChange,
  onNavigateDates,
  dateRangeLabel,
  chartType,
}) => {
  const formatXAxis = (tickItem: string) => {
    if (chartType === 'daily') {
      return format(new Date(tickItem), 'M/d');
    } else { // weekly
      const date = new Date(tickItem);
      return `W${format(date, 'w')}`; // Week number
    }
  };

  return (
    <Card className="bg-card border border-border rounded-xl shadow-lg p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
        <CardTitle className="text-xl font-semibold text-foreground">{title}</CardTitle>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span className="font-medium">Avg: {averagePercentage}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigateDates('prev')}
            className="h-7 w-7 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigateDates('next')}
            className="h-7 w-7 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-md"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <p className="text-sm text-muted-foreground mb-4">{dateRangeLabel}</p>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              interval="preserveStartEnd"
              minTickGap={10}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorUv)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center mt-4 p-1 bg-secondary rounded-full shadow-inner border border-border">
        {timeRangeOptions.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => onTimeRangeChange(option.value)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200",
              selectedTimeRange === option.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {option.label}
          </Button>
        ))}
        {/* Optional grid icon for more options, if needed later */}
        {/* <Button variant="ghost" size="sm" className="px-3 py-1 text-xs font-medium rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <Grid3X3 className="h-4 w-4" />
        </Button> */}
      </div>
    </Card>
  );
};

export default HabitCompletionChart;