'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ArrowUpRight, Calendar, CreditCard, IndianRupee, ChevronLeft, ChevronRight, Edit, MoreHorizontal } from 'lucide-react';
import ExpenseCard from '@/components/ExpenseCard'
import { Expense } from '@/types'
import { useRouter } from 'next/navigation'

const ExpensesList:React.FC = () => {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const expensesPerPage = 10;

  const token = localStorage.getItem('token');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  // Fetch all expenses
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/expenses`, 
        { headers: { token } }
      );
      
      if (response.data.success) {
        setAllExpenses(response.data.expenses || []);
      } else {
        console.error('Failed to fetch expenses:', response.data.message);
        toast.error("Failed to Fetch")
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!token) {
      toast.error("Login to view Expenses")
      router.push("/sign-in")
    }
    fetchExpenses();
  }, [token]);

  // Calculate pagination values
  const totalExpenses = allExpenses.length;
  const totalPages = Math.ceil(totalExpenses / expensesPerPage);
  
  // Get current page expenses
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = allExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Refresh expenses after an update
  const handleExpenseUpdate = () => {
    fetchExpenses();
  };

  return (
    <div className="bg-zinc-900 rounded-xl m-16">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-zinc-100 font-bold text-lg">Recent Expenses</h2>
      </div>
      
      {/* Table Header */}
      <div className="grid grid-cols-12 px-4 py-3 bg-zinc-800/50 text-zinc-400 text-sm">
        <div className="col-span-4">Description</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1">Payment</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>
      
      {/* Expense Rows */}
      <div className="divide-y divide-zinc-800">
        {loading ? (
          <div className="p-8 text-center text-zinc-400">Loading expenses...</div>
        ) : currentExpenses.length === 0 ? (
          <div className="p-8 text-center text-zinc-400">No expenses found</div>
        ) : (
          currentExpenses.map(expense => (
            <ExpenseCard 
              key={expense._id} 
              {...expense}
              onUpdate={handleExpenseUpdate} 
            />
          ))
        )}
      </div>
      
      {/* Pagination Footer */}
      <div className="p-4 border-t border-zinc-800 flex justify-between items-center">
        <span className="text-zinc-400 text-sm">
          {totalExpenses > 0 ? (
            `Showing ${indexOfFirstExpense + 1}-${Math.min(indexOfLastExpense, totalExpenses)} of ${totalExpenses} expenses`
          ) : (
            'No expenses to display'
          )}
        </span>
        <div className="flex space-x-2">
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1 || loading}
            className={`flex items-center bg-zinc-800 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              currentPage === 1 || loading
                ? 'text-zinc-600 cursor-not-allowed'
                : 'text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage >= totalPages || loading}
            className={`flex items-center bg-zinc-800 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              currentPage >= totalPages || loading
                ? 'text-zinc-600 cursor-not-allowed'
                : 'text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpensesList