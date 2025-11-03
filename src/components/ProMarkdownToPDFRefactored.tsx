import React, { useRef, useState } from 'react';
import { SunIcon, MoonIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import MarkdownEditor from './modules/MarkdownEditor';
import PDFControlPanel from './modules/PDFControlPanel';
import PDFPreview from './modules/PDFPreview';
import TemplateSelector from './modules/TemplateSelector';
import ExportPanel from './modules/ExportPanel';
import { usePDFExport } from '../hooks/usePDFExport';
import { useTemplates } from '../hooks/useTemplates';
import { PDFOptions } from '../types/app';

const ProMarkdownToPDFRefactored: React.FC = () => {
  const markdownRef = useRef<HTMLDivElement>(null);
  const { templates, selectedTemplate, setSelectedTemplate } = useTemplates();
  const { exportToPDF, exportToHTML, exportToMarkdown, exportToDOCX, isExporting } = usePDFExport();

  // États
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [markdown, setMarkdown] = useState(`# 📚 Document Test sur 3 Pages 📄

## Page 1: Introduction et Présentation 🎯

Bienvenue dans ce document de test ! 🚀

### 📋 Objectifs
- Tester la pagination sur 3 pages
- Vérifier l'affichage des émojis 😊
- Valider le rendu des différents éléments

### 🎨 Contenu varié
Voici différents types de contenu pour tester :

**Texte en gras** et *texte en italique* avec des émojis ! 🌟

Premier saut de ligne manuel ! 👋

Deuxième saut de ligne ! 🎉

### 📊 Tableau de données
| Nom | Rôle | Statut |
|------|------|---------|
| Alice | Développeuse | ✅ Active |
| Bob | Designer | 🎨 En création |
| Charlie | Manager | 📋 Planning |

### 🎯 Points importants à considérer
- Lorem ipsum dolor sit amet, consectetur adipiscing elit
- Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
- Ut enim ad minim veniam, quis nostrud exercitation ullamco
- Duis aute irure dolor in reprehenderit in voluptate velit esse
- Excepteur sint occaecat cupidatat non proident sunt in culpa

### 📝 Contenu additionnel pour la page 1
Ceci est du contenu supplémentaire pour s'assurer que la première page est bien remplie et que le saut de page fonctionne correctement.

Plus de texte pour remplir l'espace :
- Item 1 avec description détaillée
- Item 2 avec information complémentaire
- Item 3 avec données techniques
- Item 4 avec spécifications importantes

Fin de la première page ! 📖

<!-- pagebreak -->

## Page 2: Contenu Avancé 🔧

### 💻 Code et Exemples
Voici un exemple de code :

\`\`\`javascript
function bonjour() {
    console.log("Hello World! 🌍");
    return "Test réussi ! ✅";
}

function calculerSomme(a, b) {
    return a + b;
}

const resultat = calculerSomme(5, 3);
console.log(\`Résultat: \${resultat}\`);
\`\`\`

### 📝 Listes diverses
Liste à puces avec émojis :
- 🍎 Pommes rouges et juteuses
- 🍊 Oranges pleines de vitamines
- 🍌 Bananes douces et énergisantes
- 🍇 Raisins frais et croquants
- 🍓 Fraises des bois savoureuses
- 🥑 Avocats crémeux et nutritifs

Liste numérotée :
1. Premier élément avec beaucoup de détails 🥇
2. Deuxième élément avec informations complémentaires 🥈
3. Troisième élément avec caractéristiques spéciales 🥉
4. Quatrième élément avec options avancées
5. Cinquième élément avec paramètres configurables

### 🎯 Citations et Mises en garde
> "La technologie est meilleure quand elle améliore la vie des gens de manière significative et durable." 💡

⚠️ **Attention :** Ceci est un test d'avertissement important qui doit être bien visible sur la deuxième page !

### 📊 Données et statistiques
- Performance : 95% d'efficacité
- Satisfaction : 4.8/5 étoiles
- Utilisateurs : +10,000 actifs
- Disponibilité : 99.9% uptime

Milieu du document ! 🎪

<!-- pagebreak -->

## Page 3: Conclusion et Annexes 📋

### 🏆 Résumé des points clés
- ✅ Pagination fonctionnelle sur 3 pages distinctes
- ✅ Émojis bien affichés et interprétés
- ✅ Tableaux correctement rendus avec bordures
- ✅ Code et formatage préservés
- ✅ Sauts de page explicites avec

### 🎁 Bonus: Émojis variés
Testons différents émojis : 😎 🎈 🎭 🎪 🎨 🎬 🎮 🎯 🎲 🎁 🎉 🎊 🎈 🎆 🎇 🧨 ✨ 🌟 💫 ⭐ 🌠 🚀 🌙 ⭐ 🌈 🔥 💧 ❄️ ⚡ 🌪️ 🌪️

### 📊 Tableau complexe
| Produit | Prix | Stock | Notes | Évaluation |
|---------|------|-------|-------|------------|
| 📱 Téléphone Pro | 699€ | 🔴 | En rupture | ⭐⭐⭐⭐⭐ |
| 💻 Ordinateur | 1299€ | 🟢 | Disponible | ⭐⭐⭐⭐ |
| 🎧 Écouteurs | 199€ | 🟡 | Stock limité | ⭐⭐⭐⭐⭐ |
| ⌚ Montre | 399€ | 🟢 | Nouveauté | ⭐⭐⭐⭐ |
| 📷 Appareil photo | 899€ | 🟢 | Populaire | ⭐⭐⭐⭐⭐ |
| 🎮 Console | 499€ | 🔴 | Attendue | ⭐⭐⭐⭐ |

### 📝 Conclusion finale
Merci d'avoir testé ce document sur 3 pages avec des sauts de page explicites ! 🙏

### 🔄 Instructions finales
- Le saut de page utilise
- Chaque page devrait être distincte dans l'aperçu
- Les tableaux, émojis et formatage sont préservés
- Le mode "all" affiche toutes les pages simultanément

**Fin du document complet** 📚✨

Dernier saut de ligne avant la fin absolue ! 👋🎉🚀

Texte **gras**, texte *italique* et \`code en ligne\`.

#### Listes
- Item de liste simple
- Item avec **texte en gras**
  - Sous-item

1. Liste numérotée
2. Deuxième item

#### Tableau

| Nom | Âge | Ville |
|-----|-----|-------|
| Alice | 25 | Paris |
| Bob | 30 | Lyon |

> "Ceci est une citation exemple"

---`);

  const [fileName, setFileName] = useState('document');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewTheme, setPreviewTheme] = useState('modern');
  const [previewZoom, setPreviewZoom] = useState(100);

  const [pdfOptions, setPdfOptions] = useState<PDFOptions>({
    format: 'a4',
    orientation: 'portrait',
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },
    fontSize: 12,
    fontFamily: 'Inter'
  });

  // Calcul des statistiques
  const stats = {
    wordCount: markdown.split(/\s+/).filter(word => word.length > 0).length,
    charCount: markdown.length,
    lineCount: markdown.split('\n').length
  };

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    transition: 'all 0.3s ease'
  };

  const headerStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    padding: '16px 24px',
    borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const navigationStyle = {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  };

  const navButtonStyle = (isActive: boolean) => ({
    padding: '8px 16px',
    backgroundColor: isActive
      ? (isDarkMode ? '#3b82f6' : '#2563eb')
      : (isDarkMode ? '#374151' : '#f1f5f9'),
    color: isActive ? '#ffffff' : (isDarkMode ? '#f1f5f9' : '#374151'),
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  const themeButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: isDarkMode ? '#374151' : '#f1f5f9',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '8px',
    color: isDarkMode ? '#f1f5f9' : '#374151',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const mainContentStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    padding: '24px',
    maxWidth: '1600px',
    margin: '0 auto'
  };

  const leftPanelStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px'
  };

  const rightPanelStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px'
  };

  // Handlers
  const handleExportPDF = async () => {
    if (!markdownRef.current) return;

    try {
      await exportToPDF(markdownRef, fileName, pdfOptions);
    } catch (error) {
      console.error('Export PDF failed:', error);
    }
  };

  const handleExportHTML = () => {
    exportToHTML(markdown, fileName);
  };

  const handleExportMD = () => {
    exportToMarkdown(markdown, fileName);
  };

  const handleExportDOCX = () => {
    exportToDOCX(markdown, fileName);
  };

  const handleCreateTemplate = () => {
    console.log('Création d\'un nouveau template - fonctionnalité à implémenter');
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleStyle}>
          <RocketLaunchIcon style={{ width: '28px', height: '28px' }} />
          MDtoPDF Pro
        </div>

        <div style={navigationStyle}>
          <button
            style={navButtonStyle(!showTemplates && !showExport)}
            onClick={() => {
              setShowTemplates(false);
              setShowExport(false);
            }}
          >
            Éditeur
          </button>
          <button
            style={navButtonStyle(showTemplates)}
            onClick={() => {
              setShowTemplates(true);
              setShowExport(false);
            }}
          >
            Templates
          </button>
          <button
            style={navButtonStyle(showExport)}
            onClick={() => {
              setShowTemplates(false);
              setShowExport(true);
            }}
          >
            Export
          </button>

          <button
            style={themeButtonStyle}
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <>
                <SunIcon style={{ width: '16px', height: '16px' }} />
                Clair
              </>
            ) : (
              <>
                <MoonIcon style={{ width: '16px', height: '16px' }} />
                Sombre
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={leftPanelStyle}>
          {!showTemplates && !showExport && (
            <>
              <PDFControlPanel
                pdfOptions={pdfOptions}
                onOptionsChange={setPdfOptions}
                fileName={fileName}
                onFileNameChange={setFileName}
                onExportPDF={handleExportPDF}
                previewTheme={previewTheme}
                onThemeChange={setPreviewTheme}
                previewZoom={previewZoom}
                onZoomChange={setPreviewZoom}
                isDarkMode={isDarkMode}
              />

              <MarkdownEditor
                markdown={markdown}
                onChange={setMarkdown}
                showPreview={false}
                onTogglePreview={() => setShowPreview(!showPreview)}
                isDarkMode={isDarkMode}
              />
            </>
          )}

          {showTemplates && (
            <TemplateSelector
              templates={templates}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
              onCreateTemplate={handleCreateTemplate}
              isDarkMode={isDarkMode}
            />
          )}

          {showExport && (
            <ExportPanel
              onExportPDF={handleExportPDF}
              onExportHTML={handleExportHTML}
              onExportMD={handleExportMD}
              onExportDOCX={handleExportDOCX}
              wordCount={stats.wordCount}
              charCount={stats.charCount}
              lineCount={stats.lineCount}
              isDarkMode={isDarkMode}
              isExporting={isExporting}
            />
          )}
        </div>

        <div style={rightPanelStyle}>
          {!showTemplates && !showExport && (
            <PDFPreview
              ref={markdownRef}
              markdown={markdown}
              previewTheme={previewTheme}
              previewZoom={previewZoom}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProMarkdownToPDFRefactored;
