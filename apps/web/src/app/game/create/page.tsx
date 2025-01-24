// app/game/creation/page.tsx
'use client';
import {useState} from 'react';
import {createRoom} from './actions';
import {Difficulty} from "@/app/game/shared/domain/types";
import DifficultySelector from "@/app/game/create/components/DifficultySelector";

export default function CreateGamePage() {
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async (difficulty: Difficulty) => {
        setIsCreating(true);
        try {
            await createRoom(difficulty);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8">
                {isCreating ? 'Creando sala...' : 'Selecciona la dificultad'}
            </h1>
            <DifficultySelector onCreate={handleCreate} />
        </div>
    );
}