import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Advertisement.module.css';

const Advertisement = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.adContainer}>
      <div className={styles.adTextContent}>
        <h3>{t('ad.title')}</h3>
        <p>{t('ad.description')}</p>
        <button className={styles.adButton}>
          {t('ad.button')}
        </button>
      </div>
      <div className={styles.adMediaContainer}>
        <video 
          src="/fertilize.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className={styles.adVideo}
        />
      </div>
    </div>
  );
};

export default Advertisement;
