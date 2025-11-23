import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './SideDrawer.module.css';

const SideDrawer = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={`${styles.backdrop} ${isOpen ? styles.open : ''}`} onClick={onClose}></div>
      <nav className={`${styles.sideDrawer} ${isOpen ? styles.open : ''}`}>
        <ul>
          <li><NavLink to="/education" onClick={onClose}>{t('education')}</NavLink></li>
          <li><NavLink to="/government" onClick={onClose}>{t('government')}</NavLink></li>
          <li><NavLink to="/ml" onClick={onClose}>{t('ml')}</NavLink></li>
          <li><NavLink to="/transport" onClick={onClose}>{t('transport')}</NavLink></li>
          <li><NavLink to="/settings" onClick={onClose}>{t('settings')}</NavLink></li>
        </ul>
      </nav>
    </>
  );
};

export default SideDrawer;