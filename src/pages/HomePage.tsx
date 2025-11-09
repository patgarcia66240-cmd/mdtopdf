import React, { Suspense } from 'react';
import Helmet from '../components/seo/Helmet';
import HeroSectionSkeleton from '../components/home/HeroSectionSkeleton';
import FeaturesSectionSkeleton from '../components/home/FeaturesSectionSkeleton';
import TestimonialsSectionSkeleton from '../components/home/TestimonialsSectionSkeleton';
import CTASectionSkeleton from '../components/home/CTASectionSkeleton';

// Lazy loading des composants
const HeroSection = React.lazy(() => import('../components/home/HeroSection'));
const FeaturesSection = React.lazy(() => import('../components/home/FeaturesSection'));
const TestimonialsSection = React.lazy(() => import('../components/home/TestimonialsSection'));
const CTASection = React.lazy(() => import('../components/home/CTASection'));

/**
 * Page d'accueil optimisée SEO pour MDtoPDF Pro
 * Contient toutes les métadonnées et contenu optimisé pour le référencement
 */
const HomePage: React.FC = () => {
  return (
    <>
      <Helmet
        title="MDtoPDF Pro - Convertisseur Markdown vers PDF Professionnel | Export PDF, HTML, DOCX"
        description="Convertissez vos fichiers Markdown en PDF, HTML, DOCX avec MDtoPDF Pro. Prévisualisation en temps réel, templates personnalisables, export multi-formats. Interface moderne et accessible."
        keywords="markdown to pdf, convertisseur markdown, export pdf, html export, docx export, markdown editor, pdf generator, document converter, markdown processor"
        canonical="https://mdtopdf-pro.app/"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "MDtoPDF Pro",
          "description": "Convertisseur Markdown vers PDF professionnel avec prévisualisation en temps réel et export multi-formats",
          "url": "https://mdtopdf-pro.app",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "featureList": [
            "Conversion Markdown vers PDF haute qualité",
            "Export multi-formats (PDF, HTML, DOCX, MD)",
            "Prévisualisation en temps réel",
            "Templates personnalisables",
            "Interface accessible avec raccourcis clavier",
            "Support de la pagination avancée",
            "Import de fichiers Markdown",
            "Génération de documents professionnels"
          ],
          "screenshot": "https://mdtopdf-pro.app/images/screenshot.webp",
          "author": {
            "@type": "Organization",
            "name": "MDtoPDF Pro Team"
          }
        }}
      />

      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<FeaturesSectionSkeleton />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<TestimonialsSectionSkeleton />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<CTASectionSkeleton />}>
        <CTASection />
      </Suspense>
    </>
  );
};

export default HomePage;
