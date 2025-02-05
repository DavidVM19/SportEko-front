import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaChevronRight } from 'react-icons/fa';
import { HiEye } from 'react-icons/hi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

import Logo from '../../../../resources/logo_dark.png';
import CurrentUserContext from '../../../contexts/CurrentUser';
import IUser from '../../../interfaces/IUser';
import IUserLog from '../../../interfaces/IUserLog';

const Connection = () => {
  const { setIdUser } = useContext(CurrentUserContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>();
  const [hiEye, setHiEye] = useState<boolean>(true);
  const [login, setLogin] = useState<IUser>();
  const { setAccepted } = useContext(CurrentUserContext);

  const navigate: NavigateFunction = useNavigate();
  function redirectHome() {
    navigate('/');
  }

  const urlBack = import.meta.env.VITE_URL_BACK;
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userLog = {
      email,
      password,
    } as IUser;
    setLogin(userLog);
  };

  useEffect(() => {
    login &&
      axios
        .post<IUserLog>(`${urlBack}/login`, login, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        })
        .then((response) => response.data)
        .then((data) => {
          setErrorMessage('');
          setIdUser(data.id);
          sessionStorage.setItem('pseudo', data.pseudo);
          sessionStorage.setItem('id', `${data.id}`);
          sessionStorage.setItem('firstname', `${data.firstname}`);
          sessionStorage.setItem('lastname', `${data.lastname}`);
          sessionStorage.setItem('picture', `${data.picture}`);
          setAccepted(true);
          redirectHome();
        })
        .catch((err) => {
          if (err.response.status === 401) {
            setErrorMessage('Email ou mot de passe incorrect');
          } else {
            setErrorMessage(err);
          }
        });
  }, [login]);

  return (
    <main className="connectionPage">
      <img src={Logo} alt="Sporeko logo" />
      <h2>Bienvenue !</h2>
      <p>Connectez-vous pour découvrir toutes nos fonctionnalités</p>
      <form
        className="connectionPage__form"
        action=""
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleLogin(e)}>
        <div className="connectionPage__form__inputsContainer">
          <div>
            <CgProfile className="inputIcon" />
            <input
              type="email"
              value={email}
              placeholder="blabla@email.com"
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setEmail(e.currentTarget.value)
              }
            />
          </div>
          <hr />
          <div>
            <RiLockPasswordLine className="inputIcon" />
            <input
              type={`${hiEye ? 'password' : 'text'}`}
              value={password}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setPassword(e.currentTarget.value)
              }
            />
            <HiEye className="inputIcon right" onClick={() => setHiEye(!hiEye)} />
          </div>
        </div>
        <button type="submit" className="btn connectionPage__form__submit">
          Se connecter <FaChevronRight className="chevronRightIcon" />
        </button>
        {errorMessage && <div>{errorMessage}</div>}
      </form>
      <div className="connectionPage__span">
        <span className="connectionPage__span--bold">Devenir un SporEko ? </span>
        <span>
          <Link to="/create-account" className="connectionPage__span--red">
            Créer un compte
          </Link>
        </span>
      </div>
    </main>
  );
};

export default Connection;
