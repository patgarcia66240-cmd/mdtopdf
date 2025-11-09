import React from 'react';
import styles from './CTASectionSkeleton.module.css';

const CTASectionSkeleton: React.FC = () => {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContainer}>
        <div className={styles.ctaTitleSkeleton}></div>
        <div className={styles.ctaDescriptionSkeleton}></div>
        <div className={styles.ctaButtonSkeleton}></div>
      </div>
    </section>
  );
};

export default CTASectionSkeleton;
