import { animated, useSpring } from "react-spring";

import React from "react";
import styles from "./CurrentOrder.module.css";
import { usePOS } from "./POSContext";

const CurrentOrder: React.FC = () => {
  const { state, removeFromOrder, completeOrder, cancelOrder } = usePOS();
  const { currentOrder, isProcessingPayment, paymentError } = state;

  const orderAnimation = useSpring({
    opacity: currentOrder ? 1 : 0,
    transform: currentOrder ? "translateY(0)" : "translateY(50px)",
  });

  if (!currentOrder) {
    return <div className={styles.noOrder}>No current order</div>;
  }

  return (
    <animated.div style={orderAnimation} className={styles.currentOrder}>
      <h2 className={styles.title}>Current Order</h2>
      {currentOrder.items.map((item) => (
        <animated.div key={item.id} className={styles.orderItem}>
          <span>
            {item.name} x {item.quantity}
          </span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
          <button className={styles.removeButton} onClick={() => removeFromOrder(item.id)}>
            Remove
          </button>
        </animated.div>
      ))}
      <div className={styles.orderTotal}>
        <strong>Total: ${currentOrder.total.toFixed(2)}</strong>
      </div>
      <div className={styles.orderActions}>
        <button className={styles.completeButton} onClick={completeOrder} disabled={isProcessingPayment}>
          {isProcessingPayment ? "Processing..." : "Complete Order"}
        </button>
        <button className={styles.cancelButton} onClick={cancelOrder} disabled={isProcessingPayment}>
          Cancel Order
        </button>
      </div>
      {paymentError && <div className={styles.paymentError}>Error: {paymentError}</div>}
    </animated.div>
  );
};

export default CurrentOrder;
