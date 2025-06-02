import {
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import './Header.scss';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { links } from '../../constants/common';
import { Search } from 'lucide-react';

type HeaderProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Header: React.FC<HeaderProps> = ({
  setIsMenuOpen,
  isMenuOpen,
}) => {
  const favorites = useSelector((state: RootState) => state.favorites);
  const cart = useSelector((state: RootState) => state.cart);
  const location = useLocation();
  const navigate = useNavigate();
  const { category, product } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('query') || '';

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set('query', value);
    } else {
      params.delete('query');
    }

    params.delete('page');
    setSearchParams(params);
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(false);
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="header page__header">
      <div className="header__content">
        <div className="header__logo">
          <NavLink
            to="/"
            className="header__logo-link"
            onClick={handleLogoClick}
          >
            <img src="./img/Logo.svg" alt="logo" />
          </NavLink>
        </div>

        <nav className="header__nav nav">
          <ul className="nav__list nav__list--header">
            {links.map((link, index) => (
              <li className="nav__item" key={index}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    classNames('nav__link', { active: isActive })
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="header__actions">
          {category && !product && (
            <li className="header__actions-item header__actions-item--search">
              <Search className="search-icon" />
              <input
                className="search-item"
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
              />
            </li>
          )}

          <li className="header__actions-item header__actions-item--favourite">
            <NavLink
              to="favorites"
              className={({ isActive }) =>
                classNames('icon', 'icon--favourite', { active: isActive })
              }
            >
              {favorites.length > 0 && (
                <span className="favorite-count">{favorites.length}</span>
              )}
              <img src="./img/icons/favourites.svg" alt="favorite" />
            </NavLink>
          </li>

          <li className="header__actions-item header__actions-item--cart">
            <NavLink
              to="cart-page"
              className={({ isActive }) =>
                classNames('icon', 'icon--cart', { active: isActive })
              }
            >
              {cart.length > 0 && (
                <span className="favorite-count">{cart.length}</span>
              )}
              <img src="./img/icons/shopping-bag.svg" alt="shopping-bag" />
            </NavLink>
          </li>

          <li className="header__actions-item header__actions-item--menu">
            <button onClick={toggleMenu} className="icon icon--menu">
              <img
                src={
                  isMenuOpen
                    ? './img/icons/close-menu.svg'
                    : './img/icons/menu.svg'
                }
                alt="menu"
              />
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};
