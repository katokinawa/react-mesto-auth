import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import * as auth from './authorization';
import ProtectedRoute from "./ProtectedRoute";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { ApiConfig } from '../utils/api';
import { useEffect, useState } from 'react';


function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState(CurrentUserContext);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    ApiConfig.getInitialCards().then(data => {
      setCards(data)
    })
    .catch(err => console.error(err));

    ApiConfig.getUserInfo().then(data => {
      setCurrentUser(data)
    })
    .catch(err => console.error(err));
}, [])

  function handleAddPlaceSubmit(name, link) {
    ApiConfig.generateCard(name, link)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
    })
    .catch(err => console.error(err));
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    // Отправляем запрос в API и получаем обновлённые данные карточки
    ApiConfig.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
        setCards((state) => state.map((cardForLike) => cardForLike._id === card._id ? newCard : cardForLike));
    })
    .catch(err => console.error(err));
  }
  
  function handleCardDelete(cardForDelete) {
    ApiConfig.deleteCard(cardForDelete._id).then(() => {
      setCards((state) => state.filter((arrayWithCard) => {
        return arrayWithCard._id !== cardForDelete._id;
      }));
    })
    .catch(err => console.error(err));
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false)
    setAddPlacePopupOpen(false)
    setEditAvatarPopupOpen(false)
    setSelectedCard(null)
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true)
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true)
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser({name, about}) {
    ApiConfig.setUserInfo(name, about).then((updateUser) => {
      setCurrentUser(updateUser)
      closeAllPopups();
    })
    .catch(err => console.error(err));
  }
  
  function handleUpdateAvatar({avatar}) {
    ApiConfig.setUserAvatar(avatar).then((updateAvatar) => {
      setCurrentUser(updateAvatar);
      closeAllPopups();
    })
    .catch(err => console.error(err));
  }
  function handleLogin() {
    setLoggedIn(true)
  }
  
  return ( 
  <CurrentUserContext.Provider value={currentUser}>
    <div className="body">
      <div className="page">
        <Header />
        <Switch>
          <Route path="/sign-in">
              <Login
              authLogin={auth}
              handleLogin={handleLogin}
              />
          </Route>
          <Route path="/sign-up">
              <Register
              authRegister={auth}
              />
            </Route>
            <ProtectedRoute
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
            />
            <ProtectedRoute
            path="/"
            loggedIn={loggedIn}
            component={Footer}
            />
            <ProtectedRoute
              path="/"
              loggedIn={loggedIn}
              component={EditProfilePopup}
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />

            <ProtectedRoute
              path="/"
              loggedIn={loggedIn}
              component={EditAvatarPopup}
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />

            <ProtectedRoute
              path="/"
              loggedIn={loggedIn}
              component={PopupWithForm}
              name="confirm-popup"
              title="Вы уверены?"
              button="Да"
              isOpen={false}
              onClose={closeAllPopups}
              classNameButton="popup__confirm-button"
              classNameTitle="popup__title_confirm-form"
              classNameContainer="popup__container_min-height-confirm"
              classNameForm="submit-profile-form-handler-confirm"
            />

            <ProtectedRoute
              path="/"
              loggedIn={loggedIn}
              component={AddPlacePopup}
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
            />
            <ProtectedRoute
              path="/"
              loggedIn={loggedIn}
              component={ImagePopup}
              card={selectedCard}
              onClose={closeAllPopups}
            />
        </Switch>
      </div>
    </div>
  </CurrentUserContext.Provider>
  );
}

export default App;
