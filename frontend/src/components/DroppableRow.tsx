import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { DraxView } from "react-native-drax";
interface DroppableRowProps {
    turkish: string,
    english?: string,
    removeWord: () => void;
    wordDropped: (word: string) => void;
}

export default function DroppableRow({ turkish, english, removeWord, wordDropped }: DroppableRowProps) {
    return (<View style={styles.container}>
        {english ? <TouchableOpacity onPress={removeWord}><Text>{english}</Text></TouchableOpacity> : <DraxView style={styles.draxView}
            onReceiveDragDrop={({ dragged: { payload } }: { dragged: { payload: string } }) => {
                wordDropped(payload);
            }}></DraxView>}
        <Text>{turkish}</Text>
    </View>)
}

const styles = StyleSheet.create({
    draxView: {
        width: "40%",
        borderColor: "green",
        borderWidth: 5
    },
    container: {
        flexDirection: "row"
    }
});