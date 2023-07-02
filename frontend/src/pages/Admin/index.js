import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [ user, setUser ] = useState(null);
  const [ password, setPassword ] = useState(null);
  const navigate = useNavigate();

  const handleChange = setter => event => setter(event.target.value);

  const login = async e => {
    e.preventDefault();
    const payload = { user, password };
    try {
      console.log(payload)
      let response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/login/administrador`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("app_jwt", token);
        navigate('/');
      }
      else throw 'error'
    } catch (error) {
      console.error( error );
      alert("Erro ao realizar login como administrador");
    }
  };

  return (
    <>
      <br/>
      <h3>Login como administrador:</h3>

      <article>
        <form>
          <label>Nome:</label>
          <input type="text"     onChange={handleChange(setUser)}/>
          <label>Senha:</label>
          <input type="password" onChange={handleChange(setPassword)}/>
          <br/><br/>
          <button onClick={login}>Login</button>
        </form>
      </article>

      <Link to="/">Volar ao inicio</Link>
    </>
  );
};

export default LoginPage;
