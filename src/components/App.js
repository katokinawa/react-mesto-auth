import React from "react";
import { Route, Switch, useHistory, Redirect } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Header from "./Header";
import Main from "./Main";
import ImagePopup from "./ImagePopup";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import * as auth from "../utils/authorization";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { api } from "../utils/api";
import { useEffect, useState } from "react";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setIsSelectedCard] = useState(null);
  const [cards, setIsCards] = useState([]);
  const [currentUser, setIsCurrentUser] = useState({});
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [isSuccessTooltipStatus, setIsSuccessTooltipStatus] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [email, setIsEmail] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getInitialCards(), api.getUserInfo()])
        .then(([cards, userData]) => {
          setIsCards(cards);
          setIsCurrentUser(userData);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setIsEmail(res.data.email);
          setIsLoggedIn(true);
          history.push("/");
        })
        .catch((err) => {
          if (err.status === 400) {
            console.log("400 — Токен не передан или передан не в том формате");
          }
          if (err.status === 401) {
            console.log("401 — Переданный токен некорректен");
          }
        });
    }
  }, [history]);

  function handleRegister(data) {
    auth
      .register(data)
      .then(() => {
        setIsSuccessTooltipStatus(true);
        setIsInfoTooltipOpen(true);
        history.push("/sign-in");
      })
      .catch(() => {
        setIsSuccessTooltipStatus(false);
        setIsInfoTooltipOpen(true);
      });
  }

  function handleLogin(data) {
    auth
      .login(data)
      .then((res) => {
        if (res.token) {
          setIsLoggedIn(true);
          setIsEmail(data.email);
          localStorage.setItem("jwt", res.token);
          history.push("/");
        }
      })
      .catch(() => {
        setIsSuccessTooltipStatus(false);
        setIsInfoTooltipOpen(true);
      });
  }

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    history.push("/sign-in");
  }

  function handleAddPlaceSubmit(name, link) {
    api
      .generateCard(name, link)
      .then((newCard) => {
        setIsCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setIsCards((state) =>
          state.map((cardForLike) =>
            cardForLike._id === card._id ? newCard : cardForLike
          )
        );
      })
      .catch((err) => console.error(err));
  }

  function handleCardDelete(cardForDelete) {
    api
      .deleteCard(cardForDelete._id)
      .then(() => {
        setIsCards((state) =>
          state.filter((arrayWithCard) => {
            return arrayWithCard._id !== cardForDelete._id;
          })
        );
      })
      .catch((err) => console.error(err));
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsSelectedCard(null);
    setIsInfoTooltipOpen(false);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setIsSelectedCard(card);
  }

  function handleUpdateUser({ name, about }) {
    api
      .setUserInfo(name, about)
      .then((updateUser) => {
        setIsCurrentUser(updateUser);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .setUserAvatar(avatar)
      .then((updateAvatar) => {
        setIsCurrentUser(updateAvatar);
        closeAllPopups();
      })
      .catch((err) => console.error(err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header userEmail={email} onSignOut={handleLogout} />
          <Switch>
            <ProtectedRoute
              exact
              path="/"
              loggedIn={loggedIn}
              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              loggedOut={handleLogout}
            />
            <Route path="/sign-in">
              <Login onLogin={handleLogin} />
            </Route>
            <Route path="/sign-up">
              <Register onRegister={handleRegister} />
            </Route>
            <Route exact path="/">
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
            </Route>
          </Switch>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <PopupWithForm
            name="confirm-popup"
            title="Вы уверены?"
            button="Да"
            isOpen={false}
            onClose={closeAllPopups}
            classNameButton="popup__confirm-button"
            classNameTitle="popup__title_confirm-form"
            classNameContainer="popup__container_min-height-confirm"
            classNameForm="submit-profile-form-handler-confirm"
          ></PopupWithForm>

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />

          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            isSuccess={isSuccessTooltipStatus}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
