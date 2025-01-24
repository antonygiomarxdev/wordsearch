// app/game/lobby/[roomId]/page.tsx
'use client';
import {useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {motion} from 'framer-motion';

export default function LobbyPage() {
    const { roomId } = useParams<{ roomId: string }>();
    const router = useRouter();

    useEffect(() => {
        const eventSource = new EventSource(`/api/room/${roomId}/sse`);

        const handleMessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data?.players?.length >= 2) {
                router.push(`/game/play/${roomId}`);
            }
        };

        eventSource.addEventListener('message', handleMessage);

        return () => {
            eventSource.removeEventListener('message', handleMessage);
            eventSource.close();
        };
    }, [roomId, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full"
            >
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Sala: {roomId}
                </h1>
                <div className="text-center mb-6">
                    <p className="text-gray-600">
                        Comparte este código con otros jugadores:
                    </p>
                    <button
                        onClick={() => navigator.clipboard.writeText(roomId)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Copiar código
                    </button>
                </div>
                <div className="text-center animate-pulse text-gray-500">
                    Esperando jugadores...
                </div>
            </motion.div>
        </div>
    );
}