
function Register() {

  return (
  <div className="authorization">
      <h2 className="title authorization__title">Регистрация</h2>
      <form className="authorization__form" noValidate>
          <label>
              <input name="email" className="email authorization__input email-input" placeholder="Email" required />
          </label>
          <label>
              <input name="password" className="password authorization__input password-input" placeholder="Пароль" required />
          </label>
          <button type="submit" className="authorization__button">Зарегистрироваться</button>
      </form>   
  </div>
  );
}

export default Register;
