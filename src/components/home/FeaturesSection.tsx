import React from 'react';
import styles from './FeaturesSection.module.css';

const FeaturesSection: React.FC = () => {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresContainer}>
        <h2 className={styles.featuresTitle}>
          Fonctionnalités puissantes pour vos documents
        </h2>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📄</div>
            <h3 className={styles.featureTitle}>
              Conversion Markdown → PDF
            </h3>
            <p className={styles.featureDescription}>
              Transformez vos fichiers Markdown en PDF professionnels avec une qualité d'impression optimale.
              Support complet de la syntaxe Markdown incluant tableaux, listes et formatage avancé.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>👁️</div>
            <h3 className={styles.featureTitle}>
              Prévisualisation temps réel
            </h3>
            <p className={styles.featureDescription}>
              Visualisez instantanément vos modifications avec un aperçu fidèle du rendu final.
              Ajustez la mise en page, les couleurs et la typographie en temps réel.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3 className={styles.featureTitle}>
              Templates personnalisables
            </h3>
            <p className={styles.featureDescription}>
              Choisissez parmi une collection de templates professionnels ou créez le vôtre.
              Adaptez les couleurs, polices et mises en page à votre charte graphique.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📤</div>
            <h3 className={styles.featureTitle}>
              Export multi-formats
            </h3>
            <p className={styles.featureDescription}>
              Exportez vos documents en PDF, HTML, DOCX ou Markdown.
              Chaque format est optimisé pour garantir la meilleure qualité possible.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>♿</div>
            <h3 className={styles.featureTitle}>
              Accessibilité complète
            </h3>
            <p className={styles.featureDescription}>
              Interface conçue pour tous les utilisateurs avec support du clavier,
              lecteur d'écran et conformité aux standards d'accessibilité WCAG.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>
              Performance optimisée
            </h3>
            <p className={styles.featureDescription}>
              Génération rapide même pour les documents volumineux.
              Cache intelligent et optimisation des ressources pour une expérience fluide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
