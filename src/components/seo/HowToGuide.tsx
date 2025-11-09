import React from 'react';
import Helmet from './Helmet';

/**
 * Composant HowTo avec données structurées Schema.org
 * Optimisé pour les guides d'utilisation et tutoriels
 */
interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

interface HowToGuideProps {
  title: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
  supply?: string[];
  tool?: string[];
  image?: string;
  video?: {
    name: string;
    description: string;
    thumbnailUrl: string;
    uploadDate: string;
    duration: string;
    contentUrl: string;
    embedUrl: string;
  };
}

/**
 * Génère les données structurées HowTo pour Schema.org
 */
const generateHowToStructuredData = (props: HowToGuideProps) => {
  const {
    title,
    description,
    steps,
    totalTime,
    estimatedCost,
    supply,
    tool,
    image,
    video
  } = props;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "image": image,
    "totalTime": totalTime,
    "estimatedCost": estimatedCost ? {
      "@type": "MonetaryAmount",
      "currency": estimatedCost.currency,
      "value": estimatedCost.value
    } : undefined,
    "supply": supply?.map(item => ({
      "@type": "HowToSupply",
      "name": item
    })),
    "tool": tool?.map(item => ({
      "@type": "HowToTool",
      "name": item
    })),
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "image": step.image,
      "url": step.url
    })),
    "video": video ? {
      "@type": "VideoObject",
      "name": video.name,
      "description": video.description,
      "thumbnailUrl": video.thumbnailUrl,
      "uploadDate": video.uploadDate,
      "duration": video.duration,
      "contentUrl": video.contentUrl,
      "embedUrl": video.embedUrl
    } : undefined
  };
};

