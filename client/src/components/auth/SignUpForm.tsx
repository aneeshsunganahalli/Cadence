'use client';

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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

      const { data } = await axios.post(backendUrl + '/api/user/register', formData);

      if (data.success) {
        localStorage.setItem('token', data.token);
        toast.success("Registered Successfully");
        router.push('/sign-in');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-gray-900/50 text-white placeholder:text-gray-400 p-3 rounded-3xl border border-gray-700  focus:outline-none focus:ring-1 focus:ring-gray-200 transition-colors"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-gray-900/50 text-white placeholder:text-gray-400 p-3 rounded-3xl border border-gray-700  focus:outline-none focus:ring-1 focus:ring-gray-200 transition-colors"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-gray-900/50 text-white placeholder:text-gray-400 p-3 rounded-3xl border border-gray-700  focus:outline-none focus:ring-1 focus:ring-gray-200 transition-colors"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
        />
        <button
          disabled={loading}
          className="bg-gradient-to-r from-gray-600 to-black text-white p-3 rounded-3xl uppercase hover:opacity-90 disabled:opacity-50 transition-all duration-200 font-medium"
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>

    </div>
  );
};

export default SignUpForm;