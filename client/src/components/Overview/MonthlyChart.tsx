import { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { MonthlyChartProps } from '@/types';

export default function MonthlyChart({ data }: MonthlyChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Calculate monthly totals and find the highest month
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalNet = totalIncome - totalExpenses;
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload[0].value;
      const expenses = payload[1].value;
      const net = income - expenses;
      
      return (
        <div className="bg-[#0D0D10] border border-zinc-700 p-3 rounded-lg shadow-lg">
          <p className="text-zinc-300 font-medium mb-1">{label}</p>
          <p className="flex items-center text-emerald-400 text-sm mb-1">
            <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> 
            Income: ₹{income.toLocaleString()}
          </p>
          <p className="flex items-center text-rose-400 text-sm mb-1">
            <TrendingDown className="h-3.5 w-3.5 mr-1.5" /> 
            Expenses: ₹{expenses.toLocaleString()}
          </p>
          <div className="border-t border-zinc-700 mt-2 pt-2">
            <p className={`flex items-center text-sm font-medium ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              Net: ₹{net.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Format y-axis ticks with currency
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}k`;
    }
    return `₹${value}`;
  };

  // Handle bar hover
  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
        setActiveIndex(null);
      }
    };
    
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
       

  return (
    <div className="bg-[#0D0D10] p-6 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-zinc-200 font-semibold text-lg">Monthly Income vs Expenses</h3>
          <p className="text-zinc-500 text-sm mt-0.5">Financial overview for the past 6 months</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <div className={`text-sm font-medium ${totalNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              Net: ₹{totalNet.toLocaleString()}
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-500 mx-2" />
            <div className="text-sm font-medium text-emerald-400">
              In: ₹{totalIncome.toLocaleString()}
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-500 mx-2" />
            <div className="text-sm font-medium text-rose-400">
              Out: ₹{totalExpenses.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-72" ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            barGap={8}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.3} />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#9ca3af' }}
              axisLine={{ stroke: '#333' }}
              tickLine={{ stroke: '#333' }}
            />
            <YAxis 
              tick={{ fill: '#9ca3af' }} 
              tickFormatter={formatYAxis}
              axisLine={{ stroke: '#333' }}
              tickLine={{ stroke: '#333' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: 20, 
                bottom: 0,
              }}
              formatter={(value) => <span className="text-zinc-300">{value}</span>}
            />
            <Bar 
              dataKey="income" 
              name="Income" 
              radius={[4, 4, 0, 0]}
              fill="url(#incomeGradient)"
              animationDuration={1500}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`income-${index}`}
                  fillOpacity={activeIndex === index ? 1 : 0.8}
                  stroke={activeIndex === index ? "#10b981" : "none"}
                  strokeWidth={activeIndex === index ? 1 : 0}
                />
              ))}
            </Bar>
            <Bar 
              dataKey="expenses" 
              name="Expenses" 
              radius={[4, 4, 0, 0]}
              fill="url(#expensesGradient)"
              animationDuration={1500}
              animationBegin={300}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`expenses-${index}`}
                  fillOpacity={activeIndex === index ? 1 : 0.8}
                  stroke={activeIndex === index ? "#ef4444" : "none"}
                  strokeWidth={activeIndex === index ? 1 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <style jsx global>{`
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