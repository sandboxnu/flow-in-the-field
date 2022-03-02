import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface TextIconButtonProps {
    text: string;
    icon: number;
    onPress: () => void;
}
export default function CustomButton({ text, icon, onPress }: TextIconButtonProps) {
    return (
        <TouchableOpacity
          onPress={onPress}
        >
          <Text>play again</Text>
        </TouchableOpacity>)


    // <View style={styles.doneContainer}>
    //   {submitted && <TouchableOpacity
    //       style={{ ...styles.doneButton, ...(isLoading ? styles.inactiveButton : {}) }}
    //       disabled={isLoading}
    //       onPress={() => {
    //           setIsLoading(true);
    //           restartRound()
    //       }}>
    //       <Text style={styles.doneButtonTitle}>play again</Text>
    //   </TouchableOpacity>}
    //   <TouchableOpacity style={submitted ? { ...styles.endSessionButton, ...(isLoading ? { borderColor: "#D16B5025" } : {}) }
    //       : { ...styles.doneButton, ...extraButtonStyles }} disabled={submitted ? isLoading : !canClickDoneButton} onPress={() => {
    //           if (submitted) {
    //               fi.endRound(currentRoundId);
    //               fi.endSession(sessionId);
    //               navigation.navigate("HomeScreen");
    //           } else {
    //               setSubmitted(true)
    //           }
    //       }}><Text style={submitted ? { ...styles.endSessionButtonTitle, ...(isLoading ? { color: "#D16B5025" } : {}) }
    //         : styles.doneButtonTitle}>{submitted ? "end session" : "done"}</Text></TouchableOpacity>
    // </View>
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: "#d16b50",
        borderRadius: 20,
        width: "75%",
        flexDirection: "row",
        paddingHorizontal: 5,
        paddingVertical: "4%",
        marginVertical: 5,
        alignItems: "center",
        justifyContent: "space-between"
    },
    text: {
        fontSize: 22,
        fontWeight: "400",
        margin: "auto",
        textAlign: "center",
        flex: 1,
        color: "white"
    },
    image: {
        resizeMode: "contain",
        maxWidth: 68,
        maxHeight: 60,
        marginRight: 5
    }
});