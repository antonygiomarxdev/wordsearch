// app/api/room/[roomId]/sse/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {activeRooms} from "@/app/lib/game/room-manager";

export async function POST(
    req: NextRequest,
    { params }: { params: { roomId: string } }
) {
    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    const sendUpdate = () => {
        const room = activeRooms.get(params.roomId);
        writer.write(encoder.encode(`data: ${JSON.stringify(room)}\n\n`));
    };

    const interval = setInterval(sendUpdate, 1000);
    sendUpdate(); // Enviar estado inicial

    const cleanup = () => {
        clearInterval(interval);
        writer.close();
    };

    req.signal.addEventListener('abort', cleanup);

    return new NextResponse(responseStream.readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}