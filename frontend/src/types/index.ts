// =====================================================================
// Strongly-typed API contract shapes for the EKart frontend.
// These mirror the backend DTOs exactly.
// =====================================================================

export interface Customer {
  emailId: string;
  name: string;
  phoneNumber: string;
  address: string;
}

export interface LoginRequest {
  emailId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  emailId: string;
  name: string;
  phoneNumber: string;
  address: string;
}

export interface RegisterRequest {
  emailId: string;
  name: string;
  password: string;
  newPassword?: string;
  phoneNumber: string;
  address: string;
}

export interface Product {
  productId: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  availableQuantity: number;
  imageUrl?: string;
}

export interface CartProduct {
  cartProductId: number;
  product: Product;
  quantity: number;
}

export interface AddToCartRequest {
  customerEmailId: string;
  cartProducts: Array<{
    product: { productId: number };
    quantity: number;
  }>;
}

export type CardType = 'Credit' | 'Debit';

export interface Card {
  cardId: number;
  cardType: CardType;
  cardNumber: string;
  nameOnCard: string;
  hashCvv: string;
  cvv: null;
  expiryDate: string;
  customerEmailId: string;
}

export interface AddCardRequest {
  cardType: CardType;
  cardNumber: string;
  nameOnCard: string;
  cvv: string;
  expiryDate: string;
  customerEmailId: string;
}

export interface PlaceOrderRequest {
  customerEmailId: string;
  dateOfDelivery?: string;
  paymentThrough: CardType;
}

export interface MakePaymentRequest {
  cardId: number;
  cvv: string;
}

export interface OrderedProduct {
  orderedProductId: number;
  product: Product;
  quantity: number;
}

export interface Order {
  orderId: number;
  customerEmailId: string;
  dateOfOrder: string;
  totalPrice: number;
  orderStatus: string;
  discount: number;
  paymentThrough: string;
  dateOfDelivery: string;
  deliveryAddress: string;
  orderedProducts: OrderedProduct[];
}

// Shape of the authenticated user kept in global state.
export interface AuthUser {
  emailId: string;
  name: string;
  phoneNumber: string;
  address: string;
}
