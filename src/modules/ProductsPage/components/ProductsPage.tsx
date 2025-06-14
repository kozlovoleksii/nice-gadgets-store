import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Product } from '../../../constants/common';
import './ProductsPage.scss';
import '../../HomePage/components/SliderCards/SliderCards.scss';
import { useEffect, useState } from 'react';
import { Breadcrumbs } from '../../../components/Breadcrumbs/Breadcrumbs';
import { fetchProducts } from '../../../utils/fetchProducts';
import { ProductCard } from '../../../components/ProductCard';
import { Loader } from '../../../components/Loader';
import { withMinDelay } from '../../../utils/delay';

export const ProductsPage = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectsOpen, setSelectsOpen] = useState({
    sort: false,
    perPage: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const validCategories = ['phones', 'tablets', 'accessories'];

  const sortByParams = searchParams.get('sort') || 'age';
  const sortByCount = searchParams.get('perPage') || '4';
  const query = searchParams.get('query')?.toLowerCase() || '';

  const page = Number(searchParams.get('page') || '1');
  const perPage = sortByCount === 'all' ? products.length : Number(sortByCount);

  const pageCount =
    sortByCount === 'all' ? 1 : Math.ceil(products.length / perPage);

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  const categoryTitles: Record<string, string> = {
    phones: 'Mobile phones',
    tablets: 'Tablets',
    accessories: 'Accessories',
  };

  const title = category ? categoryTitles[category] || 'Products' : 'Products';

  const sortedProducts = [...products].sort((a, b) => {
    if (sortByParams === 'age') {
      return b.year - a.year;
    }

    if (sortByParams === 'title') {
      return a.name.localeCompare(b.name);
    }

    if (sortByParams === 'price') {
      return a.price - b.price;
    }

    return 0;
  });



  const MAX_VISIBLE_PAGES = 5;
  let startPage = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
  let endPage = startPage + MAX_VISIBLE_PAGES - 1;

  if (endPage > pageCount) {
    endPage = pageCount;
    startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
  }

  const visiblePageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    visiblePageNumbers.push(i);
  }

  const filteredProducts = sortedProducts.filter(product =>
  product.name.toLowerCase().includes(query)
)
  const visibleProducts =
    sortByCount === 'all'
      ? filteredProducts
      : filteredProducts.slice(startIndex, endIndex);


  useEffect(() => {
    if (!category) {
      return;
    }

    setIsLoading(true);
    setHasError(false);

    withMinDelay(fetchProducts(category), 1000)
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [category]);

  useEffect(() => {
    const isMobileOrTablet = window.innerWidth < 1024;
    const shouldScroll = isMobileOrTablet || visibleProducts.length > 4;

    if (shouldScroll) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [category, page, visibleProducts.length]);

  if (!category || !validCategories.includes(category)) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div className="products">
      <div className="products__container products__container--with-pagination">
        <Breadcrumbs />

        {isLoading && <Loader />}

        {!isLoading && hasError && (
          <div className="products__error">
            <p>Oops! Something went wrong while loading data.</p>
            <button
              onClick={() => window.location.reload()}
              className="reload-button"
            >
              Reload
            </button>
          </div>
        )}

        {!isLoading && !hasError && products.length === 0 && (
          <p className="products__empty">There are no {category} yet.</p>
        )}

        {!isLoading && !hasError && products.length > 0 && (
          <>
            <h1 className="products__title title">{title}</h1>
            <p className="products__count">{filteredProducts.length} models</p>

            {filteredProducts.length === 0 ? <div className="products__empty-search">
        <p className="products__empty-text">
          😔 Sorry, no {category} matching your search query.
        </p>
        <button
          className="reload-button"
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.delete('query');
            setSearchParams(params);
          }}
        >
          Reset search
        </button>
      </div>:
            <>
            <div className="products__filter-content">
              <div className="products__filter-group">
                <label htmlFor="sort" className="products__filter-label">
                  Sort by
                </label>
                <select
                  id="sort"
                  onFocus={() =>
                    setSelectsOpen(prev => ({ ...prev, sort: true }))
                  }
                  onBlur={() =>
                    setSelectsOpen(prev => ({ ...prev, sort: false }))
                  }
                  className={`products__filter-select ${selectsOpen.sort ? 'products__filter-select--open' : ''}`}
                  value={sortByParams}
                  onChange={e => {
                    const params = new URLSearchParams(searchParams);
                    params.set('sort', e.target.value);
                    setSearchParams(params);
                  }}
                >
                  <option value="age">Newest</option>
                  <option value="title">Alphabetically</option>
                  <option value="price">Cheapest</option>
                </select>
              </div>

              <div className="products__filter-group">
                <label
                  htmlFor="items-per-page"
                  className="products__filter-label"
                >
                  Items on page
                </label>
                <select
                  id="items-per-page"
                  onFocus={() =>
                    setSelectsOpen(prev => ({ ...prev, perPage: true }))
                  }
                  onBlur={() =>
                    setSelectsOpen(prev => ({ ...prev, perPage: false }))
                  }
                  className={`products__filter-select ${selectsOpen.perPage ? 'products__filter-select--open' : ''}`}
                  value={sortByCount}
                  onChange={e => {
                    const params = new URLSearchParams(searchParams);
                    params.set('perPage', e.target.value);
                    params.delete('page');
                    setSearchParams(params);
                  }}
                >
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="16">16</option>
                  <option value="all">all</option>
                </select>
              </div>
            </div>
            </>
            }

            

            <div className="products__cards cards">
              <ul className="cards__list">
                {visibleProducts.map((product, index) => (
                  <li className="cards__item" key={index}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            </div>

            {pageCount > 1 && filteredProducts.length > 0 && (
              <div className="products__pagination pagination">
                <ol className="pagination__list">
                  <li>
                    <button
                      disabled={page === 1}
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);

                        if (page - 1 > 1) {
                          newParams.set('page', String(page - 1));
                        } else {
                          newParams.delete('page');
                        }

                        setSearchParams(newParams);
                      }}
                    >
                      {'<'}
                    </button>
                  </li>

                  {visiblePageNumbers.map(num => (
                    <li key={num}>
                      <button
                        className={num === page ? 'active-btn' : ''}
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);

                          if (num === 1) {
                            newParams.delete('page');
                          } else {
                            newParams.set('page', String(num));
                          }

                          setSearchParams(newParams);
                        }}
                      >
                        {num}
                      </button>
                    </li>
                  ))}

                  <li>
                    <button
                      disabled={page === pageCount}
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);

                        newParams.set('page', String(page + 1));
                        setSearchParams(newParams);
                      }}
                    >
                      {'>'}
                    </button>
                  </li>
                </ol>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
