'use client';

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "@/redux/user/userSlice";

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
  const router = useRouter();
  const dispatch = useDispatch();
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
      dispatch(signInStart());
      setLoading(true);

      const { data } = await axios.post(backendUrl + '/api/user/login', formData);
      console.log(data)
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      localStorage.setItem('token', data.token);
        dispatch(signInSuccess(data.rest))
        toast.success('Successfully logged in!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        router.push('/');

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to login";
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error('An unexpected error occurred');
      }
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
          className="bg-gray-900/50 text-white placeholder:text-gray-400 p-3 rounded-3xl border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-colors"
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
          className="bg-gradient-to-r from-gray-600 to-black text-white p-3 rounded-3xl hover:opacity-90 disabled:opacity-50 transition-all duration-200 font-medium"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>

    </div>
  );
};

export default SignInForm;