const HowToGuide: React.FC<HowToGuideProps> = (props) => {
  const { title, description, steps, totalTime, estimatedCost, image } = props;

  // Générer les métadonnées SEO
  const seoTitle = `${title} - Guide Complet | MDtoPDF Pro`;
  const seoDescription = description.length > 160 ? `${description.substring(0, 157)}...` : description;

  return (
    <>
      <Helmet
        title={seoTitle}
        description={seoDescription}
        keywords={`tutoriel, guide, how-to, ${title.toLowerCase()}, mdtopdf, markdown, pdf, conversion`}
        ogType="article"
        structuredData={generateHowToStructuredData(props)}
      />

      {/* Header du guide */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            {title}
          </h1>

          <p style={{
            fontSize: '1.25rem',
            opacity: 0.9,
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            {description}
          </p>

          {/* Métadonnées du guide */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            fontSize: '0.875rem',
            opacity: 0.8
          }}>
            {totalTime && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⏱️</span>
                <span>{totalTime}</span>
              </div>
            )}

            {estimatedCost && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>💰</span>
                <span>{estimatedCost.value} {estimatedCost.currency}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📋</span>
              <span>{steps.length} étapes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu du guide */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Étapes numérotées */}
          <div style={{ display: 'grid', gap: '2rem' }}>
            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }}
                itemProp="step"
                itemScope
                itemType="https://schema.org/HowToStep"
              >
                {/* En-tête de l'étape */}
                <div style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '2rem',
                    height: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {index + 1}
                  </div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '1.25rem',
                      fontWeight: '600'
                    }}
                    itemProp="name"
                  >
                    {step.name}
                  </h2>
                </div>

                {/* Contenu de l'étape */}
                <div style={{ padding: '1.5rem' }}>
                  {step.image && (
                    <img
                      src={step.image}
                      alt={`Illustration de l'étape ${index + 1}: ${step.name}`}
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: 'auto',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      itemProp="image"
                    />
                  )}

                  <div
                    style={{
                      color: '#4b5563',
                      lineHeight: '1.7',
                      fontSize: '1rem'
                    }}
                    itemProp="text"
                    dangerouslySetInnerHTML={{ __html: step.text }}
                  />

                  {step.url && (
                    <div style={{ marginTop: '1rem' }}>
                      <a
                        href={step.url}
                        style={{
                          color: '#2563eb',
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                        itemProp="url"
                      >
                        🔗 Voir plus de détails
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Section conseils supplémentaires */}
          <div style={{
            backgroundColor: '#e0f2fe',
            border: '1px solid #0ea5e9',
            borderRadius: '0.75rem',
            padding: '2rem',
            marginTop: '3rem'
          }}>
            <h3 style={{
              color: '#0c4a6e',
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              💡 Conseils pour réussir
            </h3>

            <ul style={{
              color: '#0c4a6e',
              margin: 0,
              paddingLeft: '1.5rem',
              lineHeight: '1.6'
            }}>
              <li>Prenez votre temps à chaque étape pour éviter les erreurs</li>
              <li>Vérifiez toujours votre travail avec l'aperçu avant l'export final</li>
              <li>Sauvegardez régulièrement votre contenu pendant l'édition</li>
              <li>Utilisez les raccourcis clavier pour gagner du temps</li>
              <li>En cas de problème, consultez notre FAQ ou contactez le support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call-to-action */}
      <section style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem'
          }}>
            Prêt à essayer ?
          </h2>

          <p style={{
            fontSize: '1.125rem',
            opacity: 0.9,
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Maintenant que vous connaissez le processus, mettez-le en pratique
            avec notre convertisseur Markdown vers PDF.
          </p>

          <a
            href="/converter"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              display: 'inline-block',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            🚀 Commencer maintenant
          </a>
        </div>
      </section>
    </>
  );
};

/**
 * Guide prédéfini : "Comment convertir Markdown en PDF"
 */
export const MarkdownToPDFGuide: React.FC = () => {
  const steps: HowToStep[] = [
    {
      name: "Préparer votre contenu Markdown",
      text: `
        <p>Créez ou ouvrez votre fichier Markdown (.md ou .markdown). Assurez-vous que votre contenu utilise la syntaxe Markdown standard :</p>
        <ul>
          <li><code># Titre</code> pour les titres</li>
          <li><code>**gras**</code> pour le texte en gras</li>
          <li><code>*italique*</code> pour le texte en italique</li>
          <li><code>[lien](url)</code> pour les liens</li>
          <li><code>![alt](image.jpg)</code> pour les images</li>
        </ul>
        <p>Utilisez <code><!-- pagebreak --></code> pour créer des sauts de page explicites dans votre PDF.</p>
      `
    },
    {
      name: "Accéder au convertisseur",
      text: `
        <p>Rendez-vous sur la page du convertisseur MDtoPDF Pro. Vous pouvez y accéder via :</p>
        <ul>
          <li>Le menu de navigation : "Convertisseur"</li>
          <li>Le bouton "Commencer maintenant" sur la page d'accueil</li>
          <li>L'URL directe : /converter</li>
        </ul>
        <p>L'interface se charge automatiquement et est prête à l'emploi.</p>
      `
    },
    {
      name: "Coller ou importer votre contenu",
      text: `
        <p>Deux méthodes pour ajouter votre contenu :</p>
        <ol>
          <li><strong>Copier-coller :</strong> Sélectionnez tout votre texte Markdown et collez-le dans l'éditeur</li>
          <li><strong>Importer un fichier :</strong> Cliquez sur "Importer" et sélectionnez votre fichier .md</li>
        </ol>
        <p>L'éditeur prend automatiquement en charge l'importation et l'affichage de votre contenu.</p>
      `
    },
    {
      name: "Configurer les options d'export",
      text: `
        <p>Avant l'export, personnalisez votre PDF :</p>
        <ul>
          <li><strong>Format de page :</strong> A4, A3, Letter, etc.</li>
          <li><strong>Marges :</strong> Ajustez les marges haut, bas, gauche, droite</li>
          <li><strong>Orientation :</strong> Portrait ou Paysage</li>
          <li><strong>Police et taille :</strong> Choisissez la typographie</li>
          <li><strong>Template :</strong> Sélectionnez un style prédéfini</li>
        </ul>
        <p>Utilisez l'aperçu en temps réel pour voir vos modifications instantanément.</p>
      `
    },
    {
      name: "Prévisualiser et ajuster",
      text: `
        <p>Utilisez le panneau d'aperçu pour vérifier :</p>
        <ul>
          <li>La mise en page et la pagination</li>
          <li>Le rendu des éléments Markdown</li>
          <li>La qualité des images et tableaux</li>
          <li>L'apparence générale du document</li>
        </ul>
        <p>Ajustez le zoom et naviguez entre les pages pour un contrôle complet.</p>
      `
    },
    {
      name: "Exporter votre PDF",
      text: `
        <p>Une fois satisfait du résultat :</p>
        <ol>
          <li>Cliquez sur "Exporter en PDF"</li>
          <li>Choisissez le nom de votre fichier</li>
          <li>Sélectionnez l'emplacement de sauvegarde</li>
          <li>Le PDF se télécharge automatiquement</li>
        </ol>
        <p>Le processus prend généralement moins de 30 secondes pour des documents standards.</p>
      `
    }
  ];

  return (
    <HowToGuide
      title="Comment convertir Markdown en PDF"
      description="Guide complet pour transformer vos documents Markdown en PDF professionnels avec MDtoPDF Pro. Apprenez à utiliser toutes les fonctionnalités en 6 étapes simples."
      steps={steps}
      totalTime="PT10M"
      estimatedCost={{
        currency: "EUR",
        value: "0"
      }}
      tool={["Navigateur web moderne", "Fichier Markdown"]}
      image="/images/guide-markdown-pdf.webp"
    />
  );
};

export default HowToGuide;
