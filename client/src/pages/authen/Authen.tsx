import { useState } from "react"
import SignIn from "./sign-in"
import SignUp from "./sign-up"

import './authen.scss'

export default function Authen() {
    const [isSignIn, setIsSignIn] = useState<boolean>(true)
    const [isSignUp, setIsSignUp] = useState<boolean>(false);

    const toggleSwitchForm = () => {
        setIsSignIn(!isSignIn)
        setIsSignUp(!isSignUp)
    }

    return (
        <div>
            {isSignIn && <SignIn toggleSwitchForm={toggleSwitchForm}/>}
            {isSignUp && <SignUp toggleSwitchForm={toggleSwitchForm}/>}
        </div>
    )
}
