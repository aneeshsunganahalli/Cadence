// src/components/dashboard/SummaryCards.tsx
import { Wallet, TrendingUp, TrendingDown, CreditCard } from 'lucide-react'
import { SummaryCardsProps } from '@/types'

export default function SummaryCards({ 
  totalBalance, 
  totalIncome, 
  totalExpense, 
  savingsRate 
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <div className="flex justify-between">
          <div>
            <p className="text-zinc-400 text-sm">Total Balance</p>
            <h3 className="text-2xl font-bold text-zinc-100 mt-1">₹{totalBalance.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <div className="flex justify-between">
          <div>
            <p className="text-zinc-400 text-sm">Total Income</p>
            <h3 className="text-2xl font-bold text-emerald-500 mt-1">₹{totalIncome.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <div className="flex justify-between">
          <div>
            <p className="text-zinc-400 text-sm">Total Expenses</p>
            <h3 className="text-2xl font-bold text-rose-500 mt-1">₹{totalExpense.toLocaleString()}</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-rose-500" />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <div className="flex justify-between">
          <div>
            <p className="text-zinc-400 text-sm">Savings Rate</p>
            <h3 className="text-2xl font-bold text-purple-500 mt-1">{savingsRate}%</h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  )
}