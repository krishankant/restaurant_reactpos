import { MenuItem, Order, POSContextType, POSState } from "./types";
import React, { ReactNode, createContext, useContext, useEffect, useReducer } from "react";
import { fetchMenuItems, processPayment } from "./apiService";

// ... (previous imports and type definitions)
const POSContext = createContext<POSContextType | undefined>(undefined);

interface POSProviderProps {
  children: ReactNode;
}

type POSAction =
  | { type: "SET_MENU_ITEMS"; payload: MenuItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_TO_ORDER"; payload: MenuItem }
  | { type: "REMOVE_FROM_ORDER"; payload: number }
  | { type: "COMPLETE_ORDER" }
  | { type: "CANCEL_ORDER" }
  | { type: "SET_PAYMENT_PROCESSING"; payload: boolean }
  | { type: "SET_PAYMENT_ERROR"; payload: string | null };

const initialState: POSState = {
  menu: [],
  currentOrder: null,
  orders: [],
  isLoading: false,
  error: null,
  isProcessingPayment: false,
  paymentError: null,
};

function posReducer(state: POSState, action: POSAction): POSState {
  switch (action.type) {
    case "SET_MENU_ITEMS":
      return { ...state, menu: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_PAYMENT_PROCESSING":
      return { ...state, isProcessingPayment: action.payload };
    case "SET_PAYMENT_ERROR":
      return { ...state, paymentError: action.payload };

    case "ADD_TO_ORDER":
      if (!state.currentOrder) {
        return {
          ...state,
          currentOrder: {
            id: Date.now(),
            items: [{ ...action.payload, quantity: 1 }],
            total: action.payload.price,
            status: "pending",
          },
        };
      }
      const existingItem = state.currentOrder.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          currentOrder: {
            ...state.currentOrder,
            items: state.currentOrder.items.map((item) =>
              item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
            total: state.currentOrder.total + action.payload.price,
          },
        };
      }
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: [...state.currentOrder.items, { ...action.payload, quantity: 1 }],
          total: state.currentOrder.total + action.payload.price,
        },
      };
    case "REMOVE_FROM_ORDER":
      if (!state.currentOrder) return state;
      const updatedItems = state.currentOrder.items
        .map((item) => (item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0);
      const newTotal = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          items: updatedItems,
          total: newTotal,
        },
      };
    case "COMPLETE_ORDER":
      if (!state.currentOrder) return state;
      return {
        ...state,
        orders: [...state.orders, { ...state.currentOrder, status: "completed" }],
        currentOrder: null,
      };
    case "CANCEL_ORDER":
      return {
        ...state,
        currentOrder: null,
      };

    default:
      return state;
  }
}

export const POSProvider: React.FC<POSProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(posReducer, initialState);

  useEffect(() => {
    async function loadMenuItems() {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const menuItems = await fetchMenuItems();
        dispatch({ type: "SET_MENU_ITEMS", payload: menuItems });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load menu items" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }
    loadMenuItems();
  }, []);

  const addToOrder = (item: MenuItem) => dispatch({ type: "ADD_TO_ORDER", payload: item });
  const removeFromOrder = (itemId: number) => dispatch({ type: "REMOVE_FROM_ORDER", payload: itemId });
  const cancelOrder = () => dispatch({ type: "CANCEL_ORDER" });

  const completeOrder = async () => {
    if (!state.currentOrder) return;

    dispatch({ type: "SET_PAYMENT_PROCESSING", payload: true });
    dispatch({ type: "SET_PAYMENT_ERROR", payload: null });

    try {
      const result = await processPayment(state.currentOrder.id, state.currentOrder.total);
      if (result.success) {
        dispatch({ type: "COMPLETE_ORDER" });
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      dispatch({ type: "SET_PAYMENT_ERROR", payload: "Failed to process payment" });
    } finally {
      dispatch({ type: "SET_PAYMENT_PROCESSING", payload: false });
    }
  };

  return (
    <POSContext.Provider value={{ state, addToOrder, removeFromOrder, completeOrder, cancelOrder }}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error("usePOS must be used within a POSProvider");
  }
  return context;
};
