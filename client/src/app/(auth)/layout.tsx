import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#0a0a0a]">
      <div className="max-w-md w-full space-y-8 p-6 bg-[#171717] rounded-xl shadow-lg mt-5">
        {children}
      </div>
    </div>
  );
}
