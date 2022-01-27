import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { AiFillHeart } from 'react-icons/ai';
import { Link } from 'react-router-dom';

import CurrentUserContext from '../../../contexts/CurrentUser';
import IFavorite from '../../../interfaces/IFavorite';
import IOffer from '../../../interfaces/IOffer';
import Search from '../search/Search';

const AllOffers = () => {
  const [allOffers, setAllOffers] = useState<IOffer[]>([]);
  const [userFavorites, setUserFavorites] = useState<IFavorite[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { idUser } = useContext(CurrentUserContext);

  // Add offer to favorite /

  const addFavorite = (idOffer: number) => {
    axios
      .post(`${urlBack}/users/${idUser}/favorites`, {
        id_user: Number(idUser),
        id_offer: idOffer,
      })
      .then(() => setIsFavorite(true));
  };

  // Delete a favorite by id//
  const deleteFavorite = (idOffer: number) => {
    const idFavorite: number =
      userFavorites?.find((fav) => fav.id_offer === idOffer)?.id_favorite || 0;
    idUser &&
      axios
        .delete(`${urlBack}/users/${idUser}/favorites/${idFavorite}`)
        .then(() => setIsFavorite(true));
  };

  // useEffect offers, users //
  const urlBack = import.meta.env.VITE_URL_BACK;

  useEffect(() => {
    axios.get(`${urlBack}/offers`).then((res) => setAllOffers(res.data));
    idUser &&
      axios
        .get(`${urlBack}/users/${idUser}/favorites`)
        .then((res) => setUserFavorites(res.data))
        .then(() => setIsFavorite(false));
  }, [isFavorite]);

  console.log(userFavorites);
  console.log(isFavorite);

  return (
    <div>
      <Search setAllOffers={setAllOffers} />
      <div className="allOffers">
        {allOffers.map((offer: IOffer, index: number) => {
          return (
            <div className="allOffers__offer" key={index}>
              <ul className="allOffers__offer__detail">
                <li className="allOffers__offer__detail__mainPicture">
                  <Link
                    to={`/annonces/${offer.id_offer}`}
                    className="allOffers__offer__detail__linkOfferDetails">
                    <img src={offer.picture1} alt={`profile`} />
                  </Link>
                </li>
                <li className="allOffers__offer__detail__price">
                  <strong>{offer.price} €</strong>
                </li>
                {idUser && (
                  <li className="allOffers__offer__detail__fav">
                    {userFavorites.find((fav) => fav.id_offer === offer.id_offer) ? (
                      <AiFillHeart
                        className="inputIconFull"
                        onClick={() => deleteFavorite(Number(offer.id_offer))}
                        size={30}
                        color="red"
                      />
                    ) : (
                      <AiOutlineHeart
                        className="inputIconEmpty"
                        onClick={() => addFavorite(Number(offer.id_offer))}
                        size={30}
                      />
                    )}
                  </li>
                )}
                <li className="allOffers__offer__detail__brand">Nike{offer.id_brand}</li>
                <li className="allOffers__offer__detail__size">M/S{offer.id_size}</li>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllOffers;
