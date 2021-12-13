import { useNavigation } from "@react-navigation/core"
import React, { useEffect, useState } from "react"
import FirebaseInteractor from "../../firebase/firebaseInteractor"
import AccountSettings from "./accountSettings"
import LoginPage from "./login"
import RecoverPasswordPage from "./recoverPassword"
import SignUpPage from "./signUp"


type CurrentPage = "signUp" | "signIn" | "recoverPassword"
const fi = new FirebaseInteractor();
export default function SignInFlow() {
    const [currentPage, setCurrentPage] = useState<CurrentPage>("signUp")
    const navigation = useNavigation();

    useEffect(() => {
        fi.trySignedIn().then(user => user && navigation.navigate("HomeScreen"))
    }, [])
    if (currentPage == 'signIn') {
        return (<LoginPage
            goToSignUp={() => setCurrentPage("signUp")}
            goToRecoveryScreen={() => setCurrentPage("recoverPassword")}
            goToAccountSettings={() => navigation.navigate("HomeScreen")} />)
    } else if (currentPage == "recoverPassword") {
        return (<RecoverPasswordPage goToSignIn={() => setCurrentPage("signIn")} />)
    } else {
        return (<SignUpPage goToSignIn={() => setCurrentPage("signIn")} goToAccountSettings={() => navigation.navigate("HomeScreen")} />)
    }
}