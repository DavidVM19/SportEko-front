import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { Link } from 'react-router-dom';

import CurrentUserContext from '../../../contexts/CurrentUser';
import IBrand from '../../../interfaces/IBrand';
import IFavorite from '../../../interfaces/IFavorite';
import IOffer from '../../../interfaces/IOffer';

const Favorites = () => {
  const [favOffers, setFavOffers] = useState<IOffer[]>([]);
  const [userFavorites, setUserFavorites] = useState<IFavorite[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const { idUser } = useContext(CurrentUserContext);
  const urlBack = import.meta.env.VITE_URL_BACK;

  useEffect(() => {
    axios.get<IBrand[]>(`${urlBack}/brands`).then((res) => setBrands(res.data));
  }, []);

  // Delete a favorite by id//
  const deleteFavorite = (idOfferFav: number) => {
    const idFavorite: number =
      userFavorites?.find((fav) => fav.id_offer === idOfferFav)?.id_favorite || 0;
    idUser &&
      axios
        .delete<IFavorite>(`${urlBack}/users/${idUser}/favorites/${idFavorite}`)
        .then(() => setIsFavorite(true));
  };

  // Get Favorites by user, get offers favorite

  useEffect(() => {
    idUser &&
      axios.get<IFavorite[]>(`${urlBack}/users/${idUser}/favorites`).then((res) => {
        setUserFavorites(res.data);

        const allOffers: IOffer[] = [];
        res.data.map((fav) =>
          axios.get<IOffer>(`${urlBack}/offers/${fav.id_offer}`).then((res) => {
            allOffers.push(res.data);

            setFavOffers(allOffers.map<IOffer>((offer) => offer));
            setIsFavorite(false);
          }),
        );
      });
  }, [isFavorite]);

  return (
    <div className="favorites">
      {userFavorites.length > 0 ? (
        favOffers.map((offer: IOffer, index: number) => {
          return (
            <div className="favorites__offers" key={index}>
              {userFavorites?.length &&
                userFavorites?.find((fav) => fav.id_offer === offer.id_offer) && (
                  <ul className="favorites__offers__detail">
                    <li className="favorites__offers__detail__mainPicture">
                      <Link
                        to={`/offer/${offer.id_offer}`}
                        className="favorites__offers__detail__linkOfferDetails">
                        <img src={offer.picture1} alt={`profile`} />
                      </Link>
                    </li>
                    <li className="favorites__offers__detail__price">
                      <strong>{offer.price} €</strong>
                    </li>
                    {idUser && (
                      <li className="favorites__offers__detail__fav">
                        {userFavorites.find((fav) => fav.id_offer === offer.id_offer) && (
                          <AiFillHeart
                            className="inputIconFull"
                            onClick={() => deleteFavorite(Number(offer.id_offer))}
                            size={30}
                            color="red"
                          />
                        )}
                      </li>
                    )}
                    <li className="favorites__offers__detail__brand">
                      {brands.find((brand) => brand.id_brand === offer.id_brand)?.name}
                    </li>
                    <li className="favorites__offers__detail__size">{offer.size}</li>
                  </ul>
                )}
            </div>
          );
        })
      ) : (
        <div className="favorites__empty">
          <h2>Vous n&apos;avez aucun favori</h2>
          <Link to="/offers">
            <button type="button" className="btn">
              Consultez les offres et trouvez votre bonheur !
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
