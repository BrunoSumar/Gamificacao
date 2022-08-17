import React, { useEffect } from "react";

function App() {
  const fetchAccessTokenToServer = async (response) => {
    let customHeader = new Headers();
    try {
      console.log(response);
      let responseFetch = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/login/aluno`,
        {
          method: "POST",
          headers: customHeader,
          body: JSON.stringify({
            access_token: response.access_token,
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

  /* global google*/
  const client = google.accounts.oauth2.initTokenClient({
    client_id: process.env.REACT_APP_CLIENT_ID,
    scope:
      "https://www.googleapis.com/auth/classroom.courses.readonly \
      https://www.googleapis.com/auth/userinfo.profile \
      openid \
      email",
    callback: fetchAccessTokenToServer,
  });

  return (
    <div>
      <button onClick={() => client.requestAccessToken()} id="signInDiv">
        Google Login
      </button>
    </div>
  );
}

export default App;
