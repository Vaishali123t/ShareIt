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


const Signup = (props) => {

  const auth=useContext(AuthContext);

      const [formState, inputHandler, setFormData] = useForm(
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


      const signupHandler = async (event) => {
    
        event.preventDefault();
        setFormData(
          {
            ...formState.inputs,
            name: undefined,
          },
          formState.inputs.email.isValid &&
            formState.inputs.password.isValid
        );
        try{
          const response=await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
           body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        const responseData= await response.json();
        }catch(err){
          console.log(err)
        }

        auth.login();
      };
      
  return (
    <form onSubmit={signupHandler}>
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
        id="username"
        element="input"
        type="text"
        label="Username"
        validators={[VALIDATOR_REQUIRE()]}
        onInput={inputHandler}
        errorText="Please enter a valid username."
      />
      <Input
        id="password"
        element="input"
        type="password"
        label="Password"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        onInput={inputHandler}
        errorText="Please enter a valid password."
      />
      <Button type="submit" disabled={!formState.isValid}>
        Signup
      </Button>
      <Button onClick={props.onClick}> Want to login?</Button>
    </form>
  );
};

export default Signup;
