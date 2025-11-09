import React from 'react';
import Helmet from '../components/seo/Helmet';

/**
 * Page FAQ avec données structurées Schema.org
 * Optimisée pour le SEO avec FAQPage schema
 */
const FAQPage: React.FC = () => {
  const faqData = [
    {
      question: "Comment convertir un fichier Markdown en PDF ?",
      answer: "Il suffit de coller votre contenu Markdown dans l'éditeur, de choisir vos options de formatage (taille de page, marges, etc.), puis de cliquer sur 'Exporter en PDF'. La prévisualisation en temps réel vous permet de voir le résultat avant l'export."
    },
    {
      question: "Quels formats d'export sont supportés ?",
      answer: "MDtoPDF Pro supporte l'export vers plusieurs formats : PDF (haute qualité), HTML, DOCX (Microsoft Word), et Markdown brut. Chaque format est optimisé pour garantir la meilleure qualité possible."
    },
    {
      question: "Puis-je personnaliser l'apparence de mes documents PDF ?",
      answer: "Oui ! Vous pouvez choisir parmi plusieurs templates prédéfinis, personnaliser les couleurs, polices, marges, et même créer vos propres thèmes. L'interface vous permet d'ajuster tous les aspects visuels de votre document."
    },
    {
      question: "Y a-t-il une limite de taille pour les documents ?",
      answer: "L'application supporte des documents jusqu'à 50MB et peut générer des PDF de plusieurs centaines de pages. Pour des documents très volumineux, nous recommandons de les diviser en sections plus petites pour une meilleure performance."
    },
    {
      question: "L'application fonctionne-t-elle hors ligne ?",
      answer: "Oui, une fois chargée, l'application fonctionne entièrement hors ligne grâce au Service Worker. Vous pouvez travailler sur vos documents sans connexion internet, et l'export fonctionnera normalement."
    },
    {
      question: "Comment importer un fichier Markdown existant ?",
      answer: "Utilisez le bouton 'Importer' dans l'interface. Vous pouvez glisser-déposer votre fichier .md ou .markdown directement dans la zone d'import, ou utiliser le sélecteur de fichiers. Le contenu sera automatiquement chargé dans l'éditeur."
    },
    {
      question: "Les raccourcis clavier sont-ils supportés ?",
      answer: "Oui ! L'application propose de nombreux raccourcis clavier : Ctrl+B (gras), Ctrl+I (italique), Ctrl+K (lien), Ctrl+Enter (saut de page), etc. Appuyez sur F1 ou '?' pour afficher l'aide complète des raccourcis."
    },
    {
      question: "Puis-je utiliser MDtoPDF Pro sur mobile ?",
      answer: "L'application est responsive et fonctionne sur tous les appareils, mais l'expérience optimale est sur ordinateur de bureau ou tablette. L'interface s'adapte automatiquement à la taille de votre écran."
    },
    {
      question: "Mes documents sont-ils sécurisés ?",
      answer: "Oui, absolument. Tout le traitement se fait localement dans votre navigateur. Vos documents ne sont jamais envoyés sur nos serveurs. La confidentialité et la sécurité de vos données sont notre priorité."
    },
    {
      question: "Comment créer des documents multi-pages ?",
      answer: "Utilisez la syntaxe <!-- pagebreak --> pour insérer des sauts de page explicites dans votre contenu Markdown. L'application détectera automatiquement ces marqueurs et créera des pages séparées dans le PDF final."
    }
  ];

  return (
    <>
      <Helmet
        title="FAQ - Questions Fréquentes | MDtoPDF Pro"
        description="Trouvez les réponses à vos questions sur MDtoPDF Pro : conversion Markdown, export PDF, templates, raccourcis clavier, et bien plus. Guide complet pour utiliser l'application efficacement."
        keywords="faq mdtopdf, questions fréquentes, aide markdown pdf, support convertisseur, guide utilisateur, tutoriel mdtopdf"
        canonical="https://mdtopdf-pro.app/faq"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        }}
      />

      {/* Header de la page FAQ */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Questions Fréquentes
          </h1>
          <p style={{
            fontSize: '1.25rem',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Tout ce que vous devez savoir sur MDtoPDF Pro pour convertir vos documents Markdown en PDF professionnels.
          </p>
        </div>
      </section>

      {/* Contenu FAQ */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gap: '2rem' }}>
            {faqData.map((faq, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }}
              >
                <details style={{ width: '100%' }}>
                  <summary style={{
                    padding: '1.5rem',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backgroundColor: '#f8fafc',
                    border: 'none',
                    outline: 'none',
                    position: 'relative'
                  }}>
                    {faq.question}
                    <span style={{
                      position: 'absolute',
                      right: '1.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '1.25rem',
                      transition: 'transform 0.2s'
                    }}>
                      ▼
                    </span>
                  </summary>
                  <div style={{
                    padding: '0 1.5rem 1.5rem',
                    color: '#6b7280',
                    lineHeight: '1.6'
                  }}>
                    {faq.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section contact/support */}
      <section style={{
        backgroundColor: 'white',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: '#1f2937'
          }}>
            Vous n'avez pas trouvé votre réponse ?
          </h2>

          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Notre équipe de support est là pour vous aider. Consultez notre documentation complète
            ou contactez-nous directement.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/docs"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-block',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              📚 Documentation complète
            </a>

            <a
              href="/contact"
              style={{
                backgroundColor: 'transparent',
                color: '#2563eb',
                padding: '1rem 2rem',
                border: '2px solid #2563eb',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-block',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#2563eb';
              }}
            >
              💬 Nous contacter
            </a>
          </div>
        </div>
      </section>

      {/* Styles CSS pour les détails */}
      <style>{`
        details {
          width: 100%;
        }

        details summary {
          list-style: none;
        }

        details summary::-webkit-details-marker {
          display: none;
        }

        details[open] summary span {
          transform: translateY(-50%) rotate(180deg);
        }

        details summary:focus {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
};

export default FAQPage;
