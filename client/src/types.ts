export interface Price {
  amount: string;
  currency: {
    label: string;
    symbol: string;
  };
}

export interface AttributeItem {
  id: string;
  attribute_id: string; // Added this line
  value: string;
  displayValue: string;
}

export interface AttributeSet {
  id: string;
  name: string;
  type: string;
  items: AttributeItem[];
}

export interface Product {
  id: string;
  name: string;
  inStock: boolean;
  gallery: string[];
  description: string;
  brand: string;
  prices: Price[];
  category: string;
  attributes?: AttributeSet[];
  quantity?: number; // Added this line
}

export interface SelectedAttribute {
  id: string;
  attributeId: string;
  value: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedAttributes: SelectedAttribute[];
  quantity: number;
}