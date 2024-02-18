import Account from "./Account";
import '../assets/selectAccount.css';
import { useState, useRef } from "react";

export default function SelectAccount({ User, Accounts, setSessionChosen, Back, setAccount, setCard }) {
  if (!Accounts || !Array.isArray(Accounts)) {
    return <div className="loading">Is Loading...</div>;
  }

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accept, setAccept] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordCreateAccount, setPasswordCreateAccount] = useState('');
  const [telefono, setTelefono] = useState('');
  const [clicked, setClicked] = useState(false);
  const [createAccountClicked, setCreateAccountClicked] = useState(false);
  const [stateCreateAccount, setStateCreateAccount] = useState('');
  const [accountfetched, setAccountsfetched] = useState(Array.isArray(Accounts) ? Accounts : []);

  const passwordRef = useRef();

  const fetchLogin = async (username, pass) => {
    let url = `http://localhost:8080/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(pass)}`;
    let urlgetAccount = `http://localhost:8080/getaccount?username=${encodeURIComponent(username)}&password=${encodeURIComponent(pass)}&telefono=${encodeURIComponent(selectedAccount.nTelefono)}`;
    let querCard = `http://localhost:8080/getcreditcard?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&telefono=${encodeURIComponent(selectedAccount.nTelefono)}`

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data === true) {
        setClicked(true);
        const responseAccount = await fetch(urlgetAccount);
        const dataAccount = await responseAccount.json();

        const responseCard = await fetch(querCard);

        try {
          const dataCard = await responseCard.json();
          setSessionChosen(true);
          setAccount(dataAccount);
          setCard(dataCard);
        } catch (error) {
          setCard(null);
          setSessionChosen(true);
          setAccount(dataAccount);
        }
      } else {
        alert("Contraseña incorrecta");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const returnAccount = () => {
    if (selectedAccount && User && password === '') {
      setAccept(true);
    } else if (password !== '' && accept) {
      fetchLogin(User.username, password);

      setSelectedAccount(null);
      setPassword('');
      setAccept(false);
    }
  };

  const backControl = () => {
    if (selectedAccount) { // ENTRA SI TENEMOS CUENTA SELECCIONADA OSEA SI ESTAMOS EN EL MOMENTO DE PONER CONTRASEÑA
      setSelectedAccount(null);
      setAccept(false);
      setPassword('');
    } else if (!selectedAccount) {
      setPassword('');
      Back();
    }
    if (passwordRef.current) {
      passwordRef.current.value = '';
    }
  };
  const createAccount = async () => {
    if (createAccountClicked && telefono !== '' && passwordCreateAccount !== '') {
      let asignarTelefono = `http://localhost:8080/assignphonenumber?username=${encodeURIComponent(User.username)}&password=${encodeURIComponent(passwordCreateAccount)}&telefono=${encodeURIComponent(telefono)}`;
      let crearCuenta = `http://localhost:8080/createaccount?username=${encodeURIComponent(User.username)}&password=${encodeURIComponent(passwordCreateAccount)}&telefono=${encodeURIComponent(telefono)}`;
      let getAccounts = `http://localhost:8080/getaccounts?username=${encodeURIComponent(User.username)}&password=${encodeURIComponent(passwordCreateAccount)}`
      
      console.log(asignarTelefono)
      console.log(crearCuenta)
      const response = await fetch(asignarTelefono);
      const responseAccount = await fetch(crearCuenta);
      const data = await responseAccount.text();
      if (data == 0) {
        setStateCreateAccount("Cuenta creada correctamente");
        setCreateAccountClicked(false);
        const responseAccounts = await fetch(getAccounts);
        const dataAccounts = await responseAccounts.json();
        setAccountsfetched(dataAccounts.Cuentas);
        alert(setPasswordCreateAccount)
      } else {
        setStateCreateAccount("Error al crear la cuenta");
      }
    }
    setCreateAccountClicked(!createAccountClicked);

  }

  return (
    <>
      <div id={accept ? 'selectioned' : ''} className={`${clicked ? 'selectAccount none' : 'selectAccount flex'}`}>

        {accountfetched.map((account, index) => (
          <Account
            propFlex={accept ? false : true}
            seleccionarCuenta={setSelectedAccount}
            account={account}
            createAccount={createAccountClicked}
            selectedAccount={selectedAccount ? selectedAccount : null}
            key={index}
            accountNumber={account.nCuenta}
            nTelefono={account.nTelefono}
          />
        ))}
        {accept && (
          <div className={`introducePassword flex`}>
            <input
              ref={passwordRef}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Introduce tu contraseña"
            />
          </div>
        )}
        <div className={`${createAccountClicked ? 'none botones' : 'flex botones'}`}>
          <button className={'buttonSelectAccount'} onClick={returnAccount}>
            {selectedAccount ? selectedAccount.nTelefono : 'ESCOGER CUENTA'}
          </button>
          <button className="buttonCancel" onClick={backControl}>
            {selectedAccount ? 'Cancelar' : 'Salir'}
          </button>
        </div>

        <div className={`${createAccountClicked ? 'createAccount flex' : 'createAccount none'}`}>
          <input onChange={(e) => setTelefono(e.target.value)} type="text" placeholder="Telefono" />
          <input onChange={(e) => setPasswordCreateAccount(e.target.value)} type="password" placeholder="Contraseña" />
          <h3 className={stateCreateAccount == 'Cuenta creada correctamente' ? 'green' : 'red'}>{stateCreateAccount}</h3>

        </div>
        <button onClick={createAccount} className={selectedAccount ? 'none' : 'createAccountButton'}>Create Account</button>

      </div>

      <div className={`${clicked ? 'loading flex' : 'loading none'}`}>Is Loading...</div>
    </>
  );
}
