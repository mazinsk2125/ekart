import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { cartApi } from '../api/cartApi';
import type { CartProduct } from '../types';
import { AuthContext } from './AuthContext';

// ---------------------------------------------------------------------
// Shared cart state so the navbar badge and cart page stay in sync.
// ---------------------------------------------------------------------
interface CartState {
  items: CartProduct[];
  loaded: boolean;
}

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartProduct[] }
  | { type: 'CLEAR' };

const initialState: CartState = { items: [], loaded: false };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { items: action.payload, loaded: true };
    case 'CLEAR':
      return { items: [], loaded: true };
    default:
      return state;
  }
}

export interface CartContextValue {
  items: CartProduct[];
  count: number;
  loaded: boolean;
  refresh: () => Promise<void>;
  clearLocal: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const auth = useContext(AuthContext);

  const refresh = useCallback(async () => {
    const emailId = auth?.user?.emailId;
    if (!emailId) {
      dispatch({ type: 'CLEAR' });
      return;
    }
    try {
      const items = await cartApi.getCart(emailId);
      dispatch({ type: 'SET_ITEMS', payload: items });
    } catch {
      // An empty cart returns a 400 — treat as zero items.
      dispatch({ type: 'CLEAR' });
    }
  }, [auth?.user?.emailId]);

  const clearLocal = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const count = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items],
  );

  const value = useMemo<CartContextValue>(
    () => ({ items: state.items, count, loaded: state.loaded, refresh, clearLocal }),
    [state.items, state.loaded, count, refresh, clearLocal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
