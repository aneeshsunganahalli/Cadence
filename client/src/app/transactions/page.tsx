'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TransactionCard from '@/components/TransactionCard'
import { Transaction } from '@/types'
import { useRouter } from 'next/navigation'
import AddModal from '@/components/AddModal';

const TransactionsList: React.FC = () => {
  const [allExpenses, setAllExpenses] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const expensesPerPage = 8;

  const token = localStorage.getItem('token');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  // Fetch all transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const [expenseResponse, depositResponse] = await Promise.all([
        axios.get<{ success: boolean; expenses: Transaction[] }>(
          `${backendUrl}/api/expenses`,
          { headers: { token } }
        ),
        axios.get<{ success: boolean; deposits: Transaction[] }>(
          `${backendUrl}/api/deposits`,
          { headers: { token } }
        ),
      ]);

      if (!expenseResponse.data.success || !depositResponse.data.success) {
        toast.error("Failed to fetch transactions");
        return;
      }

      const allTransactions = [
        ...expenseResponse.data.expenses,
        ...depositResponse.data.deposits
      ].sort((a, b) => b.date - a.date); // Using Number timestamps directly

      setAllExpenses(allTransactions);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch transactions");
      } else {
        toast.error("An unexpected error occurred");
      }
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setShowAddModal(true);
  }

  useEffect(() => {
    if (!token) {
      toast.error("Login to view Transactions")
      router.push("/sign-in")
    }
    fetchTransactions();
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

  // Refresh transactions after an update
  const handleTransactionUpdate = () => {
    fetchTransactions();
  };

  return (
    <>
    <div className="bg-zinc-900 rounded-xl m-16">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-zinc-100 font-bold text-lg">Transaction History</h2>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-4 py-3 bg-zinc-800/50 text-zinc-400 text-sm">
        <div className="col-span-4">Description</div>
        <div className="col-span-2 ">Amount</div>
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
            <TransactionCard
              key={expense._id}
              {...expense}
              onUpdate={handleTransactionUpdate}
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
            className={`flex items-center bg-zinc-800 px-3 py-1.5 rounded-lg text-sm transition-colors ${currentPage === 1 || loading
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
            className={`flex items-center bg-zinc-800 px-3 py-1.5 rounded-lg text-sm transition-colors ${currentPage >= totalPages || loading
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
    <button className='w-12 text-xl' onClick={handleAddTransaction}>ADD HERE</button>
    <AddModal
      isOpen={showAddModal}
      onClose={() => setShowAddModal(false)}
      onSubmit={handleAddTransaction}
    />
    </>
  );
}

export default TransactionsList