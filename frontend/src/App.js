import React from "react";
import GoogleLogin from "react-google-login";
const responseGoogle = (response) => {
  console.log(response);
};
function App() {
  return (
    <div className="App" style={{backgroundColor:'#f0f0f0'}}>
      <GoogleLogin
        clientId={process.env.REACT_APP_CLIENT_ID}
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
        responseType="code"
        theme='dark'
      />
    </div>
  );
}

export default App;
