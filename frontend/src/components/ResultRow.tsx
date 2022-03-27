import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BLUE, GREY, ORANGE } from "../constants/colors";
interface ResultRowProps {
    turkish: string,
    englishSelectingWord?: string,
    english?: string,
    correctEnglish: string,
    showingAnswers: boolean, 
    isPairing: boolean
}

export default function ResultRow({ turkish, englishSelectingWord, english, showingAnswers, correctEnglish, isPairing }: ResultRowProps) {
    const correct = english === correctEnglish;
    const unusedSelectingWord = (!english) && !isPairing;
    
    let extraTurkishInfo;
    let extraEnglishInfo;

    if (showingAnswers) {
        if (isPairing && !correct || !isPairing && !correct && englishSelectingWord === correctEnglish) {
            extraEnglishInfo = showingResultsStyles.correctedEnglishWord;
        }
        if (correctEnglish == englishSelectingWord || isPairing) {
          extraTurkishInfo = showingResultsStyles.correctTurkishWord;
        } else {
          extraTurkishInfo = showingResultsStyles.unusedTurkishWord;
        }
    } else {
        if (correct) {
          extraTurkishInfo = showingResultsStyles.correctTurkishWord;
        } else if (unusedSelectingWord) {
          extraTurkishInfo = showingResultsStyles.unusedTurkishWord;
        } else {
            extraTurkishInfo = showingResultsStyles.incorrectTurkishWord;
        }
    }

    return (<View style={styles.container}>
        <View style={{...styles.turkishContainer,  ...extraTurkishInfo }}>
            <Text style={{ ...styles.turkishText, ...extraTurkishInfo }}>{turkish}</Text>
        </View>
            <View style={unusedSelectingWord && !showingAnswers ? undefined : {...styles.englishTextContainer, ...extraEnglishInfo}}>
                <Text style={styles.englishText}>
                    {showingAnswers ? correctEnglish : english}
                </Text>
            </View>
    </View>)
}

const showingResultsStyles = StyleSheet.create({
    incorrectTurkishWord: {
        backgroundColor: ORANGE,
        borderColor: "transparent"
    },
    incorrectEnglishWord: {
        backgroundColor: ORANGE,
        borderColor: "transparent"
    },
    correctTurkishWord: {
        backgroundColor: "#5BBAB7",
        borderColor: "transparent"
    },
    unusedTurkishWord: {
        backgroundColor: BLUE,
        borderColor: "transparent"
    },
    correctedEnglishWord: {
      borderColor: "#5BBAB7",
      borderWidth: 2,
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
    turkishContainer: {
        justifyContent: "center",
        width: "40%",
        height: "100%",
        backgroundColor: BLUE,
        marginHorizontal: "5%"
    },
    turkishText: {
        textAlign: "center",
        color: "white",
        backgroundColor: BLUE,
    },
    englishTextContainer: {
        width: "40%",
        textAlign: "center",
        backgroundColor: GREY,
        height: "100%",
        color: "white",
        marginHorizontal: "5%",
        justifyContent: "center",
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
        height: "12.5%",
        paddingVertical: "1.5%"
    }
});
