'use client';

import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="max-w-md w-full space-y-8 p-6 bg-transparent backdrop-blur-xl rounded-2xl shadow-xl">
        {children}
      </div>
    </div>
  );
}
