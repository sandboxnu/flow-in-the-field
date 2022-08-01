import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { DraxProvider } from "react-native-drax";
import { useNavigation } from "@react-navigation/core";
import MediumText from "../../components/Text/MediumText";
import RegularText from "../../components/Text/RegularText";

const TEST_RESULTS_HEADER_OPTIONS = {
    headerTitle: () => { return <Image style={styles.mainImage} source={require('../../assets/flow-icon-light.png')} /> },
    title: '',
    headerTitleAlign: "center" as "center",
    headerShadowVisible: false,
    headerTintColor: '#D16B50',
    headerBackTitle: '',
    headerStyle: {
        backgroundColor: '#6BC8FF',
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
    const correct = props.route.params.correct;
    const total = props.route.params.total;

    React.useLayoutEffect(() => {
        navigation.setOptions(TEST_RESULTS_HEADER_OPTIONS);
    }, [navigation]);

    return (
        <DraxProvider>
            <View style={styles.container}>
                <View style={styles.scoreContainer}>
                    <RegularText style={styles.resultText}>You got</RegularText>
                    <MediumText style={styles.scoreText}>{correct}/{total}</MediumText>
                    <RegularText style={styles.resultText}>correct!</RegularText>
                </View>
                <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate("HomeScreen", { testFinished: true })}>
                    <MediumText style={{ color: "#FFF", fontSize: 22 }}>done</MediumText>
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
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: '#6BC8FF',
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingTop: "5%"
    },
    scoreContainer: {
        flex: 0,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
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
    },
    resultText: {
        color: "#FFF",
        fontSize: 48
    },
    scoreText: {
        color: "#FFF",
        fontSize: 96
    }
})
