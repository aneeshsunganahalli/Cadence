'use client'

import { AddModalProps } from "@/types";
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import {
  Utensils, Bus, Film, Home, Zap, ShoppingBag, 
  Heart, User, GraduationCap, Plane, MoreHorizontal,
  Landmark, Gift, Coins, Briefcase, Building
} from 'lucide-react';

const expenseCategories = [
  { value: 'Food & Dining', icon: Utensils },
  { value: 'Transportation', icon: Bus },
  { value: 'Entertainment', icon: Film },
  { value: 'Housing', icon: Home },
  { value: 'Utilities', icon: Zap },
  { value: 'Shopping', icon: ShoppingBag },
  { value: 'Healthcare', icon: Heart },
  { value: 'Personal', icon: User },
  { value: 'Education', icon: GraduationCap },
  { value: 'Travel', icon: Plane },
  { value: 'Other', icon: MoreHorizontal }
] as const;

const depositCategories = [
  { value: 'Salary', icon: Briefcase },
  { value: 'Investment', icon: Building },
  { value: 'Gift', icon: Gift },
  { value: 'Petty Cash', icon: Coins },
  { value: 'Other', icon: MoreHorizontal }
] as const;

const PayMethods = [
  'Cash',
  'Online',
] as const;

export default function AddModal({isOpen, onClose, onSubmit}: AddModalProps) {
  const [transactionType, setTransactionType] = useState<'expense' | 'deposit'>('expense');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    paymentMethod: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as const
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        type: transactionType
      })
      onClose();
      toast.success("Transaction Added Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-xl max-w-md w-full mx-4 border border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add Transaction</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTransactionType('expense')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              transactionType === 'expense' 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setTransactionType('deposit')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              transactionType === 'deposit' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            Deposit
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder:text-zinc-500"
          />
          
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder:text-zinc-500"
          />
          
          {transactionType === 'expense' ? (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="">Select Category</option>
              {expenseCategories.map(({value}) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          ) : (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="">Select Category</option>
              {depositCategories.map(({value}) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          )}
          
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          />
          
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="">Select Payment Method</option>
            {PayMethods.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white rounded-lg px-4 py-2 hover:bg-emerald-900 transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  )
}