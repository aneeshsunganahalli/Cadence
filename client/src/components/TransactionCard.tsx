'use client'

import React, { useState } from 'react';
import {
  ArrowUpRight, ArrowDownRight, CalendarDays, CreditCard, IndianRupee, MoreHorizontal, Edit, X, Check,
  // Expense Categories
  Utensils, Bus, Film, Home, Zap, ShoppingBag, Heart, User, GraduationCap, Plane,
  // Income Categories
   Gift, Coins, Briefcase, Building,
  Trash2
} from 'lucide-react';
import { TransactionCardProps } from '@/types';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteModal from './DeleteModal';

export default function TransactionCard({ onUpdate, compactMode = false, ...transaction }: TransactionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    amount: transaction.amount.toString(),
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
      [name]: value
    }));
  };

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      const endpoint = transaction.type === 'expense' 
        ? `/api/expenses/update/${transaction._id}`
        : `/api/deposits/update/${transaction._id}`;

        const dataToSubmit = {
          ...updatedData,
          // Convert to number or use 0 if empty
          amount: updatedData.amount === '' ? 0 : parseFloat(updatedData.amount)
        };

      const { data } = await axios.patch(
        `${backendUrl}${endpoint}`,
        dataToSubmit,
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

  const deleteTransaction = async () => {
    setIsLoading(true);
    try {
      const endpoint = transaction.type === 'expense'
      ? `/api/expenses/delete/${transaction._id}`
        : `/api/deposits/delete/${transaction._id}`;
        
      const { data } = await axios.delete(
        `${backendUrl}${endpoint}`,
        { headers: { token } }
      );
      
      if (data.success) {
        setIsEditing(false);
        toast.success(`${transaction.type === 'expense' ? 'Expense' : 'Deposit'} Deleted`);
        onUpdate();
      }
    } catch (error) {
      console.error(`Failed to delete ${transaction.type}:`, error);
      toast.error(`Failed to Delete ${transaction.type}`);
    } finally {
      setIsLoading(false)
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const cancelEdit = () => {
    setUpdatedData({
      amount: transaction.amount.toString(),
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

  // For compact mode, use a completely different layout
  if (compactMode) {
    return (
      <>
        <div className="px-4 py-3 hover:bg-zinc-800/30 border-b border-zinc-800/50 last:border-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full ${
                transaction.type === 'expense' ? 'bg-rose-950/30' : 'bg-emerald-950/30'
              } flex items-center justify-center`}>
                {categories.find(cat => cat.value === transaction.category)?.icon &&
                  React.createElement(
                    categories.find(cat => cat.value === transaction.category)!.icon,
                    {
                      size: 12,
                      className: `${transaction.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`
                    }
                  )}
              </div>
              <p className="text-zinc-100 text-sm font-medium truncate max-w-[150px]">
                {transaction.description}
              </p>
            </div>
            
            <div className={`flex items-center ${transaction.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}>
              <IndianRupee className="h-3 w-3 mr-0.5" />
              <span className="font-medium text-sm">{transaction.amount.toFixed(0)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <p className="text-zinc-500 text-xs">{transaction.category}</p>
              <span className="text-zinc-700">•</span>
              <p className="text-zinc-500 text-xs">
                {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <Edit className="h-3 w-3" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-rose-400 transition-colors">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
  
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={deleteTransaction}
          type={transaction.type}
          isLoading={isLoading}
        />
      </>
    );
  }

  // Return the normal layout when not in compact mode
  return (
    <>
      <div 
        key={transaction._id} 
        className={`transaction-row grid grid-cols-12 px-3 sm:px-4 py-3 sm:py-4 hover:bg-zinc-800/30 transition-colors items-center ${
          compactMode ? 'compact-mode' : ''
        }`}
      >
        {/* Description Column - More prominence on small screens */}
        <div className={`${compactMode ? 'col-span-6' : 'col-span-6 md:col-span-5 lg:col-span-4'} flex items-center gap-2`}>
          {/* Category Icon - Always visible but smaller on mobile */}
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
              transaction.type === 'expense' ? 'bg-rose-950/30' : 'bg-emerald-950/30'
            } flex-shrink-0 flex items-center justify-center group`}
            title={transaction.category}
          >
            {categories.find(cat => cat.value === transaction.category)?.icon &&
              React.createElement(
                categories.find(cat => cat.value === transaction.category)!.icon,
                {
                  size: compactMode ? 12 : 13,
                  className: `${
                    transaction.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'
                  }`
                }
              )}
          </div>
          
          {/* Description with Edit Mode */}
          <div className="min-w-0 flex-grow">
            {isEditing ? (
              <input
                type="text"
                name="description"
                value={updatedData.description}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-zinc-100 text-sm"
              />
            ) : (
              <div className="truncate text-zinc-100 text-sm sm:text-base font-medium">
                {transaction.description}
              </div>
            )}
            
            {/* Category name - Only visible on small screens under the description */}
            <div className={`mobile-only ${compactMode ? 'block' : 'md:hidden'} text-zinc-500 text-xs truncate`}>
              {transaction.category}
            </div>
          </div>
        </div>

        {/* Amount Column - Always visible */}
        <div className="col-span-3 md:col-span-2">
          <div className={`flex items-center ${transaction.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}>
            {transaction.type === 'expense' ?
              <ArrowDownRight className="hidden xs:inline-block h-3 w-3 mr-1" /> :
              <ArrowUpRight className="hidden xs:inline-block h-3 w-3 mr-1" />
            }
            <IndianRupee className="h-3 w-3" />
            {isEditing ? (
              <input
                type="number"
                name="amount"
                value={updatedData.amount}
                onChange={handleChange}
                className="w-20 bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-zinc-100 text-sm"
              />
            ) : (
              <span className="font-medium text-sm sm:text-base">{transaction.amount.toFixed(0)}</span>
            )}
          </div>
        </div>

        {/* Category Column - Hide in compact mode */}
        <div className={`desktop-only ${compactMode ? 'hidden' : 'hidden md:block'} col-span-2`}>
          {isEditing ? (
            <select
              name="category"
              value={updatedData.category}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-zinc-300 text-xs w-full"
            >
              {categories.map(({ value }) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          ) : (
            <div className="truncate text-zinc-300 text-xs sm:text-sm">{transaction.category}</div>
          )}
        </div>

        {/* Date Column - Hide in compact mode */}
        <div className={`desktop-only ${compactMode ? 'hidden' : 'hidden md:flex'} col-span-2 items-center text-zinc-400 text-xs sm:text-sm`}>
          <CalendarDays className="h-3 w-3 mr-1 sm:mr-2 text-zinc-500 flex-shrink-0" />
          <span className="whitespace-nowrap">
            {new Date(transaction.date).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit'
            })}
          </span>
        </div>

        {/* Payment Method Column - Hide in compact mode */}
        <div className={`desktop-only ${compactMode ? 'hidden' : 'hidden lg:flex'} col-span-1 items-center text-zinc-400 text-xs sm:text-sm truncate`}>
          <CreditCard className="h-3 w-3 mr-1 sm:mr-2 text-zinc-500 flex-shrink-0" />
          {isEditing ? (
            <select
              name="paymentMethod"
              value={updatedData.paymentMethod}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-zinc-300 text-xs w-full"
            >
              {PayMethods.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          ) : (
            <span className="truncate">{transaction.paymentMethod || 'N/A'}</span>
          )}
        </div>

        {/* Actions Column - Always visible */}
        <div className="col-span-3 md:col-span-1 flex justify-end space-x-1">
          {isEditing ? (
            <>
              <button
                onClick={handleEdit}
                disabled={isLoading}
                className="p-1.5 rounded-md hover:bg-green-700 bg-green-800/50 text-green-400 hover:text-green-100 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={cancelEdit}
                className="p-1.5 rounded-md hover:bg-red-700 bg-red-800/50 text-red-400 hover:text-red-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-rose-400 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteTransaction}
        type={transaction.type}
        isLoading={isLoading}
      />
    </>
  );
}