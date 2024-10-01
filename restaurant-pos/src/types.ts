export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
}
export interface OrderItem extends MenuItem {
  quantity: number;
}
export interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  status: "pending" | "completed" | "cancelled";
}
export interface POSState {
  menu: MenuItem[];
  currentOrder: Order | null;
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  isProcessingPayment: boolean;
  paymentError: string | null;
}
export interface POSContextType {
  state: POSState;
  addToOrder: (item: MenuItem) => void;
  removeFromOrder: (itemId: number) => void;
  completeOrder: () => void;
  cancelOrder: () => void;
}
