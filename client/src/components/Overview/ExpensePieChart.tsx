// src/components/dashboard/ExpensePieChart.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { ExpensePieChartProps } from '@/types'

export default function ExpensePieChart({ data }: ExpensePieChartProps) {
  // Colors for the pie chart
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#A5D6A7', '#81D4FA', '#FFD54F']

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <h3 className="text-zinc-200 font-semibold mb-4">Expenses By Category</h3>
      <div className="h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}