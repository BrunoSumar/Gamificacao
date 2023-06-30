import { useGoogleLogin } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { GoogleButtonCustom } from "./styles";

const GoogleLoginButton = ({ successPath, setLogged, setToken, setLoading }) => {

  const onSuccess = async (token) => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}${successPath}`,
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
        setToken(jwt.token);
        setLogged(jwt.token);
        setLoading(false);
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
    <GoogleButtonCustom
      style={{ border: "1px red" }}
      onClick={() => { setLoading(true); login(); }}
    >
      Sign in with Google
    </GoogleButtonCustom>
  );
};

export default GoogleLoginButton;
