import '../assets/login.css'
import '../assets/base.css';

import { useState, useRef} from 'react'
import logo from '../assets/img/logo.png'

export default function Login({actualizarLogin, loginState, setSessionProps, setAccountsProps}) {

  const [isInLogin , setIsInLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  
  // CAMBIAR A USESTATE

  
  const fetchLogin = async () => {
    const url = `http://localhost:8080/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    const urlSesion = `http://localhost:8080/getusersession?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    const urlAccounts = `http://localhost:8080/getaccounts?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    try {
      const response = await fetch(url);
      const data = await response.json();

      switch (data) {
        case true:

          actualizarLogin(true);

          const responseSession = await fetch(urlSesion);
          const dataSession = await responseSession.json();

          const responseAccounts = await fetch(urlAccounts);
          const dataAccounts = await responseAccounts.json();

          await setSessionProps(dataSession);
          await setAccountsProps(dataAccounts);
          break;
        case false:
          alert("Usuario incorrecto")
          break;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const fetchSignUp = async () => {
    const url = `http://localhost:8080/signup?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      switch (data) {
        case 0:
          alert("Usuario Creado Correctamente")
          break;
        case -4:
          alert("ERROR EN BASE DE DATOS")
          break;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function fetchData(){
    if(isInLogin){
      await fetchLogin();
      clearInputs();

    } 
    else{
      await fetchSignUp(); 
      clearInputs();
    }
  }

  const clearInputs = () => {
    usernameRef.current.value = '';
    emailRef.current.value = '';
    passwordRef.current.value = '';
    
    setUsername('');
    setEmail('');
    setPassword('');
  }
  
  return (
    <>
      <div className={`form ${loginState ? 'none' : 'flex'}`}>
        <img className='logo' src={logo} alt="" />
        <h3>{isInLogin? 'Login' : 'SignUp'}</h3>

          <input
           onChange={(e) => setUsername(e.target.value)} 
           placeholder='Username' 
           className='username' 
           ref={usernameRef}
           type="text" 
           name="username" 
           id="username" />

          <input 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder='Email' 
          ref={emailRef}
          className={`email ${isInLogin ? 'none' : 'flex'}`}
          type="email" 
          name="email" 
          id="email" />
          
          <input 
           onChange={(e) => setPassword(e.target.value)} 
           placeholder='Password' 
           className='password' 
           ref={passwordRef}
           type="password" 
           name="password" 
           id="password" />

          <button onClick={fetchData}>{isInLogin ? 'Login' : 'Sign Up'}</button>
          {/* <a href="">Forgot Password?</a>  //?NO IMPLEMENTADO */} 
          <p onClick={()=> setIsInLogin(!isInLogin)} className='signUpText' href="">{isInLogin ? 'SignUp' : 'Login'}</p>
      </div>
    </>
  )
}



