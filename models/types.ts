export type User = {
    id: string,
    sessionId: SessionId
}

export type SessionId = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;