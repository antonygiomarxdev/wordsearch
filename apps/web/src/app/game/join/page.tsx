'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';

export default function JoinGame() {
    const router = useRouter();
    const [roomCode, setRoomCode] = useState('');
    const socket = io(window.location.origin, { path: '/api/socket' });

    const joinRoom = () => {
        socket.emit('joinRoom', roomCode.toUpperCase(), (success: boolean) => {
            if (success) {
                router.push(`/game/lobby/${roomCode.toUpperCase()}`);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Unirse a partida</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Código de sala"
                        className="w-full p-3 border rounded-lg"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    />

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={joinRoom}
                        className="w-full py-3 bg-green-500 text-white rounded-lg text-lg font-semibold"
                    >
                        Unirse ahora
                    </motion.button>
                </div>
            </div>
        </div>
    );
}