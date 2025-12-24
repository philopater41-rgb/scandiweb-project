import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { Product, CartItem, SelectedAttribute } from './types';

// Define the shape of the context data
interface DataContextType {
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  addToCart: (product: Product, shouldProvideAttributes?: boolean, selectedAttributes?: SelectedAttribute[]) => void;
  cartItems: CartItem[];
  updateCartItemQuantity: (itemId: string, value: number) => void;
  updateCartItemAttribute: (product: Product, oldAttributes: SelectedAttribute[], newAttributes: SelectedAttribute[]) => void;
  emptyCart: () => void;
  cartModelShow: boolean;
  setCartModelShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(
    JSON.parse(localStorage.getItem('cartItems') || '[]')
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartModelShow, setCartModelShow] = useState(false);

  const addToCart = (
    product: Product,
    shouldProvideAttributes = false,
    selectedAttributes: SelectedAttribute[] = []
  ) => {
    let attributes;

    if (shouldProvideAttributes) {
      const missingAttributes = product.attributes?.filter(
        (attr) =>
          !selectedAttributes.some(
            (selectedAttr) => selectedAttr.attributeId === attr.name
          )
      );

      if (missingAttributes && missingAttributes.length > 0) {
        return toast.error('Please select all attributes! ⚠️');
      }

      attributes = selectedAttributes.map((attr) => ({
        id: attr.id,
        attributeId: attr.attributeId,
        value: attr.value,
      }));
    } else {
      // If no attributes selected, use default ones
      attributes = product.attributes?.map((attr) => {
        const firstItem = attr.items[0];
        return {
          id: firstItem?.id || '',
          attributeId: firstItem?.attribute_id || '',
          value: firstItem?.value || '',
        };
      });
    }

    const existingCartItems = [...cartItems];

    const existingItemIndex = existingCartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        JSON.stringify(item.selectedAttributes) === JSON.stringify(attributes)
    );

    if (existingItemIndex !== -1) {
      existingCartItems[existingItemIndex].quantity += 1;
    } else {
      const newItem = {
        id: new Date().valueOf().toString(),
        product,
        selectedAttributes: attributes || [],
        quantity: 1,
      };

      existingCartItems.unshift(newItem);
    }

    setCartItems(existingCartItems);
    localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
    setTimeout(() => {
      setCartModelShow(true); // Open cart modal when item is added
    }, 0);

    toast.success('Item added to cart! 🛒');
  };

  const updateCartItemAttribute = (product: Product, oldAttributes: SelectedAttribute[], newAttributes: SelectedAttribute[]) => {
    const itemIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        JSON.stringify(item.selectedAttributes) ===
        JSON.stringify(oldAttributes)
    );

    if (itemIndex === -1) return;

    const duplicateItemIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        JSON.stringify(item.selectedAttributes) ===
        JSON.stringify(newAttributes)
    );

    const existingCartItems = [...cartItems];
    // update the cart item if no duplicate item is found with the same attributes
    if (duplicateItemIndex === -1) {
      const updatedCartItem = {
        ...cartItems[itemIndex]!,
        selectedAttributes: newAttributes,
      };

      existingCartItems[itemIndex] = updatedCartItem;

      toast.success('Cart item updated successfully!');
    }
    // merge the quantities of duplicate items if they have different attributes
    else if (itemIndex !== duplicateItemIndex && existingCartItems[duplicateItemIndex]) {
      existingCartItems[itemIndex].quantity +=
        existingCartItems[duplicateItemIndex].quantity;

      // remove the duplicate item from the cart
      existingCartItems.splice(duplicateItemIndex, 1);

      toast.success('Cart item quantities merged successfully!');
    }

    setCartItems(existingCartItems);

    localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
  };

  const updateCartItemQuantity = (itemId: string, value: number) => {
    const existingCartItems =
      JSON.parse(localStorage.getItem('cartItems') || '[]');

    const index = existingCartItems.findIndex((item: CartItem) => item.id === itemId);

    if (index !== -1) {
      existingCartItems[index].quantity += value;

      if (existingCartItems[index].quantity <= 0) {
        existingCartItems.splice(index, 1);
      }

      localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
      setCartItems(existingCartItems);

      toast.success('Cart item updated successfully!');
    }
  };

  const emptyCart = () => {
    localStorage.removeItem('cartItems');

    setCartItems([]);
  };

  return (
    <DataContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        addToCart,
        cartItems,
        updateCartItemQuantity,
        updateCartItemAttribute,
        emptyCart,
        cartModelShow,
        setCartModelShow,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};