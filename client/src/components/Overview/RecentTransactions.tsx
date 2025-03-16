
import { Transaction } from '@/types'
import TransactionCard from '@/components/TransactionCard'

interface RecentTransactionsProps {
  transactions: Transaction[];
  onUpdate: () => void;
  compactMode?: boolean;
}

export default function RecentTransactions({ 
  transactions, 
  onUpdate,
  compactMode = false 
}: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center text-zinc-400">
        No recent transactions
      </div>
    );
  }
  
  return (
    <div className={compactMode ? "dashboard-transactions" : ""}>
      {transactions.map(transaction => (
        <TransactionCard
          key={transaction._id}
          onUpdate={onUpdate}
          compactMode={compactMode}
          {...transaction}
        />
      ))}
    </div>
  );
}