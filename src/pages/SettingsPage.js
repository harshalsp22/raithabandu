import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import styles from './SettingsPage.module.css';

const SettingsPage = ({ currentUser }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <div className={styles.settingsContainer}>
      <h2>{t('settings')}</h2>

      <div className={styles.settingItem}>
        <span>{t('profileEdit')}</span>
        <Link to="/edit-profile" className={styles.button}>
          Edit
        </Link>
      </div>

      {currentUser ? (
        <div className={styles.profileInfo}>
          <p>
            <strong>Name:</strong> {currentUser.name}
          </p>
          <p>
            <strong>Phone:</strong> {currentUser.phone}
          </p>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <p>
            <strong>Place:</strong> {currentUser.place}
          </p>
        </div>
      ) : (
        <p className={styles.loginPrompt}>
          Please log in to see and edit your details.
        </p>
      )}

      <div className={styles.settingItem}>
        <span>{theme === 'light' ? t('lightMode') : t('darkMode')}</span>
        <label className={styles.switch}>
          <input
            type="checkbox"
            onChange={toggleTheme}
            checked={theme === 'dark'}
          />
          <span className={`${styles.slider} ${styles.round}`}></span>
        </label>
      </div>
    </div>
  );
};

export default SettingsPage;
