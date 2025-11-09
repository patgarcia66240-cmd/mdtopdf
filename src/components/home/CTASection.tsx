import React from 'react';
import { Link } from '@tanstack/react-router';
import { StarIcon } from '@heroicons/react/24/outline';
import styles from './CTASection.module.css';

const CTASection: React.FC = () => {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContainer}>
        <h2 className={styles.ctaTitle}>
          Prêt à transformer vos documents ?
        </h2>

        <p className={styles.ctaDescription}>
          Rejoignez des milliers d'utilisateurs satisfaits et commencez
          à créer des PDF professionnels en quelques clics.
        </p>

        <Link
          to="/"
          className={styles.ctaButton}
          aria-label="Commencer à utiliser MDtoPDF Pro maintenant"
        >
          <StarIcon className="w-5 h-5 mr-2" />
          Commencer gratuitement
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
