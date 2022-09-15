import React, {useState} from "react"

import Signup from "../components/Signup";
import Login from "../components/Login";
// import {switchModeHandler} from "../components/Signup"

const Auth=()=>{

    const [showSignup,setShowSignup]=useState(false);

    const switchModeHandler=()=>{
            setShowSignup(prevMode=> !prevMode);
            // switchModeHandler();
    }

        if(showSignup){
            return <Signup onClick={switchModeHandler} />;
        }
        
        return <Login onClick={switchModeHandler} />;

};

export default Auth;