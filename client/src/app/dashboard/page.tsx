'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Transaction } from '@/types'


import SummaryCards from '@/components/Overview/SummaryCards'
import MonthlyChart from '@/components/Overview/MonthlyChart'
import ExpensePieChart from '@/components/Overview/ExpensePieChart'
import RecentTransactions from '@/components/Overview/RecentTransactions'

const DashBoard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    savingsRate: 0
  })
  const [categoryData, setCategoryData] = useState<any[]>([])
  
  const router = useRouter()
  const token = localStorage.getItem('token')
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const fetchData = async () => {
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

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view your dashboard")
      router.push("/sign-in")
      return
    }
    fetchData()
  }, [token, router])

  // Sample monthly data (replace with actual data when available)
  const monthlyData = [
    { month: 'Jan', income: 2400, expenses: 1398 },
    { month: 'Feb', income: 1398, expenses: 2800 },
    { month: 'Mar', income: 9800, expenses: 3908 },
    { month: 'Apr', income: 3908, expenses: 4800 },
    { month: 'May', income: 4800, expenses: 3800 },
    { month: 'Jun', income: 5000, expenses: 4300 },
  ]

  // Budget categories
  const budgetCategories = [
    { 
      name: 'Food & Dining', 
      spent: stats.totalExpense * 0.3, 
      budget: 10000, 
      color: 'bg-emerald-500' 
    },
    { 
      name: 'Entertainment', 
      spent: stats.totalExpense * 0.15, 
      budget: 5000, 
      color: 'bg-blue-500' 
    },
    { 
      name: 'Transportation', 
      spent: stats.totalExpense * 0.2, 
      budget: 3000, 
      color: 'bg-rose-500' 
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <h1 className="text-2xl font-bold text-zinc-100">Financial Dashboard</h1>
      
      {/* Summary Cards */}
      <SummaryCards 
        totalBalance={stats.totalBalance}
        totalIncome={stats.totalIncome}
        totalExpense={stats.totalExpense}
        savingsRate={stats.savingsRate}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthlyChart data={monthlyData} />
        <ExpensePieChart data={categoryData} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions 
        transactions={transactions} 
        onUpdate={fetchData}
      />

    </div>
  )
}

export default DashBoard