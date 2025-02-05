import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import { AiFillHeart } from 'react-icons/ai';
import { Link } from 'react-router-dom';

import CurrentUserContext from '../../../contexts/CurrentUser';
import IBrand from '../../../interfaces/IBrand';
import ICategory from '../../../interfaces/ICategory';
import IColor from '../../../interfaces/IColor';
import ICondition from '../../../interfaces/ICondition';
import IFavorite from '../../../interfaces/IFavorite';
import IItem from '../../../interfaces/IItem';
import IOffer from '../../../interfaces/IOffer';
import ISize from '../../../interfaces/ISize';
import ISport from '../../../interfaces/ISport';
import ITextile from '../../../interfaces/ITextile';
import FilterMenu from '../search/FilterMenu';
import Search from '../search/Search';
import SearchBar from '../search/SearchBar';

const AllOffers = () => {
  const { idUser } = useContext(CurrentUserContext);

  const [sports, setSports] = useState<ISport[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [items, setItems] = useState<IItem[]>([]);
  const [conditions, setConditions] = useState<ICondition[]>([]);
  const [textiles, setTextiles] = useState<ITextile[]>([]);
  const [colors, setColors] = useState<IColor[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [sizes, setSizes] = useState<ISize[]>([]);
  const [allOffers, setAllOffers] = useState<IOffer[]>([]);
  const [userFavorites, setUserFavorites] = useState<IFavorite[]>([]);

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [searchByTitle, setSearchByTitle] = useState<string>('');
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [hideFilters, setHideFilters] = useState<boolean>(false);

  const [sport, setSport] = useState<string>('');
  const [gender, setGender] = useState<number>(0);
  const [genderAdult, setGenderAdult] = useState<number>(0);
  const [genderChild, setGenderChild] = useState<number>(0);
  const [genderIsChild, setGenderIsChild] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('');
  const [item, setItem] = useState<string>('');
  const [itemInfos, setItemInfos] = useState<IItem>();
  const [categoryIsClothes, setCategoryIsClothes] = useState<boolean>(false);
  const [condition, setCondition] = useState<string>('');
  const [textile, setTextile] = useState<string>('');
  const [showColors, setShowColors] = useState<boolean>(false);
  const [color1, setColor1] = useState<number>(0);
  const [colorName, setColorName] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [showSizes, setShowSizes] = useState<boolean>(false);
  const [size, setSize] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<string>('');

  useEffect(() => {
    axios.get<ISport[]>(`${urlBack}/sports`).then((res) => setSports(res.data));
    axios
      .get<ICategory[]>(`${urlBack}/categories`)
      .then((res) => setCategories(res.data));
    axios
      .get<ICondition[]>(`${urlBack}/conditions`)
      .then((res) => setConditions(res.data));
    axios.get<ITextile[]>(`${urlBack}/textiles`).then((res) => setTextiles(res.data));
    axios.get<IColor[]>(`${urlBack}/colors`).then((res) => setColors(res.data));
    axios.get<IBrand[]>(`${urlBack}/brands`).then((res) => setBrands(res.data));
    axios.get<ISize[]>(`${urlBack}/sizes`).then((res) => setSizes(res.data));
  }, []);

  // if a category is chosen, itemList is 'filtered' by category
  //else itemList contains all items
  useEffect(() => {
    category
      ? axios.get<IItem[]>(`${urlBack}/categories/${category}/items`).then((res) => {
          setItems(res.data);
        })
      : axios.get<IItem[]>(`${urlBack}/items`).then((res) => setItems(res.data));
  }, [category]);

  //if category is clothes or shoes, or if item is a shoe or a clothes, sizeList is shown with appropriate sizes
  useEffect(() => {
    let filters = ``;
    let oneValue = false;

    if (gender) {
      filters += `?id_gender=${gender}`;
      oneValue = true;
    }
    if (genderIsChild) {
      filters += oneValue ? `&is_child=1` : `?is_child=1`;
      oneValue = true;
    }
    item
      ? axios.get<ISize[]>(`${urlBack}/items/${item}/sizes${filters}`).then((res) => {
          setSizes(res.data);
        })
      : category
      ? axios
          .get<ISize[]>(`${urlBack}/categories/${category}/sizes${filters}`)
          .then((res) => {
            setSizes(res.data);
          })
      : (setSizes([]), setShowSizes(false));
  }, [item, gender, genderIsChild, category]);

  const handleItemSelected = (id: string) => {
    axios
      .get<IItem>(`${urlBack}/items/${id}`)
      .then((item) => {
        setItemInfos(item.data);
        return item.data;
      })
      .then((item) =>
        item.id_size_type === 1 ||
        item.id_size_type === 2 ||
        item.id_size_type === 3 ||
        item.id_size_type === 6
          ? setShowSizes(true)
          : setShowSizes(false),
      );
  };

  const handleReset = () => {
    setSport('');
    setGender(0);
    setGenderAdult(0);
    setGenderChild(0);
    setGenderIsChild(false);
    setCategory('');
    setItem('');
    setCategoryIsClothes(false);
    setCondition('');
    setTextile('');
    setShowColors(false);
    setColor1(0);
    setColorName('');
    setBrand('');
    setSize('');
    setPrice(0);
    setOrderBy('');
  };

  // Add offer to favorite /

  const addFavorite = (idOffer: number) => {
    axios
      .post<IFavorite>(`${urlBack}/users/${idUser}/favorites`, {
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

  // useEffect offers, favorites by ID //
  const urlBack = import.meta.env.VITE_URL_BACK;

  useEffect(() => {
    axios.get<IOffer[]>(`${urlBack}/offers`).then((res) => setAllOffers(res.data));
    idUser &&
      axios
        .get<IFavorite[]>(`${urlBack}/users/${idUser}/favorites`)
        .then((res) => setUserFavorites(res.data))
        .then(() => setIsFavorite(false));
  }, [isFavorite]);

  const handleSubmit = () => {
    let filters = ``;
    let oneValue = false;

    if (sport) {
      filters += `?id_sport=${sport}`;
      oneValue = true;
    }
    if (gender) {
      filters += oneValue ? `&id_gender=${gender}` : `?id_gender=${gender}`;
      oneValue = true;
    }
    if (genderIsChild) {
      filters += oneValue ? `&is_child=${1}` : `?is_child=${1}`;
      oneValue = true;
    }
    if (category) {
      filters += oneValue ? `&id_category=${category}` : `?id_category=${category}`;
      oneValue = true;
    }
    if (item) {
      filters += oneValue ? `&id_item=${item}` : `?id_item=${item}`;
      oneValue = true;
    }
    if (condition) {
      filters += oneValue ? `&id_condition=${condition}` : `?id_condition=${condition}`;
      oneValue = true;
    }
    if (textile) {
      filters += oneValue ? `&id_textile=${textile}` : `?id_textile=${textile}`;
      oneValue = true;
    }
    if (color1) {
      filters += oneValue ? `&id_color1=${color1}` : `?id_color1=${color1}`;
      oneValue = true;
    }
    if (brand) {
      filters += oneValue ? `&id_brand=${brand}` : `?id_brand=${brand}`;
      oneValue = true;
    }
    if (size) {
      filters += oneValue ? `&id_size=${size}` : `?id_size=${size}`;
      oneValue = true;
    }
    if (searchByTitle) {
      filters += oneValue ? `&title=${searchByTitle}` : `?title=${searchByTitle}`;
      oneValue = true;
    }
    if (price) {
      if (price === 100) {
        filters += oneValue ? `&minPrice=${price}` : `?minPrice=${price}`;
        oneValue = true;
      } else if (price > 50) {
        filters += oneValue
          ? `&minPrice=50&maxPrice=${price}`
          : `?&minPrice=50&maxPrice=${price}`;
        oneValue = true;
      } else {
        filters += oneValue
          ? `&minPrice=0&maxPrice=${price}`
          : `?&minPrice=0&maxPrice=${price}`;
        oneValue = true;
      }
    }
    if (orderBy) {
      const sort = orderBy;
      filters += oneValue ? `&sort=${sort}` : `?sort=${sort}`;
      oneValue = true;
    }
    axios.get(`${urlBack}/offers${filters}`).then((res) => setAllOffers(res.data));

    setShowFilterMenu(false);
  };

  return (
    <div className="allOffers">
      <SearchBar
        handleSubmit={handleSubmit}
        showFilterMenu={showFilterMenu}
        setShowFilterMenu={setShowFilterMenu}
        setSearch={setSearchByTitle}
      />
      {showFilterMenu && (
        <FilterMenu
          item={item}
          setItem={setItem}
          itemInfos={itemInfos}
          category={category}
          setCategory={setCategory}
          categoryIsClothes={categoryIsClothes}
          setCategoryIsClothes={setCategoryIsClothes}
          sport={sport}
          setSport={setSport}
          price={price}
          setPrice={setPrice}
          size={size}
          setSize={setSize}
          showSizes={showSizes}
          setShowSizes={setShowSizes}
          brand={brand}
          setBrand={setBrand}
          condition={condition}
          setCondition={setCondition}
          textile={textile}
          setTextile={setTextile}
          color1={color1}
          setColor1={setColor1}
          colorName={colorName}
          setColorName={setColorName}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          genderIsChild={genderIsChild}
          setGenderIsChild={setGenderIsChild}
          genderAdult={genderAdult}
          setGenderAdult={setGenderAdult}
          genderChild={genderChild}
          setGenderChild={setGenderChild}
          setGender={setGender}
          categories={categories}
          colors={colors}
          showColors={showColors}
          setShowColors={setShowColors}
          conditions={conditions}
          brands={brands}
          sizes={sizes}
          textiles={textiles}
          items={items}
          sports={sports}
          handleReset={handleReset}
          handleSubmit={handleSubmit}
          handleItemSelected={handleItemSelected}
        />
      )}
      {!hideFilters && (
        <Search
          hideFilters={hideFilters}
          setHideFilters={setHideFilters}
          item={item}
          setItem={setItem}
          category={category}
          setCategory={setCategory}
          sport={sport}
          setSport={setSport}
          genderIsChild={genderIsChild}
          setGenderIsChild={setGenderIsChild}
          genderAdult={genderAdult}
          setGenderAdult={setGenderAdult}
          genderChild={genderChild}
          setGenderChild={setGenderChild}
          setGender={setGender}
          categories={categories}
          items={items}
          sports={sports}
          handleSubmit={handleSubmit}
          handleItemSelected={handleItemSelected}
        />
      )}
      <div className="allOffers__container">
        {allOffers.map((offer, index: number) => {
          return (
            <div className="allOffers__container__offer" key={index}>
              <div className="allOffers__container__offer__mainPicture">
                <Link
                  to={`/offer/${offer.id_offer}`}
                  className="allOffers__container__offer__linkOfferDetails">
                  <img src={offer.picture1} alt={`profile`} />
                </Link>
              </div>
              <ul className="allOffers__container__offer__detail">
                <li className="allOffers__container__offer__detail__price">
                  <strong>{offer.price} €</strong>
                </li>
                {idUser && (
                  <li className="allOffers__container__offer__detail__fav">
                    {userFavorites.find((fav) => fav.id_offer === offer.id_offer) ? (
                      <AiFillHeart
                        className="inputIconFull"
                        onClick={() => deleteFavorite(offer.id_offer)}
                        size={30}
                        color="red"
                      />
                    ) : (
                      <AiOutlineHeart
                        className="inputIconEmpty"
                        onClick={() => addFavorite(offer.id_offer)}
                        size={30}
                      />
                    )}
                  </li>
                )}
                <li className="allOffers__container__offer__detail__brand">
                  {brands.find((brand) => brand.id_brand === offer.id_brand)?.name}
                </li>
                <li className="allOffers__container__offer__detail__size">
                  {offer.size}
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllOffers;
