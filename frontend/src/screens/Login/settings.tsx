import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import MediumText from "../../components/Text/MediumText";
import RegularText from "../../components/Text/RegularText";
import { BLUE, GREY, LIGHTPURPLE } from "../../constants/colors";
import FirebaseInteractor from "../../firebase/firebaseInteractor";

const fi = new FirebaseInteractor();
export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <RegularText style={styles.label}>Email</RegularText>
        <View style={styles.scroll}>
          <ScrollView horizontal>
            <RegularText style={styles.value}>{fi.email}</RegularText>
          </ScrollView>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <RegularText style={styles.label}>Password</RegularText>
        <RegularText style={styles.value}>********</RegularText>
      </View>
      <View style={styles.row}>
        <RegularText style={styles.label} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ChangePasswordScreen")}
        >
          <MediumText style={styles.buttonText}>change password</MediumText>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <RegularText style={styles.label} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            fi.logout().then(() => navigation.navigate("SignInFlow"));
          }}
        >
          <MediumText style={styles.buttonText}>logout</MediumText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    height: "100%",
  },
  divider: {
    borderWidth: 0.5,
    borderColor: GREY,
  },
  row: {
    flexDirection: "row",
    height: "10%",
    alignItems: "center",
  },
  label: {
    flex: 1,
    fontWeight: "500",
    color: BLUE,
    fontSize: 24,
    textAlignVertical: "center",
  },
  value: {
    flex: 2,
    textAlign: "right",
    textAlignVertical: "center",
    fontSize: 21,
  },
  button: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: LIGHTPURPLE,
    justifyContent: "center",
    padding: "2%",
  },
  buttonText: {
    color: "white",
    fontSize: 21,
    textAlign: "center",
  },
  scroll: {
    flex: 1,
  },
  gradient: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 10,
  },
});
