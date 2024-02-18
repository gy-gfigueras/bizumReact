import '../assets/dashboard.css';
import User from "./User";
import gfiguerasImagen from '../assets/img/gfigueras.jpeg'
import toxycImagen from '../assets/img/toxyc.jpeg'
import javiParla20 from '../assets/img/JaviParla20.png'
import cnovak from '../assets/img/cnovak.jpeg'
import PaymentForm from './PaymentForm';
import { useState, useRef } from 'react';
import { FaMoneyCheck } from "react-icons/fa";


export default function Dashboard({ card, user, account, back }) {
    const [password, setPassword] = useState('');
    const [telefonoReceptor, setTelefonoReceptor] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [isBizumDone, setIsBizumDone] = useState(false);
    const [bizumState, setBizumState] = useState('');

    const [cuenta, setCuenta] = useState(account);

    const passwordRef = useRef();
    const telefonoReceptorRef = useRef();
    const cantidadRef = useRef();

    let URL = `http://localhost:8080/deposit?username=${encodeURIComponent(user.username)}&password=${encodeURIComponent(password)}&telefonoemisor=${encodeURIComponent(cuenta.nTelefono)}&telefonoreceptor=${encodeURIComponent(telefonoReceptor)}&dinero=${encodeURIComponent(cantidad)}`
    let urlgetAccount = `http://localhost:8080/getaccount?username=${encodeURIComponent(user.username)}&password=${encodeURIComponent(password)}&telefono=${encodeURIComponent(cuenta.nTelefono)}`;

    const actualizarCuenta = async () => {
        try {
            if (password == '') {
                alert('Introduce la contraseña')
            } else {
                const dataAccount = await fetch(urlgetAccount);
                const accountTmp = await dataAccount.json();
                setCuenta(accountTmp);
            }
        } catch (error) {
            console.error('Error fetching account data:', error);
        }
    }
    const getImg = (user) => {
        if (user != null) {
            switch (user.username) {
                case 'gfigueras':
                    return gfiguerasImagen;
                case 'toxyc':
                    return toxycImagen;
                case 'JaviParla20':
                    return javiParla20;
                case 'cnovak':
                    return cnovak;
                default:
                    return '';
            
            }
        }
    }

    const returnStyle = () => {
        if (!isBizumDone) {
            return 'textoPlano'
        }
        else if (bizumState === 'Bizum realizado correctamente' && isBizumDone) {
            return 'verde'
        } else if (bizumState != 'Bizum realizado correctamente' && isBizumDone) {
            return 'rojo'
        }
    }

    const hacerBizum = async () => {
        if (telefonoReceptor === cuenta.nTelefono) {
            setBizumState('No puedes enviarte dinero a ti mismo')
        } else if (cantidad > cuenta.dinero) {
            setBizumState('No tienes tanta cantidad de dinero')
        }else if(cantidad <= 0){
            setBizumState('Cantidad no válida')
        }
        else {
            const response = await fetch(URL);
            const data = await response.json();

            setCantidad('')
            setTelefonoReceptor('')
            setPassword('')

            cantidadRef.current.value = '';
            telefonoReceptorRef.current.value = '';
            passwordRef.current.value = '';

            switch (data) {
                case 0:
                    setIsBizumDone(true);
                    setBizumState('Bizum realizado correctamente');
                    const dataAccount = await fetch(urlgetAccount);
                    const account = await dataAccount.json();
                    setCuenta(account);
                    break;
                case -4:
                    setIsBizumDone(true);
                    setBizumState('Login incorrecto');
                    break;
                case -8:
                    setIsBizumDone(true);
                    setBizumState('Telefono receptor incorrecto');
                    break;
                case -9:
                    setIsBizumDone(true);
                    setBizumState('No tienes tanta cantidad de dinero');
                    break;
                default:
                    setIsBizumDone(true);
                    setBizumState('Bizum no realizado');
                    break;
            }

        }

        setCantidad('')
        setTelefonoReceptor('')
        setPassword('')

        cantidadRef.current.value = '';
        telefonoReceptorRef.current.value = '';
        passwordRef.current.value = '';


    }

    return (
        <>
            <div className="leftSection">
                <div className="profileItems">
                    <User imagen={user ? getImg(user) : ''} user={user ? user : ''} />

                    <div className="money">
                        <FaMoneyCheck className='moneyIcon' />
                        <h1>{cuenta ? `${cuenta.dinero}€` : ''}</h1>
                    </div>

                    <div className="accountItem">
                        <ul className="accountUl">
                            <li>{cuenta ? cuenta.nCuenta : ''}</li>
                            <li>{cuenta ? cuenta.nTelefono : ''}</li>
                        </ul>
                    </div>

                    {card ? <PaymentForm card={card} /> : ''}
                    
                    <div onClick={() => actualizarCuenta()} className="actualizarCuenta">
                        <h1>Actualizar cuenta</h1>
                    </div>
                </div>

                <div onClick={back} className="cerrarSesion">
                    <h2>CERRAR SESION</h2>
                </div>
            </div>

            <div className="rightSection">
                <div className="bizum">
                    <h1>Hacer un bizum</h1>
                    <input ref={telefonoReceptorRef} onChange={(e) => setTelefonoReceptor(e.target.value)} type="text" placeholder="Telefono" />
                    <input ref={cantidadRef} onChange={(e) => setCantidad(e.target.value)} type="text" placeholder="Cantidad" />
                    <input ref={passwordRef} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Contraseña" />
                    <button onClick={hacerBizum}>Enviar</button>
                    <h4 className={returnStyle()}>{isBizumDone ? bizumState : ''}</h4>

                </div>
            </div>
        </>
    )
}