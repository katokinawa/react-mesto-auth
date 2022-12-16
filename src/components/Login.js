import { useState } from 'react';

function Login(props) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSetEmail(evt) {
    setEmail(evt.target.value);
  }
  function handleSetPassword(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    if (!email || !password) {
      return;
    }
    props.handleLogin({
      password: password,
      email: email,
    });
    setEmail('');
    setPassword('');
  }

  return (
    <div className='authorization'>
      <h2 className='title authorization__title'>Вход</h2>
      <form onSubmit={handleSubmit} className='authorization__form' noValidate>
        <label>
          <input value={email} onChange={handleSetEmail} name='email' className='email authorization__input email-input' placeholder='Email' required />
        </label>
        <label>
          <input value={password} onChange={handleSetPassword} name='password' className='password authorization__input password-input' placeholder='Пароль' required />
        </label>
        <button type='submit' name='login' className='authorization__button'>Войти</button>
      </form>
    </div>
  );
}

export default Login;
