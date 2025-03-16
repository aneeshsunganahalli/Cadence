'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MonthData, Transaction } from '@/types'
import { getLocalItem} from '@/utils/storage';

import SummaryCards from '@/components/Overview/SummaryCards'
import MonthlyChart from '@/components/Overview/MonthlyChart'
import ExpensePieChart from '@/components/Overview/ExpensePieChart'
import RecentTransactions from '@/components/Overview/RecentTransactions'

const DashBoard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [monthlyChartData, setMonthlyChartData] = useState<MonthData[]>([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    savingsRate: 0
  })
  const [categoryData, setCategoryData] = useState<any[]>([])
  // Add state for token instead of direct localStorage access
  const [token, setToken] = useState<string | null>(null)

  const router = useRouter()
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // Move localStorage access to useEffect
  useEffect(() => {
    // Now this code only runs on the client side
    const storedToken = getLocalItem('token')
    setToken(storedToken)
    
    if (!storedToken) {
      toast.error("Please login to view your dashboard")
      router.push("/sign-in")
    }
  }, [router])

  // Process transactions into monthly data
  const processMonthlyData = (expenses: Transaction[], deposits: Transaction[]) => {
    // Get all dates in proper format
    const expensesWithDate = expenses.map(exp => ({
      ...exp,
      dateObj: new Date(exp.date)
    }));

    const depositsWithDate = deposits.map(dep => ({
      ...dep,
      dateObj: new Date(dep.date)
    }));

    // Get range of months (last 6 months)
    const today = new Date();
    const monthsData: Record<string, { month: string, income: number, expenses: number }> = {};

    // Initialize last 6 months with zero values
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'short' });

      monthsData[monthKey] = {
        month: monthName,
        income: 0,
        expenses: 0
      };
    }

    // Add expense data
    expensesWithDate.forEach(expense => {
      const date = expense.dateObj;
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      // Only include if it's in our 6-month window
      if (monthsData[monthKey]) {
        monthsData[monthKey].expenses += expense.amount;
      }
    });

    // Add income data
    depositsWithDate.forEach(deposit => {
      const date = deposit.dateObj;
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

      // Only include if it's in our 6-month window
      if (monthsData[monthKey]) {
        monthsData[monthKey].income += deposit.amount;
      }
    });

    // Convert to array and return chronologically sorted
    return Object.values(monthsData);
  };

  const fetchData = async () => {
    if (!token) return; // Don't fetch if no token
    
    setLoading(true)
    try {
      const [expenseResponse, depositResponse] = await Promise.all([
        axios.get(`${backendUrl}/api/expenses`, { headers: { token } }),
        axios.get(`${backendUrl}/api/deposits`, { headers: { token } })
      ])

      if (!expenseResponse.data.success || !depositResponse.data.success) {
        toast.error("Failed to fetch financial data")
        return
      }

      const expenses = expenseResponse.data.expenses
      const deposits = depositResponse.data.deposits

      // Calculate statistics
      const totalExpense = expenses.reduce((sum: number, exp: Transaction) => sum + exp.amount, 0)
      const totalIncome = deposits.reduce((sum: number, dep: Transaction) => sum + dep.amount, 0)
      const totalBalance = totalIncome - totalExpense
      const savingsRate = totalIncome > 0 ? Math.round((totalBalance / totalIncome) * 100) : 0

      setStats({
        totalBalance,
        totalIncome,
        totalExpense,
        savingsRate
      })

      const monthlyData = processMonthlyData(expenses, deposits);
      setMonthlyChartData(monthlyData);

      // Prepare category data for charts
      const categoryMap: Record<string, number> = {}
      expenses.forEach((expense: Transaction) => {
        if (categoryMap[expense.category]) {
          categoryMap[expense.category] += expense.amount
        } else {
          categoryMap[expense.category] = expense.amount
        }
      })

      const categoryDataArray = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value
      }))

      setCategoryData(categoryDataArray)

      // Combine and sort all transactions for recent list
      const allTransactions = [...expenses, ...deposits].sort((a, b) => {
        return b.date - a.date
      })

      setTransactions(allTransactions.slice(0, 5)) // Get most recent 5
    } catch (error) {
      toast.error("An error occurred while fetching data")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Use token from state in the dependency array
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]); // Remove router from dependencies, we handle that separately

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-500"></div>
      </div>
    )
  }

  // src/app/dashboard/page.tsx
  return (
    <div className="p-4 md:p-6 xl:p-8  min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Financial Dashboard</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Summary Cards & Recent Transactions */}
        <div className="lg:col-span-1 space-y-6">

          <div className="vertical-cards">
            {/* Summary Cards with vertical layout */}
            <SummaryCards
              totalBalance={stats.totalBalance}
              totalIncome={stats.totalIncome}
              totalExpense={stats.totalExpense}
              savingsRate={stats.savingsRate}
              layout="vertical"
            />
          </div>
          {/* Recent Transactions - With container wrapper */}
          <div className="bg-[#0D0D10] rounded-xl border border-zinc-800/50 flex flex-col flex-grow">
            <div className="flex justify-between items-center p-5 border-b border-zinc-800/70">
              <h2 className="text-lg font-medium text-white">Recent Transactions</h2>
              <button
                onClick={() => router.push('/transactions')}
                className="text-sm text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
              >
                View All
              </button>
            </div>

            <div className="overflow-auto minimal-scrollbar flex-grow">
              <RecentTransactions
                transactions={transactions}
                onUpdate={fetchData}
                compactMode={true}
              />
            </div>
          </div>


        </div>

        {/* Right Column - Charts (taking 2/3 of the width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Chart */}
          <div className="bg-[#0D0D10] p-5 rounded-xl border border-zinc-800/50">
            <div className="mb-4 pb-3 border-b border-zinc-800/70">
              <h2 className="text-lg font-medium text-white">Monthly Overview</h2>
            </div>
            <div className="h-[400px]">
              <MonthlyChart data={monthlyChartData} />
            </div>
          </div>

          {/* Expenses Category */}
          <div className="bg-[#0D0D10] rounded-xl border border-zinc-800/50">
            <div className="p-5 border-b border-zinc-800/70">
              <h2 className="text-lg font-medium text-white">Expense Breakdown</h2>
            </div>
            <div className="p-4">
              <ExpensePieChart data={categoryData} />
            </div>
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
      
      /* Style to make cards vertical */
      .vertical-cards > div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .vertical-cards > div > div {
        width: 100%;
      }

      /* Force compact mode for transactions in dashboard */
  .transactions-container .transaction-row {
    /* These styles will override the TransactionCard's responsive design */
    display: grid;
    grid-template-columns: auto 1fr auto !important;
  }
  
  .transactions-container .transaction-row .mobile-only {
    display: block !important;
  }
  
  .transactions-container .transaction-row .desktop-only {
    display: none !important;
  }

  /* Completely separate styling for dashboard transactions */
  .dashboard-transactions {
    display: flex;
    flex-direction: column;
  }
  
  /* No need for the complex override selectors since we're using a completely different layout */
    `}</style>
    </div>
  );
}

export default DashBoard;