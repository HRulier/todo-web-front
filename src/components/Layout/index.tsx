import React from 'react';
import Header from '../Header';
import styles from './layout.module.scss';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <div className={styles.main}>{children}</div>
  </>
);

export default Layout;
