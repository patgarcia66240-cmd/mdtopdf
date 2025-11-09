import React from 'react';
import styles from './HeroSectionSkeleton.module.css';

const HeroSectionSkeleton: React.FC = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroTitleSkeleton}></div>
        <div className={styles.heroDescriptionSkeleton}></div>
        <div className={styles.heroButtonsSkeleton}>
          <div className={styles.heroButtonSkeleton}></div>
          <div className={styles.heroButtonSkeleton}></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionSkeleton;
