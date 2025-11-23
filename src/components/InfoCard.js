import React from 'react';
import { Link } from 'react-router-dom';
import styles from './InfoCard.module.css';

const InfoCard = ({ icon, title, path, points }) => {
  return (
    <Link to={path} className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <p>{title}</p>

      {points && (
        <div className={styles.pointsDetail}>
          <div className={styles.pointsItem}>
            <span>{points.obtained}</span>
            <small>Total Obtained</small>
          </div>
          <div className={styles.pointsItem}>
            <span>{points.used}</span>
            <small>Total Spent</small>
          </div>
          <div className={styles.pointsItem}>
            <span>{points.current}</span>
            <small>Remaining</small>
          </div>
        </div>
      )}
    </Link>
  );
};

export default InfoCard;
