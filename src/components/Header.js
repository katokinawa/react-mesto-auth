  import React from 'react';
  import { Link, useLocation } from 'react-router-dom';

  function Header(props) {
    const location = useLocation();

    return (
      <header className="header page__header">
        <div className="logo"></div>
        {location.pathname === "/" && (
          <div className="header__link-wrapper">
            <p className="subtitle header__subtitle">{props.userEmail}</p>
            <Link
              to="/sign-in"
              className="header__link header__link_grey"
              onClick={props.onSignOut}
            >
              Выйти
            </Link>
          </div>
        )}
        {location.pathname === "/sign-up" && (
          <Link to="/sign-in" className="header__link">
            Войти
          </Link>
        )}
        {location.pathname === "/sign-in" && (
          <Link to="/sign-up" className="header__link">
            Регистрация
          </Link>
        )}
      </header>
    );
  }

  export default Header;
