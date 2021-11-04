import React, { useState } from "react"
import AccountSettings from "./accountSettings"
import LoginPage from "./login"
import RecoverPasswordPage from "./recoverPassword"
import SignUpPage from "./signUp"


type CurrentPage = "signUp" | "signIn" | "recoverPassword" | "accountSettings"

export default function SignInFlow() {
    const [currentPage, setCurrentPage] = useState<CurrentPage>("signUp")

    if (currentPage == 'signIn') {
        return (<LoginPage
            goToSignUp={() => setCurrentPage("signUp")}
            goToRecoveryScreen={() => setCurrentPage("recoverPassword")}
            goToAccountSettings={() => setCurrentPage("accountSettings")} />)
    } else if (currentPage == "recoverPassword") {
        return (<RecoverPasswordPage goToSignIn={() => setCurrentPage("signIn")} />)
    } else if (currentPage == "accountSettings") {
        return <AccountSettings goToSignupPage={() => setCurrentPage("signUp")} />
    } else {
        return (<SignUpPage goToSignIn={() => setCurrentPage("signIn")} goToAccountSettings={() => setCurrentPage("accountSettings")} />)
    }
}