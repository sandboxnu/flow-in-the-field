import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { UID } from "../../models/types";
import FirebaseInteractor from "../../firebase/firebaseInteractor";
import { DraxProvider } from "react-native-drax";
import { useNavigation } from "@react-navigation/core";

const TEST_WELCOME_HEADER_OPTIONS = {
    headerTitle: () => { return <Image style={styles.mainImage} source={require('../../assets/flow-icon-light.png')} /> },
    title: '',
    headerTitleAlign: "center" as "center",
    headerShadowVisible: false,
    headerTintColor: '#D16B50',
    headerBackTitle: '',
    headerStyle: {
        backgroundColor: '#6E81E7',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
    }
  }

const fi = new FirebaseInteractor();

export interface TestWelcomeScreenProps {
    route: any;
}

export default function TestWelcomeScreen(props: TestWelcomeScreenProps) {

    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions(TEST_WELCOME_HEADER_OPTIONS);
      }, [navigation]);

      const startTest = () => {
          fi.startTest().then((testId: UID) => navigation.navigate("TestScreen", { testId: testId }))
      }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.startButton} onPress={() => startTest()}>
                <Text style={{color: "#FFF", fontSize: 22}}>start</Text>
            </TouchableOpacity>
        </View>
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
        backgroundColor: '#6E81E7',
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
        marginTop: "160%"
    }
})
