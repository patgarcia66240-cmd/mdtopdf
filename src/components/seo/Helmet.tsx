import React from 'react';

interface HelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: Record<string, any>;
}

/**
 * Composant SEO pour optimiser le référencement et les métadonnées
 */
const Helmet: React.FC<HelmetProps> = ({
  title = "MDtoPDF Pro - Convertisseur Markdown vers PDF",
  description = "Convertissez vos fichiers Markdown en PDF, HTML, DOCX avec notre outil professionnel. Interface moderne, prévisualisation en temps réel et export multi-formats.",
  keywords = "markdown, pdf, converter, export, document, mdtopdf, markdown to pdf, pdf generator",
  canonical,
  ogImage = "/images/og-image.webp",
  ogType = "website",
  structuredData
}) => {
  // Données structurées pour Google
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "MDtoPDF Pro",
    "description": description,
    "url": "https://mdtopdf-pro.app",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "MDtoPDF Pro Team"
    },
    "featureList": [
      "Conversion Markdown vers PDF",
      "Export multi-formats (PDF, HTML, DOCX, MD)",
      "Prévisualisation en temps réel",
      "Templates personnalisables",
      "Interface accessible",
      "Support du clavier"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  // Mettre à jour le titre du document
  React.useEffect(() => {
    document.title = title;
  }, [title]);

  // Mettre à jour ou créer les meta tags
  React.useEffect(() => {
    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;

    // Meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;

    // Meta viewport
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement('meta');
      metaViewport.name = 'viewport';
      metaViewport.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(metaViewport);
    }

    // Meta charset
    let metaCharset = document.querySelector('meta[charset]');
    if (!metaCharset) {
      metaCharset = document.createElement('meta');
      metaCharset.charset = 'utf-8';
      document.head.appendChild(metaCharset);
    }

    // Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: canonical || window.location.href }
    ];

    ogTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        document.head.appendChild(metaTag);
      }
      metaTag.content = tag.content;
    });

    // Twitter Card meta tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage }
    ];

    twitterTags.forEach(tag => {
      let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = tag.name;
        document.head.appendChild(metaTag);
      }
      metaTag.content = tag.content;
    });

    // Canonical URL
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = canonical;
    }

    // Structured Data
    let scriptStructuredData = document.querySelector('script[type="application/ld+json"]');
    if (!scriptStructuredData) {
      scriptStructuredData = document.createElement('script');
      scriptStructuredData.type = 'application/ld+json';
      document.head.appendChild(scriptStructuredData);
    }
    scriptStructuredData.textContent = JSON.stringify(finalStructuredData, null, 2);

    // Theme color
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = '#2563eb';

    // Manifest link
    let linkManifest = document.querySelector('link[rel="manifest"]');
    if (!linkManifest) {
      linkManifest = document.createElement('link');
      linkManifest.rel = 'manifest';
      linkManifest.href = '/manifest.json';
      document.head.appendChild(linkManifest);
    }

  }, [title, description, keywords, canonical, ogImage, ogType, finalStructuredData]);

  return null; // Ce composant ne rend rien, il modifie seulement le head
};

export default Helmet;