'use client';

import React, { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  // Puedes imprimir el error en consola para debugging
  useEffect(() => {
    console.error('Error boundary capturó un error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 p-8">
      <h1 className="text-3xl font-bold text-red-700">¡Algo salió mal!</h1>
      <p className="mt-4 text-lg text-gray-800">{error.message || 'Ha ocurrido un error inesperado.'}</p>
      <button onClick={reset} className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
        Intentar nuevamente
      </button>
    </div>
  );
}
