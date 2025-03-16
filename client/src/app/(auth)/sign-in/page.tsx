import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import OAuth from '@/components/auth/OAuth';
import SignInForm from '@/components/auth/SignInForm';

const  SignUpPage: React.FC = ()  => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] rounded-2xl">
      <div className="max-w-md w-full space-y-8 p-6 bg-trasnparent backdrop-blur-xl rounded-2xl shadow-xl">
        <div className="text-center">
          <Image
            src="/vercel.svg"
            alt="Logo"
            width={48}
            height={48}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Sign in to Cadence
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Welcome back! Please enter your details
          </p>
        </div>

        <div className="space-y-6 mt-8">
          <SignInForm />
          
          <div className="relative flex flex-col justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900/50 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          
          <OAuth />
        </div>

        <div className="text-center text-sm text-gray-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link 
            href="/sign-up" 
            className="font-medium text-gray-400 hover:text-white transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
