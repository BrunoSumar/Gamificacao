import React from "react";
import GoogleLogin from "react-google-login";
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
          accessToken: response.accessToken,
          tokenId: response.tokenId,
        }),
      }
    );
    if (responseFetch.ok) {
      let jsonResponse = await responseFetch.json();
      console.log(jsonResponse);
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
        scope={"https://www.googleapis.com/auth/classroom.courses.readonly"}
        accessType='offline'
      />
    </div>
  );
}

export default App;
