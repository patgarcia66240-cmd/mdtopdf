import React from 'react';
import styles from './FeaturesSectionSkeleton.module.css';

const FeaturesSectionSkeleton: React.FC = () => {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresContainer}>
        <div className={styles.featuresTitleSkeleton}></div>
        <div className={styles.featuresGrid}>
          {[...Array(6)].map((_, index) => (
            <div key={index} className={styles.featureCardSkeleton}>
              <div className={styles.featureIconSkeleton}></div>
              <div className={styles.featureTitleSkeleton}></div>
              <div className={styles.featureDescriptionSkeleton}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSectionSkeleton;
