import React from "react";
import DroppableRow from "./DroppableRow";
import ResultRow from "./ResultRow";
interface CustomRowProps {
    turkish: string,
    englishSelectingWord?: string,
    english?: string,
    correctEnglish: string,
    removeWord: () => void;
    wordDropped: (word: string) => void;
    showingResults: boolean,
    showingAnswers: boolean, 
    isPairing: boolean
}

export default function CustomRow({ turkish, english, removeWord, wordDropped, showingResults, showingAnswers, correctEnglish, isPairing }: CustomRowProps) {
    if (showingResults) {
      return (<ResultRow
        key={turkish}
        showingAnswers={showingAnswers}
        turkish={turkish}
        english={english}
        correctEnglish={correctEnglish} 
        isPairing={isPairing}
      />)
    } else {
      return (<DroppableRow
        key={turkish}
        wordDropped={wordDropped}
        turkish={turkish}
        english={english}
        removeWord={removeWord}
        isPairing={isPairing}
      />)
    }
}
