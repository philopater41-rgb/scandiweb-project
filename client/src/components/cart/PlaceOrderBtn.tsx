import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { PLACE_ORDER } from '../../graphql/mutations';
import { Spinner } from '../';
import { useDataContext } from '../../DataContext';

interface Price {
  currency: {
    symbol: string;
  };
  amount: number;
}

interface AttributeItem {
  id: string;
  attribute_id: string;
  value: string;
  displayValue: string;
}

interface AttributeSet {
  id: string;
  name: string;
  type: string;
  items: AttributeItem[];
}

interface Product {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  prices: Price[];
  attributes: AttributeSet[];
  description: string;
  quantity?: number;
}

interface SelectedAttribute {
    id: string;
    attributeId: string;
    value: string;
}

interface CartItem {
  id: string;
  product: Product;
  selectedAttributes: SelectedAttribute[];
  quantity: number;
}

interface PlaceOrderBtnProps {
  className?: string;
}

function PlaceOrderBtn({ className }: PlaceOrderBtnProps) {
  const [placeOrder, { loading }] = useMutation(PLACE_ORDER);
  const { emptyCart } = useDataContext();

  const handlePlaceOrder = async () => {
    const cartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');

    if (!cartItems.length) {
      return toast.error('Cart is empty! 🛒');
    }

    const orderInput = {
      items: cartItems.map((item) => {
        return {
          productId: item.product.id,
          quantity: item.quantity,
          attributeValues: item.selectedAttributes.map((attr) => ({
            id: attr.id,
            value: attr.value,
          })),
        };
      }),
    };

    try {
      const { data } = await placeOrder({
        variables: { orderInput: orderInput },
      });

      emptyCart();
      toast.success(data.placeOrder || 'Order placed successfully!');
    } catch (err: any) {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const errorMessage = err.graphQLErrors[0].message;
        return toast.error(`Error placing order: ${errorMessage}`);
      }

      if (
        err.networkError &&
        err.networkError.result &&
        err.networkError.result.error
      ) {
        const errorMessage = err.networkError.result.error;
        return toast.error(`Error placing order: ${errorMessage}`);
      }

      toast.error('Error placing order. Please try again later.');
    }
  };

  return (
    <button
      type="button"
      className={`btn-cta flex items-center justify-center disabled:opacity-70${
        className ? ' ' + className : ''
      }`}
      onClick={handlePlaceOrder}
      disabled={loading}
      data-testid="place-order-btn"
    >
      {loading && <Spinner className="w-4 h-4 mr-2" />}
      Place Order
    </button>
  );
}

export default PlaceOrderBtn;