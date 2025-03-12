import { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { ExpensePieChartProps } from '@/types';

export default function ExpensePieChart({ data }: ExpensePieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  // Add this ref to track mouse position
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Refined premium color palette - subtle monochromatic with accent
  const COLORS = [
    '#2563EB', // Primary accent blue
    '#3B82F6', // Lighter blue
    '#1D4ED8', // Darker blue
    '#172554', // Navy
    '#1E40AF', // Royal blue
    '#3B82F6', // Light blue
    '#1E3A8A', // Deep blue
    '#0F172A', // Dark navy
    '#475569', // Slate
    '#64748B'  // Light slate
  ];

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add this useEffect to handle clicks outside the chart
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
        setActiveIndex(null);
      }
    };
    
    // Add this to handle mouse leaving the window
    const handleMouseLeave = () => {
      setActiveIndex(null);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Calculate total expenses
  const totalExpenses = data.reduce((sum, item) => sum + item.value, 0);

  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  
  // Refined active sector rendering with subtle animation
  const renderActiveShape = (props: any) => {
    // If no activeIndex is set, return empty group instead of null
    if (activeIndex === null) return <g></g>;

    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    
    return (
      <g>
        {/* Main sector with elegant expansion */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={1}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={0.5}
        />
        {/* Subtle glow effect */}
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 7}
          outerRadius={outerRadius + 10}
          fill={fill}
          opacity={0.1}
          style={{ filter: 'blur(3px)' }}
        />
      </g>
    );
  };

  // Minimal, elegant tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalExpenses) * 100).toFixed(1);
      
      return (
        <div className="backdrop-blur-xl bg-black/60 border border-white/5 px-4 py-3 rounded-lg shadow-xl">
          <p className="text-white font-medium text-sm mb-1">{data.name}</p>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-white/80">₹{data.value.toLocaleString()}</p>
            <p className="text-sm font-medium text-white">{percentage}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handlePieLeave = () => {
    setActiveIndex(null);
  };

  // Determine layout based on window width
  const isVerticalLayout = windowWidth < 768;

  return (
    <div className="bg-[#0A0A0F] p-6 sm:p-7 rounded-xl border border-white/[0.03] shadow-lg">
      <div className="mb-6">
        <h3 className="text-white/90 font-medium text-base tracking-wide">Expenses</h3>
        <div className="flex items-end gap-2 mt-1">
          <p className="text-white font-semibold text-2xl">₹{totalExpenses.toLocaleString()}</p>
          <p className="text-white/40 text-sm pb-0.5">total</p>
        </div>
      </div>
      
      <div className={`flex ${isVerticalLayout ? 'flex-col' : 'flex-row'} gap-6`}>
        <div 
          ref={chartRef}
          className={`${isVerticalLayout ? 'h-64' : 'h-64'} ${isVerticalLayout ? 'w-full' : 'w-2/5'} outline-none`}
          tabIndex={-1} // Remove from tab order
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient 
                    key={`gradient-${index}`} 
                    id={`colorGradient-${index}`} 
                    x1="0" y1="0" x2="0" y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.95}/>
                    <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape}
                data={sortedData}
                cx="50%"
                cy="50%"
                innerRadius={isVerticalLayout ? 50 : 45}
                outerRadius={isVerticalLayout ? 80 : 70}
                paddingAngle={1}
                dataKey="value"
                nameKey="name"
                onMouseEnter={handlePieEnter}
                onMouseLeave={handlePieLeave}
                animationDuration={700}
                animationBegin={0}
                animationEasing="ease-out"
              >
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#colorGradient-${index % COLORS.length})`}
                    stroke="#0A0A0F"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />} 
                wrapperStyle={{ outline: 'none' }}
                cursor={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className={`${isVerticalLayout ? 'w-full' : 'w-3/5'}`}>
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Categories</p>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-2 minimal-scrollbar">
            {sortedData.map((entry, index) => {
              const percentage = ((entry.value / totalExpenses) * 100).toFixed(1);
              return (
                <div 
                  key={`item-${index}`}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    activeIndex === index 
                      ? 'bg-white/[0.05]' 
                      : 'hover:bg-white/[0.02]'
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div 
                    className="h-3 w-3 rounded-sm mr-3"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex items-center justify-between flex-1">
                    <div className="text-sm text-white/80 font-medium truncate max-w-[140px]">
                      {entry.name}
                    </div>
                    <div className="flex items-center gap-3 ml-2">
                      <div className="text-sm text-white/90 tabular-nums font-medium">₹{entry.value.toLocaleString()}</div>
                      <div className="text-xs text-white/40 tabular-nums w-10 text-right">{percentage}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .minimal-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .minimal-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .minimal-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
        }
        .minimal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        /* Add these styles to remove outlines */
        .recharts-wrapper {
          outline: none !important;
        }
        .recharts-surface {
          outline: none !important;
        }
      `}</style>
    </div>
  );
}