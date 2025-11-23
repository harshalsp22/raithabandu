import React from 'react';
import styles from './BackgroundVideo.module.css';

// The path is now a direct link to the file in your `public` folder.
const videoURL = '/nature.mp4';

const BackgroundVideo = () => {
  return (
    <div className={styles.videoContainer}>
      <div className={styles.overlay}></div>
      <video
        autoPlay
        loop
        muted
        playsInline // Important for mobile devices
        className={styles.video}
      >
        <source src={videoURL} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BackgroundVideo;

