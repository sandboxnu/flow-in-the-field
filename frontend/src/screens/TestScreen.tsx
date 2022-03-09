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

const fi = new FirebaseInteractor();

export interface TestScreenProps {
    route: any;
}

export default function TestScreen(props: TestScreenProps) {

    return (
        <DraxProvider>

        </DraxProvider>
    )
}


const defaultStyle = StyleSheet.create({

});

const styles = StyleSheet.create({
   
})
