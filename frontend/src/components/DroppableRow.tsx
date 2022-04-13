import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { DraxView } from "react-native-drax";
import { BLUE, GREY, ORANGE } from "../constants/colors";
interface DroppableRowProps {
    turkish: string,
    english?: string,
    removeWord: () => void;
    wordDropped: (word: string) => void;
    isPairing: boolean
}

export default function DroppableRow({ turkish, english, removeWord, wordDropped, isPairing }: DroppableRowProps) {
    const unusedSelectingWord = !english && !isPairing;


    const [dragging, setDragging] = useState(false)
    return (<View style={styles.container}>
        <View style={{ ...styles.turkishContainer}}>
            <Text style={{ ...styles.turkishText}}>{turkish}</Text>
        </View>
        {(english) ?
            <DraxView style={{ ...styles.englishTextContainer }}
                dragPayload={english} 
                draggable={true}
                draggingStyle={{opacity: 0.3}} 
                dragReleasedStyle={{opacity: 0.3}} 
                key={1}
                onDragStart={() => setDragging(false)}
                hoverDraggingStyle={{borderColor: "transparent"}}
                onDrag={event => {
                    if (Math.abs(event.dragTranslation.x) > 1 || Math.abs(event.dragTranslation.y) > 1) {
                        setDragging(true)
                    }
                }}
                onDragEnd={() => {
                    if (!dragging) {
                        removeWord();
                    }
                    setDragging(false)
                }} // This is a hack since there is no way to interact draxview with a touch handler
                longPressDelay={1}>
                <Text style={styles.englishText}>{english}</Text>
            </DraxView>
            
            : <DraxView style={styles.draxView}
                onReceiveDragDrop={({ dragged: { payload } }: { dragged: { payload: string } }) => {
                    wordDropped(payload);
                }}
                key={2}></DraxView>}
    </View>)
}

const showingResultsStyles = StyleSheet.create({
    incorrectTurkishWord: {
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
        borderColor: "white",
        borderStyle: "dashed",
        borderWidth: 2,
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
        width: "90%",
        height: "12.5%",
        paddingVertical: "1.5%",
        marginVertical: "0.5%",
    }
});