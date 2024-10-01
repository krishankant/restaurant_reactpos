import MenuItem from "./MenuItem";
import React from "react";
import { usePOS } from "./POSContext";

const MenuList: React.FC = () => {
  const { state } = usePOS();
  const { menu, isLoading, error } = state;

  if (isLoading) {
    return <div>Loading menu items...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='menu-list'>
      <h2>Menu</h2>
      {menu.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MenuList;
