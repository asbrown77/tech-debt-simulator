import styles from '../styles/Header.module.css';

const Header = () => (
  <div className={styles.header}>
    <h1 className={styles.title}>Tech Debt Simulation Game</h1>
    <div className={styles.subtitle}>See what happens when you ignore it and build or pay it down.</div>
  </div>
);

export default Header;
