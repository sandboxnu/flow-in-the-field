export type NumPairs = 2 | 4 | 8;

export type GameType = "pairing" | "selecting";

export type UID = string;

export type FirstSession = boolean;

export interface User {
    email: string;
    testDate: Date;
    numPairs: NumPairs;
    gameType: GameType;
}

export interface Word {
    turkish: string;
    english: string;
}

export interface Session {
    user: UID;
    startTime: Date;
    endTime: Date | null;
}

export interface Round {
    session: UID;
    startTime: Date;
    endTime: Date | null;
    words: Word[];
}

export interface Match {
    round: UID;
    turkish: string;
    english: string;
    correct: boolean;
}
