import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import TextIconButton from "../../components/Button/TextIconButton";
import { BLUE, GREY } from "../../constants/colors";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { User, Word, UID, GameType } from "../../models/types";
import { durstenfeldShuffle } from "../../utils/utils";
import { DraxView, DraxProvider } from "react-native-drax";
import DroppableRow from "../../components/DroppableRow";
import { useNavigation } from "@react-navigation/core";
import { LoadingScreen } from "../../components/LoadingScreen";

const TEST_RESULTS_HEADER_OPTIONS = {
    headerTitle: () => { return <Image style={styles.mainImage} source={require('../../assets/flow-icon.png')} /> },
    title: '',
    headerTitleAlign: "center" as "center",
    headerShadowVisible: false,
    headerTintColor: '#D16B50',
    headerBackTitle: '',
    headerStyle: {
      backgroundColor: '#FFF',
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    }
  }

const fi = new FirebaseInteractor();

export interface TestResultsScreenProps {
    route: any;
}

export default function TestResultsScreen(props: TestResultsScreenProps) {

    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
          ...TEST_RESULTS_HEADER_OPTIONS, headerStyle: {
                                        backgroundColor: '#6BC8FF',
                                        elevation: 0,
                                        shadowOpacity: 0,
                                        borderBottomWidth: 0,
                                    }
        });
      }, [navigation]);

    return (
        <DraxProvider>
            <View style={styles.container}>
                <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate("HomeScreen")}>
                    <Text style={{color: "#FFF", fontSize: 22}}>done</Text>
                </TouchableOpacity>
            </View>
        </DraxProvider>
    )
}

const styles = StyleSheet.create({
    mainImage: {
        width: 94,
        resizeMode: 'contain',
        height: 51
      },
    container: {
        flex: 1,
        backgroundColor: '#6BC8FF',
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingTop: "5%"
    },
    startButton: {
        backgroundColor: "#6E81E7",
        borderColor: "#6E81E7",
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