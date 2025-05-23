import styles from '../styles/Header.module.css';

const Header = () => (
  <div className={styles.header}>
    <h1 className={styles.title}>Tech Debt Simulator</h1>
    <div className={styles.subtitle}>See what happens when you ignore tech debt or pay it down.</div>
  </div>
);

export default Header;
