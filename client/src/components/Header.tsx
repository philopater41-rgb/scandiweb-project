import { useEffect, FC, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Cart, CartModal, Loading, Logo, NavigationMenu } from '.';
import { useDataContext } from '../DataContext';
import { GET_CATEGORIES } from '../graphql/queries';

const Header: FC = () => {
  const { category } = useParams<{ category: string }>();
  const { cartItems, setSelectedCategory, cartModelShow, setCartModelShow } = useDataContext();

  const [categories, setCategories] = useState<string[]>([]);

  const toggleCartModal = () => {
    setCartModelShow((prevState: boolean) => !prevState);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCartModelShow(false);
  };

  const [fetchData, { loading: dataLoading, error: dataError }] = useLazyQuery<any, { category: string | undefined }>(
    GET_CATEGORIES,
    {
      onCompleted: (data) => {
        setCategories(data.categories.map((category: { name: string }) => category.name));
        setSelectedCategory(category ?? data.categories[0]?.name);
      },
    }
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  useEffect(() => {
    document.body.style.overflowY = cartModelShow ? 'hidden' : 'auto';
  }, [cartModelShow]);

  if (dataError) {
    return (
      <p className="py-2 my-8 font-semibold text-center text-white bg-red-500">
        Oops! Something broke. Try reloading the page or come back later.
      </p>
    );
  }

  if (dataLoading) {
    return <Loading />;
  }

  return (
    <header className="relative z-10 flex items-center justify-between">
      <NavigationMenu
        categories={categories}
        handleCategoryChange={handleCategoryChange}
      />

      <div className="absolute inset-x-0 flex items-center justify-center mx-auto">
        <Link to="/" onClick={() => categories[0] && handleCategoryChange(categories[0])}>
          <Logo />
        </Link>
      </div>

      <button
        className="relative z-10 cursor-pointer"
        onClick={toggleCartModal}
        data-testid="cart-btn"
      >
        <Cart />
        {cartItems.length > 0 && (
          <div
            className="absolute flex items-center justify-center w-5 h-5 -mt-1 -mr-1 text-sm text-white rounded-full -top-1 -right-2 bg-text"
            data-testid="cart-count-bubble"
          >
            {cartItems.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0)}
          </div>
        )}
      </button>

      {cartModelShow && (
        <>
          <div
            className="absolute inset-x-0 z-50 h-screen bg-black opacity-25 top-full -right-20 -left-20"
            onClick={toggleCartModal}
            data-testid="cart-overlay"
          ></div>
          <CartModal cartItems={cartItems} />
        </>
      )}
    </header>
  );
};

export default Header;