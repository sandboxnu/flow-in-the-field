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
        <DraxProvider>
            <Text>This is admin placeholder hooray</Text>
            <PrimaryButton onPress={async () => {
                await promptExportEmail(await generateRoundsCSV());
            }} disabled={false} text="create csv" />
        </DraxProvider>
    )
}


const defaultStyle = StyleSheet.create({

});

const styles = StyleSheet.create({

})
