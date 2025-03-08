'use client'

import React, { useState } from 'react';
import { ArrowUpRight, Calendar, CreditCard, IndianRupee, Tag, MoreHorizontal, Edit, Save, X, Check } from 'lucide-react';
import { Expense, ExpenseCardProps } from '@/types';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ExpenseCard({ onUpdate, ...expense }: ExpenseCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    amount: expense.amount,
    category: expense.category,
    description: expense.description,
    paymentMethod: expense.paymentMethod,
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

  const editExpense = async () => {
    setIsLoading(true);
    try {
      const {data} = await axios.patch(backendUrl +
        `/api/expenses/update/${expense._id}`, 
        updatedData, 
        {headers: {token}}
      );

      if (data.success){
      setIsEditing(false);
      toast.success("Expense Updated");
      onUpdate();
      }
    } catch (error) {
      console.error('Failed to update expense:', error);
      toast.error("Failed to Edit");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setUpdatedData({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      paymentMethod: expense.paymentMethod
    });
    setIsEditing(false);
  };

  const categories = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Housing',
    'Utilities',
    'Shopping',
    'Healthcare',
    'Personal',
    'Education',
    'Travel',
    'Other'
  ];

  const PayMethods = [
    'Cash',
    'Debit',
    'Credit'
  ];

  return (
    <div key={expense._id} className="grid grid-cols-12 px-4 py-4 hover:bg-zinc-800/30 transition-colors items-center border-b border-zinc-800">
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
          expense.description
        )}
      </div>
      
      <div className="col-span-2">
        <div className="flex items-center text-rose-400">
          <ArrowUpRight className="h-3 w-3 mr-1" />
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
            <span className="font-medium text-zinc-100">{expense.amount.toFixed(2)}</span>
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
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        ) : (
          <span className="inline-block bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-full">
            {expense.category}
          </span>
        )}
      </div>
      
      <div className="col-span-2 text-zinc-400 text-sm flex items-center">
        <Calendar className="h-3 w-3 mr-2 text-white" />
        {new Date(expense.date).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit'
        })}
      </div>
      
      <div className="col-span-1 text-zinc-400 text-sm flex items-center">
        <CreditCard className="h-3 w-3 mr-2 text-zinc-500" />
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
          ):(
            <>
              <span className="truncate">{expense.paymentMethod}</span>
            </>
          )}
      </div>
      
      <div className="col-span-1 flex justify-end space-x-1">
        {isEditing ? (
          <>
            <button 
              onClick={editExpense} 
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