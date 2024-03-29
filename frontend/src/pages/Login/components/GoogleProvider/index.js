import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

const GoogleProvider = (props) => {
  return (
    <GoogleOAuthProvider clientId={props.clientId}>
      {props.children}
    </GoogleOAuthProvider>
  );
};

export default GoogleProvider;
