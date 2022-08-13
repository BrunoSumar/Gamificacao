import React, { useEffect } from "react";

function App() {
  function handleCallbackResponse(response) {
    console.log(response);
  }

  /* global google*/
  const client = google.accounts.oauth2.initTokenClient({
    client_id: process.env.REACT_APP_CLIENT_ID,
    scope: "https://www.googleapis.com/auth/classroom.courses.readonly",
    callback: handleCallbackResponse,
  });

  return (
    <div>
      <button onClick={() => client.requestAccessToken()} id="signInDiv">Google Login</button>
    </div>
  );
}

export default App;
