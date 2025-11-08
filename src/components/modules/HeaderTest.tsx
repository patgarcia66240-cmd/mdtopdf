import React, { useState } from 'react';
import Header from './Header';
import HeaderSkeleton from './HeaderSkeleton';

const HeaderTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTabChange = (tab: 'editor' | 'import' | 'templates' | 'export') => {
    console.log('Tab changed to:', tab);
  };

  const handleAdvancedExport = () => {
    console.log('Advanced export clicked');
  };

  const toggleLoading = () => {
    setIsLoading(!isLoading);
    if (!isLoading) {
      // Simuler un chargement de 3 secondes
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <button onClick={toggleLoading} style={{ marginBottom: '20px', padding: '10px 20px' }}>
            Arrêter le chargement
          </button>
          <p>Header en chargement...</p>
        </div>
        <HeaderSkeleton isDarkMode={isDarkMode} />
        <div style={{ padding: '20px' }}>
          <p>Contenu pendant le chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
        <h1>Test du Header Skeleton</h1>
        <button onClick={toggleLoading} style={{ margin: '10px', padding: '10px 20px' }}>
          Démarrer le chargement (3 secondes)
        </button>
        <button onClick={handleToggleTheme} style={{ margin: '10px', padding: '10px 20px' }}>
          {isDarkMode ? 'Mode clair' : 'Mode sombre'}
        </button>
      </div>

      <Header
        title="MDtoPDF Pro"
        showImport={false}
        showTemplates={false}
        showExport={false}
        isDarkMode={isDarkMode}
        onTabChange={handleTabChange}
        onThemeToggle={handleToggleTheme}
        onAdvancedExport={handleAdvancedExport}
      />

      <div style={{ padding: '20px', backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
        <h2>Contenu de test</h2>
        <p>Ceci est un test pour vérifier que le skeleton fonctionne correctement.</p>
        <p>Mode actuel : {isDarkMode ? 'Sombre' : 'Clair'}</p>
      </div>
    </div>
  );
};

export default HeaderTest;