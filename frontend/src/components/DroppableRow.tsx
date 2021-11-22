import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { DraxView } from "react-native-drax";
interface DroppableRowProps {
    turkish: string,
    english?: string,
    removeWord: () => void;
    wordDropped: (word: string) => void;
    showingResults: boolean
}

export default function DroppableRow({ turkish, english, removeWord, wordDropped, showingResults }: DroppableRowProps) {
    const extraEnglishInfo = showingResults ? showingResultsStyles.englishWord : {}
    const extraTurkishInfo = showingResults ? showingResultsStyles.turkishWord : {}
    return (<View style={styles.container}>
        {english ?
            <TouchableOpacity style={{...styles.englishTextContainer, ...extraEnglishInfo}} onPress={() => !showingResults && removeWord()} disabled={showingResults}>
                <Text style={styles.englishText}>{english}</Text>
            </TouchableOpacity>
            : <DraxView style={styles.draxView}
                onReceiveDragDrop={({ dragged: { payload } }: { dragged: { payload: string } }) => {
                    wordDropped(payload);
                }}></DraxView>}
        <Text style={{... styles.turkishText, ...extraTurkishInfo}}>{turkish}</Text>
    </View>)
}

const showingResultsStyles = StyleSheet.create({
    englishWord: {
        backgroundColor: "#5BBAB780",
        borderColor: "transparent"
    },
    turkishWord: {
        backgroundColor: "#C4C4C480"
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
        color: "white"
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
        height: 50,
        marginVertical: "1%"
    }
});