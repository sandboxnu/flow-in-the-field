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
import CustomTextInput from "../components/TextInput/CustomTextInput";

const fi = new FirebaseInteractor();

export interface AdminScreenProps {
    route: any;
}

export default function AdminScreen(props: AdminScreenProps) {

    const [consentText, setConsentText] = useState("");

    useEffect(() => {
        fi.getConsentText().then((text) => {
            setConsentText(text);
        })
    }, [])

    const saveConsentText = () => {
        fi.setConsentText(consentText);
    }

    return (
        <DraxProvider>
            <View style={styles.container}>
                <CustomTextInput
                    placeholderText="consent text"
                    value={consentText}
                    setValue={setConsentText}
                    secureText={false} />
                <TouchableOpacity style={styles.saveButton} onPress={saveConsentText}>
                    <Text style={{ color: "#FFF", fontSize: 22 }}>Save</Text>
                </TouchableOpacity>
            </View>
        </DraxProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        flex: 1,
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingTop: "5%"
    },
    saveButton: {
        backgroundColor: "#5FBFF8",
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        height: "7.5%",
        width: "75%"
    }
})
