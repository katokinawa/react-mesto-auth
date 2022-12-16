function InfoTooltip(props) {
  return (
    <div className={`popup ${props.isOpen ? 'popup_opened' : ''}`}>
      <div className='popup__content popup__tooltip'>
        <button className='popup__close-button' type='button' aria-label='Закрыть' onClick={props.onClose} ></button>
        <img src={props.isRegistered ? '../images/yes.svg' : '../images/no.svg'} alt={props.isRegistered ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте еще раз.'} className='popup__tooltip_image'/>
        <p className='popup__tooltip_info'>
          {props.isRegistered ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте еще раз.'}
        </p>
      </div>
    </div>
  );
}

export default InfoTooltip;
