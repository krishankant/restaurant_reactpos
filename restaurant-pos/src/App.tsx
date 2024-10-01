import CurrentOrder from "./CurrentOrder";
import MenuList from "./MenuList";
import { POSProvider } from "./POSContext";
import React from "react";
import styles from "./App.module.css";

const App: React.FC = () => {
  return (
    <POSProvider>
      <div className={styles.app}>
        <header className={styles.header}>
          <h1>Restaurant POS</h1>
        </header>
        <main className={styles.main}>
          <section className={styles.menuSection}>
            <MenuList />
          </section>
          <section className={styles.orderSection}>
            <CurrentOrder />
          </section>
        </main>
      </div>
    </POSProvider>
  );
};

export default App;
