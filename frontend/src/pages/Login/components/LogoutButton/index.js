import React  from "react";

const LogoutButton = ({ setLogged }) => {

  const logout = () => {
    localStorage.removeItem('app_jwt');
    setLogged(false);
  };

  return (
    <button onClick={logout}> Logout </button>
  )
};

export default LogoutButton;
