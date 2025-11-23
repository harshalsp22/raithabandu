import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaCaretDown, FaBars, FaUserCircle } from 'react-icons/fa'; 
import styles from './Header.module.css';

const Header = ({ onMenuClick, currentUser, onAuthClick }) => {
  const { t, i18n } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangDropdownOpen(false);
  };
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  return (
    <header className={styles.header}>
      <div className={styles.headerSection}></div>

      <div className={`${styles.headerSection} ${styles.center}`}>
        <Link to="/" className={styles.logoLink}>
          <img src="/logo09.png" alt="Ritha Bandu Logo" className={styles.logoIcon} />
          <h1>{t('appTitle')}</h1>
        </Link>
      </div>

      <div className={`${styles.headerSection} ${styles.right}`}>
        <div className={styles.languageSelector} ref={dropdownRef}>
          <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className={styles.langButton}>
            <FaGlobe />
            <span>{i18n.language.toUpperCase()}</span>
            <FaCaretDown className={styles.caret}/>
          </button>
          {langDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <a onClick={() => changeLanguage('en')}>English</a>
              <a onClick={() => changeLanguage('hi')}>हिन्दी</a>
              <a onClick={() => changeLanguage('kn')}>ಕನ್ನಡ</a>
            </div>
          )}
        </div>

        <button onClick={onAuthClick} className={styles.authButton}>
          <FaUserCircle className={styles.userIcon} />
          <span>{currentUser ? currentUser.name : t('login')}</span>
        </button>

        <button onClick={onMenuClick} className={styles.menuButton}>
          <FaBars />
        </button>
      </div>
    </header>
  );
};

export default Header;