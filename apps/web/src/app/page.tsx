'use client';
import Link from 'next/link';
import {motion} from 'framer-motion';

export default function Home() {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 w-96"
        >
          <h1 className="text-3xl font-bold text-center mb-8">WordSearch Multiplayer</h1>

          <div className="space-y-4">
            <Link href="/game/create" legacyBehavior>
              <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold text-center"
              >
                Crear nueva partida
              </motion.a>
            </Link>

            <Link href="/game/join" legacyBehavior>
              <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full py-3 bg-green-500 text-white rounded-lg text-lg font-semibold text-center"
              >
                Unirse a partida
              </motion.a>
            </Link>
          </div>
        </motion.div>
      </div>
  );
}