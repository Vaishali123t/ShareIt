import React, {useContext} from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Login = (props) => {

    const auth=useContext(AuthContext);

      const [formState, inputHandler] = useForm(
        {
          email: {
            value: "",
            isValid: false,
          },
          password: {
            value: "",
            isValid: false,
          },
        },
        false
      );


      
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

      const loginHandler= async (event)=>{
        event.preventDefault();
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: formState.inputs.email.value,
                password: formState.inputs.password.value,
              }),
            }
          );
          const responseData = await response.json();
          console.log(responseData);
        } catch (err) {
          console.log(err);
        }

        auth.login();
      }

  return (
    <form onSubmit={loginHandler}>
      <Input
        id="email"
        element="input"
        type="email"
        label="Email"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
        onInput={inputHandler}
        errorText="Please enter a valid email."
      />
      <Input
        id="password"
        element="input"
        type="text"
        label="Password"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        onInput={inputHandler}
        errorText="Please enter a valid password."
      />
      <Button type="submit" disabled={!formState.isValid}>
        Login
      </Button>
      <Button onClick={props.onClick}> Want to signup?</Button>
    </form>
  );
};

export default Login;
