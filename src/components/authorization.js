export const BASE_URL = 'https://auth.nomoreparties.co'

export const register = ({email, password}) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email, password: password}),
  })
    .then((response) => { // Код ответа от сервера
      try {
        if (response.status === 200) {
          return response.json();
        }
      } catch (e) {
        return (e)
      }
    })
    .then((data) => { // Даннные пользователя
      return data;
    })
    .catch((err) => console.log(err));
}

export const login = ({email, password}) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email, password: password}),
  })
    .then(res => res.json())
    .then((data) => {
      // сохраняем токен
      localStorage.setItem('token', data.token);
    });
}

export const getContent = () => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  })
    .then(res => res.json())
    .then(data => data)
}