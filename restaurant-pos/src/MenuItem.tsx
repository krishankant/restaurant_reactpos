import { MenuItem as MenuItemType } from "./types";
import React from "react";
import styles from "./MenuItem.module.css";
import { usePOS } from "./POSContext";

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addToOrder } = usePOS();

  return (
    <div className={styles.menuItem}>
      <h3 className={styles.menuItemName}>{item.name}</h3>
      <p className={styles.menuItemPrice}>Price: ${item.price.toFixed(2)}</p>
      <p className={styles.menuItemCategory}>Category: {item.category}</p>
      <button className={styles.addButton} onClick={() => addToOrder(item)}>
        Add to Order
      </button>
    </div>
  );
};

export default MenuItem;
