import { useState } from "react";

function Login(props) {
  const [email, setIsEmail] = useState("");
  const [password, setIsPassword] = useState("");

  const handlesetIsEmail = (e) => {
    setIsEmail(e.target.value);
  };
  const handlesetIsPassword = (e) => {
    setIsPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    props.onLogin({
      password: password,
      email: email,
    });
  };

  return (
    <div className="authorization">
      <h2 className="title authorization__title">Вход</h2>
      <form onSubmit={handleSubmit} className="authorization__form" noValidate>
        <label htmlFor="email"></label>
        <input
          id="email"
          value={email}
          onChange={handlesetIsEmail}
          type="text"
          name="email"
          className="email authorization__input email-input"
          placeholder="Email"
          required
        />
        <label htmlFor="password"></label>
        <input
          id="password"
          value={password}
          onChange={handlesetIsPassword}
          type="password"
          name="password"
          className="password authorization__input password-input"
          placeholder="Пароль"
          required
        />
        <button type="submit" name="login" className="authorization__button">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
