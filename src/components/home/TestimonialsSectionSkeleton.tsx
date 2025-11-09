import React from 'react';
import styles from './TestimonialsSectionSkeleton.module.css';

const TestimonialsSectionSkeleton: React.FC = () => {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.testimonialsContainer}>
        <div className={styles.testimonialsTitleSkeleton}></div>
        <div className={styles.testimonialsGrid}>
          {[...Array(3)].map((_, index) => (
            <div key={index} className={styles.testimonialCardSkeleton}>
              <div className={styles.testimonialStarsSkeleton}></div>
              <div className={styles.testimonialTextSkeleton}></div>
              <div className={styles.testimonialAuthorSkeleton}></div>
              <div className={styles.testimonialRoleSkeleton}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSectionSkeleton;
