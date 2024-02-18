import '../assets/selectAccount.css';
import { useEffect, useState } from 'react';
export default function Account({ accountNumber, nTelefono, account, seleccionarCuenta, propFlex, selectedAccount, createAccount }) {
    const [flex, setFlex] = useState(true);

    useEffect(() => {
        setFlex(propFlex)
    }, [propFlex])

    return (
        <ul
            id={selectedAccount && selectedAccount.nCuenta !== null && selectedAccount.nCuenta === accountNumber ? 'selected' : ''}
            className={`accountBox ${flex && !createAccount ? 'flex' : 'none'}`}
            onClick={() => seleccionarCuenta(account)}
        >
            <li>{`Cuenta: ${accountNumber}`}</li>
            <li>{`Telefono: ${nTelefono}`}</li>
        </ul>
    );
}
