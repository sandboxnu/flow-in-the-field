import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BLUE, GREY } from "../constants/colors";
import FirebaseInteractor from "../firebase/firebaseInteractor";
import { User, Word, UID, GameType } from "../models/types";
import { durstenfeldShuffle } from "../utils/utils";
import { DraxView, DraxProvider } from "react-native-drax";
import DroppableRow from "../components/DroppableRow";
import { useNavigation } from "@react-navigation/core";
import { LoadingScreen } from "../components/LoadingScreen";
import PrimaryButton from "../components/Button/PrimaryButton";
import { collection } from "firebase/firestore";
import { generateRoundsCSV, promptExportEmail, testJson } from "../firebase/csvExporter";

const fi = new FirebaseInteractor();

export interface AdminScreenProps {
    route: any;
}

export default function AdminScreen(props: AdminScreenProps) {


    return (
        <View>
            <Text>Press the buttons below to export data as an email with a CSV attachment.</Text>

            <Text>Practice Data</Text>

            <Text>The Practice Data CSV will contain the following information for all practice rounds played by participants:</Text>
            <Text>User ID</Text>
            <Text>Game Type</Text>
            <Text>Number of Turkish Words</Text>
            <Text>Session ID</Text>
            <Text>Round ID</Text>
            <Text>Start Time</Text>
            <Text>Duration</Text>
            <Text>Score</Text>

            <PrimaryButton onPress={async () => {
                await promptExportEmail(await generateRoundsCSV());
            }} disabled={false} text="Export Practice CSV" />

            <Text>Round Data</Text>

            <Text>The Test Data CSV will contain the following information for all test questions answered by participants:</Text>
            <Text>Participant ID</Text>
            <Text>Game Type</Text>
            <Text>Test Session ID</Text>
            <Text>Question Number</Text>
            <Text>Start Time</Text>
            <Text>End Time</Text>
            <Text>Duration</Text>
            <Text>Answer</Text>
            <Text>Correctness</Text>

            <PrimaryButton onPress={async () => {
                await promptExportEmail(await generateTestRoundsCSV());
            }} disabled={false} text="Export Test CSV" />
        </View>
    )
}


const defaultStyle = StyleSheet.create({

});

const styles = StyleSheet.create({

})
function generateTestRoundsCSV(): Object[] | PromiseLike<Object[]> {
    throw new Error("Function not implemented.");
}

