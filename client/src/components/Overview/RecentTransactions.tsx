// src/components/dashboard/RecentTransactions.tsx
import { useRouter } from 'next/navigation'
import { Transaction } from '@/types'
import TransactionCard from '@/components/TransactionCard'
import { RecentTransactionsProps } from '@/types'

export default function RecentTransactions({ transactions, onUpdate }: RecentTransactionsProps) {
  const router = useRouter()
  
  return (
    <div className="bg-[#0D0D10] rounded-xl border border-zinc-800">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
        <h3 className="text-zinc-200 font-semibold">Recent Transactions</h3>
        <button 
          onClick={() => router.push('/transactions')}
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          View All
        </button>
      </div>
      <div className="divide-y divide-zinc-800">
        {transactions.length === 0 ? (
          <div className="p-6 text-center text-zinc-400">No recent transactions</div>
        ) : (
          transactions.map(transaction => (
            <TransactionCard 
              key={transaction._id}
              {...transaction}
              onUpdate={onUpdate}
            />
          ))
        )}
      </div>
    </div>
  )
}