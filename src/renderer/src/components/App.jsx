import Login from "./Login";
import MainPage from "./MainPage";
import { useState, useEffect } from 'react';

import '../assets/base.css';
import '../assets/login.css';

export default function App() {
    const [isLogged, setIsLogged] = useState(false);
    const [session, setSession] = useState(null);
    const [accounts, setAccounts] = useState(null);

    const turnOffDashboard = () => {
        setIsLogged(false);
        setAccounts(null);
    }
    
  return (
    <>
        <Login setAccountsProps={setAccounts} setSessionProps={setSession} loginState={isLogged} actualizarLogin={setIsLogged} />
        <MainPage backToLogin={turnOffDashboard} CuentasProp={accounts ? accounts.Cuentas : null} UsuarioProp={session ? session : null} loginState={isLogged}/>
    </>
);

}
