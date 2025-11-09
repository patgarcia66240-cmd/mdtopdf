import React from 'react';
import { Link } from '@tanstack/react-router';
import Helmet from '../components/seo/Helmet';

/**
 * Page 404 optimisée SEO avec gestion d'erreur élégante
 */
const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet
        title="Page non trouvée (404) | MDtoPDF Pro"
        description="La page que vous recherchez n'existe pas. Retournez à l'accueil de MDtoPDF Pro pour convertir vos documents Markdown en PDF."
        keywords="404, page non trouvée, erreur, mdtopdf, markdown to pdf"
        canonical="https://mdtopdf-pro.app/404"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page non trouvée - MDtoPDF Pro",
          "description": "Erreur 404 - La page demandée n'existe pas",
          "url": "https://mdtopdf-pro.app/404",
          "isPartOf": {
            "@type": "WebSite",
            "name": "MDtoPDF Pro",
            "url": "https://mdtopdf-pro.app"
          }
        }}
      />

      {/* Header avec design cohérent */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          {/* Illustration 404 */}
          <div style={{
            fontSize: '8rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
            opacity: 0.8,
            lineHeight: '1'
          }}>
            404
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Oups ! Page non trouvée
          </h1>

          <p style={{
            fontSize: '1.25rem',
            opacity: 0.9,
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            La page que vous recherchez semble avoir disparu dans le cyberespace.
            Ne vous inquiétez pas, votre contenu Markdown est toujours en sécurité !
          </p>

          {/* Actions principales */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/"
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
              🏠 Retour à l'accueil
            </Link>

            <Link
              to="/converter"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '1rem 2rem',
                border: '2px solid white',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                display: 'inline-block',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = '#fbbf24';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'white';
              }}
            >
              📄 Aller au convertisseur
            </Link>
          </div>
        </div>
      </section>

      {/* Section d'aide */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#1f2937'
          }}>
            Vous cherchez peut-être...
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#1f2937'
              }}>
                Convertir du Markdown
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                Utilisez notre convertisseur pour transformer vos documents Markdown en PDF professionnels.
              </p>
              <Link
                to="/converter"
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Accéder au convertisseur →
              </Link>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#1f2937'
              }}>
                Templates personnalisables
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                Découvrez notre collection de templates professionnels pour personnaliser vos documents.
              </p>
              <Link
                to="/templates"
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Voir les templates →
              </Link>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❓</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#1f2937'
              }}>
                Questions fréquentes
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                Trouvez des réponses à vos questions dans notre FAQ complète.
              </p>
              <Link
                to="/faq"
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Consulter la FAQ →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section SEO avec liens internes */}
      <section style={{ padding: '2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            Liens utiles
          </h3>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Accueil
            </Link>
            <Link to="/converter" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Convertisseur
            </Link>
            <Link to="/templates" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Templates
            </Link>
            <Link to="/exports" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Exports
            </Link>
            <Link to="/settings" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Paramètres
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFoundPage;
