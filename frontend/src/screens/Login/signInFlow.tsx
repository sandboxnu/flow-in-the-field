import { useNavigation } from "@react-navigation/core"
import React, { useState } from "react"
import FirebaseInteractor from "../../firebase/firebaseInteractor"
import AccountSettings from "./accountSettings"
import LoginPage from "./login"
import RecoverPasswordPage from "./recoverPassword"
import SignUpPage from "./signUp"


type CurrentPage = "signUp" | "signIn" | "recoverPassword"
const fi = new FirebaseInteractor();
export default function SignInFlow() {

    const userSignedIn = () => {
        if (fi.auth.currentUser?.emailVerified) {
            navigation.navigate("HomeScreen")
        } else {
            navigation.navigate("EmailVerification")
        }
    };

    const [currentPage, setCurrentPage] = useState<CurrentPage>("signUp")
    const navigation = useNavigation();
    if (currentPage == 'signIn') {
        return (<LoginPage
            goToSignUp={() => setCurrentPage("signUp")}
            goToRecoveryScreen={() => setCurrentPage("recoverPassword")}
            goToAccountSettings={userSignedIn} />)
    } else if (currentPage == "recoverPassword") {
        return (<RecoverPasswordPage goToSignIn={() => setCurrentPage("signIn")} />)
    } else {
        return (<SignUpPage goToSignIn={() => setCurrentPage("signIn")} goToAccountSettings={userSignedIn} />)
    }
}