import { Link } from 'react-router-dom';
import { Cart } from './';
import searchingImg from '../assets/searching.svg';
import { useDataContext } from '../DataContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useDataContext();

  if (!product) return null;

  return (
    <article>
      <div className="p-4 overflow-hidden transition-shadow duration-500 hover:shadow-xl group">
        <div className="relative mb-6">
          <Link
            to={`/products/${product.id}`}
            data-testid={`product-${product.name
              .replace(/\s+/g, '-')
              .toLowerCase()}`}
          >
            <div className="relative">
              <img
                src={product.gallery[0] ?? searchingImg}
                alt={product.name}
                loading="lazy"
                className="object-contain w-full min-h-64 max-h-96"
              />
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center px-2 py-1 text-2xl uppercase bg-white bg-opacity-70 text-muted">
                  Out of Stock
                </div>
              )}
            </div>
          </Link>

          {product.inStock && (
            <button
              onClick={() => addToCart(product)}
              className="absolute bottom-0 p-2 transition-opacity duration-300 transform translate-y-1/2 rounded-full opacity-0 cta group-hover:opacity-100 right-4"
            >
              <Cart color="white" className="w-5 h-5" />
            </button>
          )}
        </div>

        <h3 className="text-lg font-light capitalize">{product.name}</h3>
        <div className={`${!product.inStock ? 'text-muted ' : ''}text-lg`}>
          {product.prices[0].currency.symbol} {product.prices[0].amount}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;