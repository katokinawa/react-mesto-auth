// Импорт иконки галочки и крестика
import yes from '../images/yes.svg';
import no from '../images/no.svg';

function InfoTooltip(props) {
  return (
    <section className={`popup ${props.isOpen ? 'popup_opened' : ''}`}>
      <div className={`popup__container popup__infotooltip`}>
        <img className='popup__infotooltip-img' src={props.isRegistered ? yes : no} alt={props.isRegistered ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте еще раз.'} />
        <p className='popup__infotooltip-subtitle'>
          {props.isRegistered ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте еще раз.'}
        </p>
        <button type='button' className='popup__close-button' onClick={props.onClose}></button>
      </div>
    </section>
  );
}

export default InfoTooltip;