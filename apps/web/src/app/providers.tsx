'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GameProvider } from './game/context/game-context';
import React, { useState } from 'react';

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <GameProvider>
        <main className="mx-auto p-4 h-screen flex flex-col items-center justify-center bg-gray-100 space-y-8 w-full">
          {children}
        </main>
      </GameProvider>
    </ReactQueryProvider>
  );
}
