import Cards from 'react-credit-cards-2';
import '../assets/dashboard.css'
import 'react-credit-cards-2/dist/es/styles-compiled.css';

const PaymentForm = ({card}) => {
  return (
    <div>
      <Cards className="card"
        number={card ? card.nTarjeta : ''}
        expiry={card ? card.caducidad : ''}
        cvc={card ? card.cvv : ''}
        name={card ? card.titular : ''}
      />
    </div>
  );
}

export default PaymentForm;