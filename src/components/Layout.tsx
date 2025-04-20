import React from 'react';
import styles from '../App.module.css';  

type Props = {
  children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
  return <div className={styles.container}>{children}</div>;
};
