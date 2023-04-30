import { useGoogleLogin } from "@react-oauth/google";

import React, { useEffect, useState } from "react";
import { GoogleButtonCustom } from "./styles";
const GoogleLoginButton = (props) => {
  const [isLogged, setLogged] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("app_jwt")) {
      setLogged(true);
    }
  }, []);

  const onSuccess = async (token) => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}${props.successPath}`,
        {
          method: "POST",
          body: JSON.stringify({
            access_token: token.access_token,
          }),
        }
      );

      if (response.ok) {
        let jwt = await response.json();
        localStorage.setItem("app_jwt", jwt.token);
        setLogged(true);
      }
      else throw 'error'
    } catch (error) {
      alert("Error server response!!");
    }
  };

  const onError = (error) => alert("Error OnError!!");

  // const scope = "profile email https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.profile.emails"; //TODO Avaliar colocar isso como env
  const scope = "profile email https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly"; //TODO Avaliar colocar isso como env

  const login = useGoogleLogin({
    onSuccess: onSuccess,
    onError: onError,
    scope: scope,
  });

  return (
    <>
      {!isLogged ? (
        <GoogleButtonCustom
          style={{ border: "1px red" }}
          onClick={() => login()}
        >
          Sign in with Google
        </GoogleButtonCustom>
      ) : (
        <button onClick={_ => {localStorage.removeItem('app_jwt'); setLogged(false)}}> Logout </button>
      )}
    </>
  );
};

export default GoogleLoginButton;