import React from "react";
import GoogleLogin from "react-google-login";
const fetchAccessTokenToServer = async (response) => {
  let customHeader = new Headers();
  try {
    let responseFetch = await fetch(`${process.env.REACT_APP_SERVER_URL}login`, {
      method: "POST",
      headers: customHeader,
      body: {
        AccessToken: response.accessToken,
      },
    });
    if (responseFetch.ok) {
      let jsonResponse = await responseFetch.json();
      console.log(jsonResponse || "a");
    } else throw false;
  } catch (error) {
    alert("Error");
  }
};
function App() {
  return (
    <div className="App" style={{ backgroundColor: "#f0f0f0" }}>
      <GoogleLogin
        clientId={process.env.REACT_APP_CLIENT_ID}
        buttonText="Login"
        onSuccess={fetchAccessTokenToServer}
        onFailure={(err) => alert(err)}
        cookiePolicy={"single_host_origin"}
        theme="dark"
      />
    </div>
  );
}

export default App;
