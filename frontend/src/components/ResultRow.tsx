import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BLUE, GREY, ORANGE } from "../constants/colors";

interface ResultRowProps {
    turkish: string,
    english?: string,
    correctEnglish: string,
    showingAnswers: boolean, 
    isPairing: boolean
}

export default function ResultRow({ turkish, english, showingAnswers, correctEnglish, isPairing }: ResultRowProps) {
    const correct = english === correctEnglish;
    const unusedSelectingWord = (!english) && !isPairing;
    
    let additionalTurkishStyling;
    let additionalEnglishStyling;
    let additionalContainerStyling;
    let textStyle;

    if (showingAnswers) {
        // use the light green styling on all words on the correct answers screen
        additionalContainerStyling = showingResultsStyles.answerRow;
        textStyle = styles.blackText;
        additionalTurkishStyling = showingResultsStyles.answersWord;
        additionalEnglishStyling = showingResultsStyles.answersWord;
    } else {
        textStyle = styles.whiteText;
        if (correct) {
          additionalTurkishStyling = showingResultsStyles.correctTurkishWord;
        } else if (unusedSelectingWord) {
          additionalTurkishStyling = showingResultsStyles.unusedTurkishWord;
        } else {
            additionalTurkishStyling = showingResultsStyles.incorrectTurkishWord;
        }
    }

    return (<View style={{...styles.container, ...additionalContainerStyling}}>
        <View style={{...styles.turkishContainer,  ...additionalTurkishStyling }}>
            <Text style={textStyle}>{turkish}</Text>
        </View>
            <View style={unusedSelectingWord && !showingAnswers ? undefined : {...styles.englishTextContainer, ...additionalEnglishStyling}}>
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
    answerRow: {
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
