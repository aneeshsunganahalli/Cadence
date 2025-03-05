import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-lg">
        {children}
      </div>
    </div>
  );
}
