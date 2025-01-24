import {Difficulty} from "@/app/game/shared/domain/types";

export const validateSelection = (
    word: string,
    difficulty: Difficulty
): boolean => {
    const wordList = {
        Easy: ['HTML', 'CSS', 'JS'],
        Medium: ['REACT', 'NEXTJS', 'NODE'],
        Hard: ['TYPESCRIPT', 'WEBPACK', 'BUNDLER'],
        Expert: ['MICROSERVICES', 'GRAPHQL', 'WEBSOCKETS'],
        Numbers: ['314', '2718', '1618']
    }[difficulty];

    return wordList.includes(word) || wordList.includes(word.split('').reverse().join(''));
};