export type NumPairs = 2 | 4 | 8;
export type GameType = "pairing" | "selecting";
export interface User {
    email: string;
    testDate: Date;
    numPairs: NumPairs;
    gameType: GameType;
}

export interface Word {
    turkish: string
    english: string
}