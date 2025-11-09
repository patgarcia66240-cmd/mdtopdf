import React from 'react';
import { Link } from '@tanstack/react-router';
import { RocketLaunchIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroSection} aria-labelledby="hero-title">
      <div className={styles.heroContainer}>
        <h1 id="hero-title" className={styles.heroTitle}>
          Convertissez Markdown vers PDF
          <span> Professionnel</span>
        </h1>

        <p className={styles.heroDescription}>
          Transformez vos documents Markdown en PDF haute qualité avec prévisualisation en temps réel,
          templates personnalisables et export multi-formats.
        </p>

        <div className={styles.heroButtons}>
          <Link
            to="/"
            className={styles.heroButtonPrimary}
            aria-label="Commencer à convertir vos documents Markdown"
          >
            <RocketLaunchIcon className="w-5 h-5 mr-2" />
            Commencer maintenant
          </Link>

          <Link
            to="/templates"
            className={styles.heroButtonSecondary}
            aria-label="Explorer les templates disponibles"
          >
            <Squares2X2Icon className="w-5 h-5 mr-2" />
            Voir les templates
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
