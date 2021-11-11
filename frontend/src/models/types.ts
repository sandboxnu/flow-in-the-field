export type NumPairs = 2 | 4 | 8;
export type GameType = "matching" | "multipleChoice";
export interface User {
    email: string;
    testDate: Date;
    numPairs: NumPairs;
    gameType: GameType;
}