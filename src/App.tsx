import { Outlet, Link } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import Header from "./components/modules/Header";
import Footer from "./components/Footer";

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
      <Footer />

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
