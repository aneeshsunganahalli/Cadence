'use client';

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignInForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data } = await axios.post('http://localhost:5000/api/user/login', formData);

      if (data.success) {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-gray-900/50 text-white placeholder:text-gray-400 p-3 rounded-3xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-gray-900/50 text-white placeholder:text-gray-400 p-3 rounded-3xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
        />
        <button
          disabled={loading}
          className="bg-gradient-to-r from-gray-600 to-black text-white p-3 rounded-3xl uppercase hover:opacity-90 disabled:opacity-50 transition-all duration-200 font-medium"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>

      {error && (
        <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-3 rounded-lg mt-4">
          {error}
        </div>
      )}

    </div>
  );
};

export default SignInForm;