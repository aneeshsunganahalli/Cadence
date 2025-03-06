import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import OAuth from '@/components/auth/OAuth';
import SignUpForm from '@/components/auth/SignUpForm';

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <Image
            src="next.svg"
            alt="Logo"
            width={48}
            height={48}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to Cadence
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back! Please enter your details
          </p>
        </div>

        <div className="space-y-6 mt-8">
          <SignUpForm />
          
          <div className="relative flex flex-col justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          
            <OAuth />
        </div>

        <div className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link 
            href="/sign-up" 
            className="font-medium text-slate-700 hover:text-slate-800"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage;



