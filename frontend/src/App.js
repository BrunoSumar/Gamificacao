import React, { createContext } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto-js";
const client = new OAuth2Client(
  process.env.REACT_APP_CLIENT_ID,
  process.env.REACT_APP_CLIENT_SECRET,
  "http://localhost:3000"
);

const fetchAccessTokenToServer = async (response) => {
  let customHeader = new Headers();
  try {
    let token = await getAuthAndRefreshToken(response.code);
    console.log(token);
    localStorage.setItem('googleTokens',crypto.AES.encrypt(
      JSON.stringify({
        access_token: token.access_token,
        id_token: token.id_token,
        refresh_token: token.refresh_token,
        expiry_date:token.expiry_date
      }),
      process.env.REACT_APP_CRYPTO_CODE
    ))
    let responseFetch = await fetch(
      `${process.env.REACT_APP_SERVER_URL}api/login/aluno`,
      {
        method: "POST",
        headers: customHeader,
        body: JSON.stringify({
          id_token: token.id_token,
          access_token: token.access_token,
        }),
      }
    );
    if (responseFetch.ok) {
      let jsonResponse = await responseFetch.json();
      console.log(jsonResponse);
    } else throw false;
  } catch (error) {
    console.log(error);
  }
};

async function getAuthAndRefreshToken(code) {
  try {
    const response = await client.getToken(code);
    return response.tokens;
  } catch (e) {
    console.log(e);
  }
}

function App() {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => fetchAccessTokenToServer(codeResponse),
    flow: "auth-code",
    scopes:"https://www.googleapis.com/auth/classroom.courses.readonly"
  });

  return (
    <div className="App" style={{ backgroundColor: "#f0f0f0" }}>g
      {process.env.REACT_APP_CLIENT_ID}
      <button onClick={() => login()} />
    </div>
  );
}

export default App;
