import { Link } from 'react-router-dom';
import { useState } from 'react';

function Register(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSetEmail(e) {
    setEmail(e.target.value)
  }

  function handleSetPassword(e) {
    setPassword(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.handleRegister({email, password});
  }
  return (
  <div className='authorization'>
      <h2 className='title authorization__title'>Регистрация</h2>
      <form onSubmit={handleSubmit} className='authorization__form' noValidate>
          <label>
              <input value={email} onChange={handleSetEmail} name='email' className='email authorization__input email-input' placeholder='Email' required />
          </label>
          <label>
              <input value={password} onChange={handleSetPassword} name='password' className='password authorization__input password-input' placeholder='Пароль' required />
          </label>
          <button name='register' type='submit' className='authorization__button'>Зарегистрироваться</button>
      </form>
        <Link to='/sign-in' className='authorization__link'>
          Уже зарегистрированы? Войти
        </Link>
  </div>
  );
}

export default Register;
