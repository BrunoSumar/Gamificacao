import GoogleLoginButton from "./components/GoogleLoginButton";
import GoogleProvider from "./components/GoogleProvider";
import LogoutButton from "./components/LogoutButton";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { footerCustom } from "./styles";

const LoginOptions = ({ isLogged, setLogged, token, setToken, isLoading, setLoading }) => {
  const [ copySuccess, setCopySuccess ] = useState(false);

  const copyToClipboard = (e) => {
    const textField = document.createElement('textarea');
    textField.innerText = e.target.innerText;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    setCopySuccess(true);
  };

  if( isLoading ) {
    return (
        <><br/><br/><br/><h1 style={{ 'text-align': 'center' }} aria-busy='true'></h1></>
    );

  }

  if( isLogged ){
    return (
      <>
        <h3>Logoado com sucesso:</h3>
        <article onClick={ copyToClipboard }>{ token }</article>
        <p style={{ 'text-align': 'center' }}><ins>{ copySuccess ? 'Texto copiado' : <br/> } </ins></p>
        <LogoutButton setLogged={setLogged}/>
      </>
    );
  }

  return (
    <>
      <h3>Login:</h3>
      <GoogleProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <label>Login como aluno: </label>
        <GoogleLoginButton successPath={'api/login/aluno'} setToken={setToken} setLogged={setLogged} setLoading={setLoading}/>
        <label>Login como professor: </label>
        <GoogleLoginButton successPath={'api/login/professor'} setToken={setToken} setLogged={setLogged} setLoading={setLoading}/>
      </GoogleProvider>
    </>
  );

}

const LoginPage = () => {
  const [ token, setToken ] = useState(localStorage.getItem("app_jwt"));
  const [ isLogged, setLogged ] = useState(!!token);
  const [ isLoading, setLoading ] = useState(false);

  return (
    <main className="container">
      <br/>
      <LoginOptions
        isLogged={isLogged} setLogged={setLogged}
        isLoading={isLoading} setLoading={setLoading}
        token={token} setToken={setToken}
      />
      <br/>
      <footerCustom>
        <Link to="admin">Entrar como administrador</Link> <br/>
        <a href="#">Veja o projeto no github</a>
      </footerCustom>
    </main>
  );
};

export default LoginPage;
