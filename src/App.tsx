import { Outlet, Link } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import Header from "./components/modules/Header";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff'
    }}>
      {/* Header unifié avec navigation globale */}
      <Header
        title="MDtoPDF Pro"
        isDarkMode={isDarkMode}
        mode="global"
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Contenu principal avec structure sémantique */}
      <main role="main" style={{ flex: 1 }}>
        <Suspense fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            fontSize: '1.1rem',
            color: '#6b7280'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              Chargement du contenu...
            </div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>

      {/* Footer SEO-friendly */}
      <footer style={{
        backgroundColor: '#1f2937',
        color: '#9ca3af',
        padding: '2rem 2rem 1rem',
        marginTop: 'auto'
      }} role="contentinfo">
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <h3 style={{
              color: 'white',
              marginBottom: '1rem',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              MDtoPDF Pro
            </h3>
            <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
              Convertisseur Markdown vers PDF professionnel avec prévisualisation en temps réel,
              templates personnalisables et export multi-formats.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://github.com/patgarcia66240-cmd/mdtopdf"
                 style={{ color: '#9ca3af', textDecoration: 'none' }}
                 aria-label="GitHub - Code source">
                GitHub
              </a>
              <a href="/sitemap.xml"
                 style={{ color: '#9ca3af', textDecoration: 'none' }}
                 aria-label="Plan du site">
                Sitemap
              </a>
            </div>
          </div>

          <div>
            <h4 style={{
              color: 'white',
              marginBottom: '1rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Fonctionnalités
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Conversion Markdown → PDF
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/templates" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Templates personnalisables
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/exports" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Historique d'exports
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{
              color: 'white',
              marginBottom: '1rem',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Support
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/docs" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Documentation
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/faq" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  FAQ
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="/contact" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #374151',
          marginTop: '2rem',
          paddingTop: '1rem',
          textAlign: 'center',
          fontSize: '0.875rem'
        }}>
          <p>&copy; 2025 MDtoPDF Pro. Tous droits réservés. | Version 1.0.0</p>
        </div>
      </footer>

      {/* Styles CSS pour l'animation de chargement */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
