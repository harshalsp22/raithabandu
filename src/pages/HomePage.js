import React, { useEffect } from 'react'; // 1. Make sure useEffect is imported
import { useTranslation } from 'react-i18next';
import { FaStore, FaSun, FaRegNewspaper, FaAward } from 'react-icons/fa';
import Advertisement from '../components/Advertisement';
import InfoCard from '../components/InfoCard';
import BackgroundVideo from '../components/BackgroundVideo'; // 2. Import the video component
import styles from './HomePage.module.css';

const HomePage = ({ currentUser }) => { 
  const { t } = useTranslation();

  // 3. This hook adds a class to the <body> tag when the page loads,
  //    and removes it when the user navigates away.
  useEffect(() => {
    document.body.classList.add('homepage-with-video');
    
    // Cleanup function to remove the class
    return () => {
      document.body.classList.remove('homepage-with-video');
    };
  }, []); // The empty array means this runs only once when the component mounts

  return (
    <div>
      <BackgroundVideo /> {/* 4. Render the video component */}
      <Advertisement />
      <div className={styles.infoGrid}>
        <div className={styles.marketPrice}>
          <InfoCard icon={<FaStore />} title={t('MarketPrice')} path="/MarketPrice" />
        </div>
        <div className={styles.weather}>
          <InfoCard icon={<FaSun />} title={t('weather')} path="/weather" />
        </div>
        <div className={styles.currentNews}>
          <InfoCard icon={<FaRegNewspaper />} title={t('currentNews')} path="/news" />
        </div>
        <div className={styles.rewardPoints}>
          <InfoCard
            icon={<FaAward />}
            title={t('rewardPoints')}
            path="/rewards"
            points={currentUser ? currentUser.points : null}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

