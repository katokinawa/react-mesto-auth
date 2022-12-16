import React from 'react';
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';
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
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
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
  const [isRegistered, setIsRegistered] = useState(false);
  const [isInfoTooltipOpen, setIsInfoToolTipOpen] = useState(false);
  const [email, setEmail] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (loggedIn) {
      ApiConfig.getInitialCards().then(data => {
        setCards(data)
      })
        .catch(err => console.error(err));

      ApiConfig.getUserInfo().then(data => {
        setCurrentUser(data)
      })
        .catch(err => console.error(err));
    }
  }, [loggedIn])

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      auth.tokenCheck(token)
        .then((res) => {
          setEmail(res.data.email);
          setLoggedIn(true);
          history.push('/');
        })
        .catch((err) => {
          if (err.status === 400) {
            console.log('400 — Токен не передан или передан не в том формате');
          } else if (err.status === 401) {
            console.log('401 — Переданный токен некорректен');
          }
        });
    }
  }, [history]);

  function handleRegister(data) {
    auth.register(data)
      .then(() => {
        setIsRegistered(true);
        setIsInfoToolTipOpen(true);
        history.push('/sign-in');
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log('400 - некорректно заполнено одно из полей');
        }
        setIsRegistered(false);
        setIsInfoToolTipOpen(true);
      });
  }

  function handleLogin(data) {
    auth.login(data)
      .then((res) => {
        if (res.token) {
          setLoggedIn(true);
          setEmail(data.email);
          localStorage.setItem('jwt', res.token);
          history.push('/');
        }
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log('400 - не передано одно из полей');
        } else if (err.status === 401) {
          console.log('401 - пользователь с email не найден');
        }
        console.error(err);
        setIsRegistered(false);
        setIsInfoToolTipOpen(true);
      });
  }

  function handleRegister(data) {
    auth.register(data).then(() => {
      setIsRegistered(true);
      setIsInfoToolTipOpen(true);
      history.push('/sign-in');
    })
      .catch((err) => {
        if (err.status === 400) {
          console.log('400 - некорректно заполнено одно из полей');
        }
        setIsRegistered(false);
        setIsInfoToolTipOpen(true);
      });
  }

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

  function handleUpdateUser({ name, about }) {
    ApiConfig.setUserInfo(name, about).then((updateUser) => {
      setCurrentUser(updateUser)
      closeAllPopups();
    })
      .catch(err => console.error(err));
  }

  function handleUpdateAvatar({ avatar }) {
    ApiConfig.setUserAvatar(avatar).then((updateAvatar) => {
      setCurrentUser(updateAvatar);
      closeAllPopups();
    })
      .catch(err => console.error(err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='body'>
        <div className='page'>
          <Header />
          <Switch>
            <Route path='/sign-in'>
              <Login
                handleLogin={handleLogin}
              />
            </Route>
            <Route path='/sign-up'>
              <Register
                handleRegister={handleRegister}
              />
            </Route>
            <Route exact path='/'>
              {loggedIn ? <Redirect to='/' /> : <Redirect to='/sign-in' />}
            </Route>
            <ProtectedRoute exact
              path='/'
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
            name='confirm-popup'
            title='Вы уверены?'
            button='Да'
            isOpen={false}
            onClose={closeAllPopups}
            classNameButton='popup__confirm-button'
            classNameTitle='popup__title_confirm-form'
            classNameContainer='popup__container_min-height-confirm'
            classNameForm='submit-profile-form-handler-confirm'>
          </PopupWithForm>

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
          />
          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onClose={closeAllPopups}
            isRegisteredistered={isRegistered}
          />
          <Footer />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
