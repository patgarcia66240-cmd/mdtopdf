import React, { useState } from 'react';

interface KeyboardShortcut {
  keys: string[];
  description: string;
  category: 'navigation' | 'edition' | 'action' | 'focus';
}

interface KeyboardShortcutsHelpProps {
  isDarkMode: boolean;
  onClose: () => void;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ isDarkMode, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const shortcuts: KeyboardShortcut[] = [
    // Navigation
    { keys: ['Alt + 1'], description: 'Aller à l\'éditeur', category: 'navigation' },
    { keys: ['Alt + 2'], description: 'Aller à l\'importation', category: 'navigation' },
    { keys: ['Alt + 3'], description: 'Aller aux templates', category: 'navigation' },
    { keys: ['Alt + 4'], description: 'Aller aux exports', category: 'navigation' },
    { keys: ['Tab', 'Shift + Tab'], description: 'Naviguer entre les éléments', category: 'navigation' },
    { keys: ['↑', '↓', '←', '→'], description: 'Navigation dans les listes', category: 'navigation' },

    // Édition
    { keys: ['Ctrl + S'], description: 'Sauvegarder/Exporter en PDF', category: 'edition' },
    { keys: ['Ctrl + E'], description: 'Exporter', category: 'edition' },
    { keys: ['Ctrl + P'], description: 'Basculer l\'aperçu', category: 'edition' },
    { keys: ['Ctrl + Z'], description: 'Annuler', category: 'edition' },
    { keys: ['Ctrl + Y'], description: 'Refaire', category: 'edition' },
    { keys: ['Ctrl + B'], description: 'Mettre en gras', category: 'edition' },
    { keys: ['Ctrl + I'], description: 'Mettre en italique', category: 'edition' },

    // Actions
    { keys: ['Ctrl + Shift + S'], description: 'Basculer le thème sombre', category: 'action' },
    { keys: ['Ctrl + Shift + E'], description: 'Ouvrir l\'export avancé', category: 'action' },
    { keys: ['Échap'], description: 'Fermer les panneaux', category: 'action' },
    { keys: ['Entrée', 'Espace'], description: 'Activer les boutons/liens', category: 'action' },

    // Focus
    { keys: ['F1'], description: 'Aller au premier élément', category: 'focus' },
    { keys: ['F6'], description: 'Aller à l\'éditeur', category: 'focus' },
    { keys: ['F7'], description: 'Aller à l\'aperçu', category: 'focus' },
    { keys: ['F12'], description: 'Aller au dernier élément', category: 'focus' },
    { keys: ['Home'], description: 'Début de liste', category: 'focus' },
    { keys: ['End'], description: 'Fin de liste', category: 'focus' }
  ];

  const categories = [
    { id: 'navigation', name: 'Navigation', icon: '🧭' },
    { id: 'edition', name: 'Édition', icon: '✏️' },
    { id: 'action', name: 'Actions', icon: '⚡' },
    { id: 'focus', name: 'Focus', icon: '🎯' }
  ];

  const filteredShortcuts = shortcuts.filter(shortcut => {
    const matchesSearch = shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.keys.some(key => key.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || shortcut.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '80vh',
    overflow: 'auto',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: isDarkMode ? '#f1f5f9' : '#1e293b'
  };

  const searchStyle = {
    width: '100%',
    padding: '12px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '8px',
    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    fontSize: '14px',
    marginBottom: '16px'
  };

  const categoryTabsStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const
  };

  const categoryButtonStyle = (isActive: boolean) => ({
    padding: '8px 16px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderRadius: '6px',
    backgroundColor: isActive
      ? (isDarkMode ? '#3b82f6' : '#2563eb')
      : (isDarkMode ? '#0f172a' : '#f8fafc'),
    color: isActive
      ? '#ffffff'
      : (isDarkMode ? '#f1f5f9' : '#1e293b'),
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  });

  const shortcutsListStyle = {
    display: 'grid',
    gap: '12px'
  };

  const shortcutItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    borderRadius: '8px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`
  };

  const keysContainerStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  };

  const keyStyle = {
    padding: '4px 8px',
    backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
    fontWeight: 'bold',
    color: isDarkMode ? '#f3f4f6' : '#111827',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={containerStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>⌨️ Raccourcis Clavier</h2>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Fermer l'aide des raccourcis clavier"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          placeholder="Rechercher un raccourci..."
          style={searchStyle}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Rechercher des raccourcis clavier"
        />

        <div style={categoryTabsStyle} role="tablist" aria-label="Catégories de raccourcis">
          <button
            style={categoryButtonStyle(selectedCategory === null)}
            onClick={() => setSelectedCategory(null)}
            role="tab"
            aria-selected={selectedCategory === null}
            aria-label="Afficher tous les raccourcis"
          >
            📋 Tous
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              style={categoryButtonStyle(selectedCategory === category.id)}
              onClick={() => setSelectedCategory(category.id)}
              role="tab"
              aria-selected={selectedCategory === category.id}
              aria-label={`Catégorie ${category.name}`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        <div style={shortcutsListStyle} role="list" aria-label="Liste des raccourcis clavier">
          {filteredShortcuts.map((shortcut, index) => (
            <div
              key={index}
              style={shortcutItemStyle}
              role="listitem"
              aria-label={`${shortcut.description}: ${shortcut.keys.join(', ')}`}
            >
              <span style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                {shortcut.description}
              </span>
              <div style={keysContainerStyle}>
                {shortcut.keys.map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    {keyIndex > 0 && <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', margin: '0 4px' }}>ou</span>}
                    <span style={keyStyle}>{key}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredShortcuts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: isDarkMode ? '#9ca3af' : '#6b7280'
          }}>
            Aucun raccourci trouvé pour "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;