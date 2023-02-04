import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import crypto from "crypto-js";

import React from "react";

const Test = () => {
  const onSuccess = async (token) => {
    console.log(token)
    await fetch(`${process.env.REACT_APP_SERVER_URL}api/login/aluno`, {
      method: "POST",
      body: JSON.stringify({
        access_token: token.access_token,
      })
    }).then((response) => {
      if(response.ok){
        localStorage.setItem('googleTokens',crypto.AES.encrypt(
          JSON.stringify({
            access_token: token.access_token,
          }),
          process.env.REACT_APP_CRYPTO_CODE))
      }
    });
  };

  const login = useGoogleLogin({
    onSuccess: onSuccess,
    onError: (tokenResponse) => console.log("Erro"),
    scope:
      "profile email https://www.googleapis.com/auth/classroom.courses.readonly",
  });

  return <div onClick={() => login()}>Sign in with Google 🚀 </div>;
};

const app = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <Test />
    </GoogleOAuthProvider>
  );
};

export default app;
