'use client'

import React, { useState } from 'react';
import {
  ArrowUpRight, ArrowDownRight, CalendarDays, CreditCard, IndianRupee, MoreHorizontal, Edit, Save, X, Check,
  // Expense Categories
  Utensils, Bus, Film, Home, Zap, ShoppingBag, Heart, User, GraduationCap, Plane,
  // Income Categories
  Landmark, Gift, Coins, Briefcase, Building
} from 'lucide-react';
import { TransactionCardProps } from '@/types';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TransactionCard({ onUpdate, ...transaction }: TransactionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description,
    paymentMethod: transaction.paymentMethod,
  });

  const token = localStorage.getItem('token');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      const endpoint = transaction.type === 'expense' 
        ? `/api/expenses/update/${transaction._id}`
        : `/api/deposits/update/${transaction._id}`;

      const { data } = await axios.patch(
        `${backendUrl}${endpoint}`,
        updatedData,
        { headers: { token } }
      );

      if (data.success) {
        setIsEditing(false);
        toast.success(`${transaction.type === 'expense' ? 'Expense' : 'Deposit'} Updated`);
        onUpdate();
      }
    } catch (error) {
      console.error(`Failed to update ${transaction.type}:`, error);
      toast.error(`Failed to Edit ${transaction.type}`);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setUpdatedData({
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      paymentMethod: transaction.paymentMethod
    });
    setIsEditing(false);
  };

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

  const categories = transaction.type === 'expense' ? expenseCategories : depositCategories;

  const PayMethods = [
    'Cash',
    'Online',
  ];

  return (
    <div key={transaction._id} className="grid grid-cols-12 px-4 py-4 hover:bg-zinc-800/30 transition-colors items-center border-b border-zinc-800">
      <div className="col-span-4 text-zinc-100 font-medium">
        {isEditing ? (
          <input
            type="text"
            name="description"
            value={updatedData.description}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-zinc-100"
          />
        ) : (
          transaction.description
        )}
      </div>

      <div className="col-span-2">
        <div className={`flex items-center ${transaction.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}>
          {transaction.type === 'expense' ?
            <ArrowDownRight className="h-3 w-3 mr-1" /> :
            <ArrowUpRight className="h-3 w-3 mr-1" />
          }
          <IndianRupee className="h-3 w-3 text-white" />
          {isEditing ? (
            <input
              type="number"
              name="amount"
              value={updatedData.amount}
              onChange={handleChange}
              className="w-24 bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-zinc-100"
            />
          ) : (
            <span className="font-medium text-zinc-100">{transaction.amount.toFixed(2)}</span>
          )}
        </div>
      </div>

      <div className="col-span-2">
        {isEditing ? (
          <select
            name="category"
            value={updatedData.category}
            onChange={handleChange}
            className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-zinc-300 text-xs w-[70%]"
          >
            {categories.map(({ value, icon: Icon }) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full ${transaction.type === 'expense' ? 'bg-rose-950/30' : 'bg-emerald-950/30'
                } flex items-center justify-center hover:bg-zinc-700 transition-colors group`}
              title={transaction.category}
            >
              {categories.find(cat => cat.value === transaction.category)?.icon &&
                React.createElement(
                  categories.find(cat => cat.value === transaction.category)!.icon,
                  {
                    size: 16,
                    className: `${transaction.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'
                      } group-hover:text-zinc-300 transition-colors`
                  }
                )}
            </div>
          </div>
        )}
      </div>

      <div className="col-span-2 text-zinc-400 text-sm flex items-center">
        <CalendarDays className="h-3 w-3 mr-2 text-white" />
        {new Date(transaction.date).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit'
        })}
      </div>

      <div className="col-span-1 text-zinc-400 text-sm flex items-center">
        <CreditCard className="h-3 w-3 mr-2 text-white" />
        {
          isEditing ? (
            <select
              name="paymentMethod"
              value={updatedData.paymentMethod}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-zinc-300 text-xs w-[68%]"
            >
              {PayMethods.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          ) : (
            <>
              <span className="truncate">{transaction.paymentMethod}</span>
            </>
          )}
      </div>

      <div className="col-span-1 flex justify-end space-x-1">
        {isEditing ? (
          <>
            <button
              onClick={handleEdit}
              disabled={isLoading}
              className="p-1 rounded-md hover:bg-green-700 bg-green-800/50 text-green-400 hover:text-green-100 transition-colors"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="p-1 rounded-md hover:bg-red-700 bg-red-800/50 text-red-400 hover:text-red-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-1 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}