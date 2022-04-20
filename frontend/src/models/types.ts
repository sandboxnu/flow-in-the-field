import { Role } from "../constants/role";

export type NumPairs = 2 | 4 | 8;

export type GameType = "pairing" | "selecting";

export type UID = string;

export interface User {
    email:    string;
    testDate: Date;
    numPairs: NumPairs;
    gameType: GameType;
    role: Role
}

export interface Word {
    turkish: string;
    english: string;
}

export interface Session {
    user:      UID;
    startTime: Date;
    endTime:   Date | null;
}

export interface Round {
    session:   UID;
    startTime: Date;
    endTime:   Date | null;
    words:     Word[];
    correctWords:    Word[] | null;
}

export interface Match {
    round:   UID;
    turkish: string;
    english: string;
    correct: boolean;
}

export interface RoundWithId {
    id: string,
    round: Round
}
