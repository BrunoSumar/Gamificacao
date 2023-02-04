import GoogleLoginButton from "./components/GoogleLoginButton";
import GoogleProvider from "./components/GoogleProvider";
import React from "react";

const LoginPage = () => {
  return (
    <GoogleProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <GoogleLoginButton />
    </GoogleProvider>
  );
};

export default LoginPage;
