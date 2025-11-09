import React from 'react';
import styles from './TestimonialsSection.module.css';

const TestimonialsSection: React.FC = () => {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.testimonialsContainer}>
        <h2 className={styles.testimonialsTitle}>
          Ils nous font confiance
        </h2>

        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialStars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={styles.testimonialStar}>⭐</span>
              ))}
            </div>
            <p className={styles.testimonialText}>
              "MDtoPDF Pro a révolutionné notre workflow de documentation.
              La qualité des PDF générés est exceptionnelle et l'interface est intuitive."
            </p>
            <div className={styles.testimonialAuthor}>
              Marie Dubois, Tech Lead
            </div>
            <div className={styles.testimonialRole}>
              Startup Tech - Paris
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.testimonialStars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={styles.testimonialStar}>⭐</span>
              ))}
            </div>
            <p className={styles.testimonialText}>
              "L'export multi-formats et les templates personnalisables nous permettent
              de maintenir une cohérence parfaite dans tous nos documents."
            </p>
            <div className={styles.testimonialAuthor}>
              Jean Martin, Directeur Marketing
            </div>
            <div className={styles.testimonialRole}>
              Agence Digitale - Lyon
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <div className={styles.testimonialStars}>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={styles.testimonialStar}>⭐</span>
              ))}
            </div>
            <p className={styles.testimonialText}>
              "L'accessibilité et les raccourcis clavier font de cet outil
              un must-have pour notre équipe inclusive."
            </p>
            <div className={styles.testimonialAuthor}>
              Sophie Chen, UX Designer
            </div>
            <div className={styles.testimonialRole}>
              Entreprise Sociale - Bordeaux
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
