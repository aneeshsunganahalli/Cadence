'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MonthData, Transaction } from '@/types'


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

  const router = useRouter()
  const token = localStorage.getItem('token')
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

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

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view your dashboard")
      router.push("/sign-in")
      return
    }
    fetchData()
  }, [token, router])

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyChart data={monthlyChartData} />
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

export default DashBoard;