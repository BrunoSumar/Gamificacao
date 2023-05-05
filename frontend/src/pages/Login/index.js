import GoogleLoginButton from "./components/GoogleLoginButton";
import GoogleProvider from "./components/GoogleProvider";
import React from "react";

const LoginPage = () => {
  return (
    <GoogleProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      Login como aluno: <br/>
      <GoogleLoginButton successPath={'api/login/aluno'}/>
      <br/><br/><br/>
      Login como professor: <br/>
      <GoogleLoginButton successPath={'api/login/professor'}/>
    </GoogleProvider>
  );
};

export default LoginPage;
