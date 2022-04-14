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
    let extraContainerInfo;
    let textStyle;

    if (showingAnswers) {
        if (isPairing && !correct || !isPairing && !correct && englishSelectingWord === correctEnglish) {
            extraContainerInfo = showingResultsStyles.correctedRow;
            textStyle = styles.whiteText;
        } else {
            extraContainerInfo = showingResultsStyles.userCorrectRow;
            textStyle = styles.blackText;
        }
        extraTurkishInfo = showingResultsStyles.answersWord;
        extraEnglishInfo = showingResultsStyles.answersWord;
    } else {
        textStyle = styles.whiteText;
        if (correct) {
          extraTurkishInfo = showingResultsStyles.correctTurkishWord;
        } else if (unusedSelectingWord) {
          extraTurkishInfo = showingResultsStyles.unusedTurkishWord;
        } else {
            extraTurkishInfo = showingResultsStyles.incorrectTurkishWord;
        }
    }

    return (<View style={{...styles.container, ...extraContainerInfo}}>
        <View style={{...styles.turkishContainer,  ...extraTurkishInfo }}>
            <Text style={textStyle}>{turkish}</Text>
        </View>
            <View style={unusedSelectingWord && !showingAnswers ? undefined : {...styles.englishTextContainer, ...extraEnglishInfo}}>
                <Text style={textStyle}>
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
    answersWord: {
        backgroundColor: "transparent",
    },
    correctedRow: {
        backgroundColor: "#5BBAB7",
    },
    userCorrectRow: {
        backgroundColor: "#5BBAB725",
    }
})

const styles = StyleSheet.create({
    draxView: {
        borderColor: "#5BBAB7",
        borderWidth: 3,
        width: "45%",
        borderStyle: "dashed",
        height: "100%",
        // marginHorizontal: "5%",
        borderRadius: 0.0001
    },
    turkishContainer: {
        justifyContent: "center",
        width: "45%",
        height: "100%",
        backgroundColor: BLUE,
        // marginHorizontal: "5%",
    },
    whiteText: {
        textAlign: "center",
        color: "white",
    },
    englishTextContainer: {
        width: "45%",
        textAlign: "center",
        backgroundColor: GREY,
        height: "100%",
        color: "white",
        // marginHorizontal: "5%",
        justifyContent: "center",
        borderRadius: 0.000001
    },
    blackText: {
        color: 'black',
        textAlign: 'center',
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        width: "80%",
        height: "10%",
        marginVertical: "1%",
    }
});
