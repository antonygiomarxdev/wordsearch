import GameGrid from './components/GameGrid';
import WordList from './components/WordList';
import {useGameContext} from "@/app/lib/context/game-context";

export default function GamePage() {
    const { state } = useGameContext();

    return (
        <div className="container mx-auto p-4">
            <div className="grid md:grid-cols-[1fr_300px] gap-6">
                <GameGrid />
                <WordList difficulty={state.difficulty} />
            </div>
        </div>
    );
}