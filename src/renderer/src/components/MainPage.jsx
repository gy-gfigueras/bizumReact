import '../assets/base.css';
import '../assets/dashboard.css';
import SelectAccount from './SelectAccount';
import Dashboard from './Dashboard';
import { useEffect, useState } from 'react';

export default function MainPage({loginState, UsuarioProp, CuentasProp, backToLogin}) {
    const [isSessionChosen, setIsSessionChosen] = useState(false);
    const [account, setAccount] = useState(null);
    const [card, setCard] = useState(null);

    const back = () => {
        setIsSessionChosen(false);
        setAccount(null);
        setCard(null);
        backToLogin();
    }

    return (
        <div className={`MainPage ${loginState ? 'flex' : 'none'}`}>
            <section className={isSessionChosen ? 'none' : 'flex'}>
                <SelectAccount sessionChosen={isSessionChosen} setCard={setCard}  setAccount={setAccount}  User={UsuarioProp} Back={backToLogin} setSessionChosen={setIsSessionChosen} Accounts={CuentasProp}/>
            </section>
            <section className={`dashboard ${isSessionChosen ? 'flex': 'none'}`}>
               {isSessionChosen ? <Dashboard card={card} account={account} user={UsuarioProp} back={back} /> : 'Loading...'}
            </section>
        </div>
    )
    }