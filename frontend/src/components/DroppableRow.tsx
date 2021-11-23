import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { DraxView } from "react-native-drax";
interface DroppableRowProps {
    turkish: string,
    english?: string,
    correctEnglish: string,
    removeWord: () => void;
    wordDropped: (word: string) => void;
    showingResults: boolean
}

export default function DroppableRow({ turkish, english, removeWord, wordDropped, showingResults, correctEnglish }: DroppableRowProps) {
    const correct = english === correctEnglish;
    const extraEnglishInfo = showingResults ? correct ? showingResultsStyles.correctEnglishWord : showingResultsStyles.incorrectEnglishWord : {}
    const extraTurkishInfo = showingResults ? correct ? showingResultsStyles.correctTurkishWord : showingResultsStyles.incorrectTurkishWord : {}
    return (<View style={styles.container}>
        {english ?
            <TouchableOpacity style={{ ...styles.englishTextContainer, ...extraEnglishInfo }} onPress={() => !showingResults && removeWord()} disabled={showingResults}>
                <Text style={styles.englishText}>{english}</Text>
            </TouchableOpacity>
            : <DraxView style={styles.draxView}
                onReceiveDragDrop={({ dragged: { payload } }: { dragged: { payload: string } }) => {
                    wordDropped(payload);
                }}></DraxView>}
        <Text style={{ ...styles.turkishText, ...extraTurkishInfo }}>{turkish}</Text>
    </View>)
}

const showingResultsStyles = StyleSheet.create({
    incorrectEnglishWord: {
        backgroundColor: "#5BBAB780",
        borderColor: "transparent"
    },
    incorrectTurkishWord: {
        backgroundColor: "#C4C4C480"
    },
    correctEnglishWord: {
        backgroundColor: "#5BBAB7",
        borderColor: "transparent"
    },
    correctTurkishWord: {
        backgroundColor: "#C4C4C4"
    }
})

const styles = StyleSheet.create({
    draxView: {
        borderColor: "#5BBAB7",
        borderWidth: 3,
        width: "40%",
        borderStyle: "dashed",
        height: "100%",
        marginHorizontal: "5%",
        borderRadius: 0.0001
    },
    turkishText: {
        width: "40%",
        textAlign: "center",
        backgroundColor: "#C4C4C4",
        paddingVertical: "2%",
        color: "white",
        marginHorizontal: "5%"
    },
    englishTextContainer: {
        width: "40%",
        textAlign: "center",
        borderColor: "white",
        borderStyle: "dashed",
        borderWidth: 4,
        backgroundColor: "#5EAFDF",
        paddingVertical: "2%",
        color: "white",
        marginHorizontal: "5%",
        borderRadius: 0.000001
    },
    englishText: {
        color: 'white',
        textAlign: 'center',
    },
    container: {
        flexDirection: "row",
        alignItems: 'center',
        width: "100%",
        height: "11.5%",
        marginVertical: "0.5%",
    }
});