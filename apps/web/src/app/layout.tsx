import React from "react";
import {GameProvider} from "@/app/lib/context/game-context";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
        <body>
        <GameProvider>
            <main className="container">{children}</main>
        </GameProvider>
        </body>
        </html>
    );
}
