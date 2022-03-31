import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BLUE, GREY } from "../../constants/colors";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { User, Word, UID, GameType } from "../../models/types";
import { durstenfeldShuffle } from "../../utils/utils";
import { DraxView, DraxProvider } from "react-native-drax";
import DroppableRow from "../../components/DroppableRow";
import { useNavigation } from "@react-navigation/core";
import { LoadingScreen } from "../../components/LoadingScreen";
import { NavigationContainer } from "@react-navigation/native";

const fi = new FirebaseInteractor();

export interface TestScreenProps {
    route: any;
}

export default function TestScreen(props: TestScreenProps) {

    const navigation = useNavigation();

    return (
        <DraxProvider>
            <View style={styles.container}>
                <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate("TestResultsScreen")}>
                    <Text style={{color: "#FFF", fontSize: 22}}>continue</Text>
                </TouchableOpacity>
            </View>
        </DraxProvider>
    )
}


const defaultStyle = StyleSheet.create({

});

const styles = StyleSheet.create({
   container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingTop: "5%"
   },
   startButton: {
    backgroundColor: "#5FBFF8",
    borderColor: "#5FBFF8",
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: '7.5%',
    width: '75%',
    paddingHorizontal: "5%",
    marginHorizontal: '3%',
    marginVertical: "1%",
    paddingVertical: 10,
    marginTop: "160%"
    }
})
