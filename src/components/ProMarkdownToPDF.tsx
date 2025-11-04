import React, { useRef, useState } from 'react';
import MarkdownEditor from './modules/MarkdownEditor';
import PDFControlPanel from './modules/PDFControlPanel';
import PDFPreview from './modules/PDFPreview';
import PaginationControls from './modules/PaginationControls';
import TemplateSelector from './modules/TemplateSelector';
import ExportPanel from './modules/ExportPanel';
import FileImport from './modules/FileImport';
import Header from './modules/Header';
import { usePDFExport } from '../hooks/usePDFExport';
import { useTemplates } from '../hooks/useTemplates';
import { PDFOptions } from '../types/app';

const ProMarkdownToPDFRefactored: React.FC = () => {
  const markdownRef = useRef<HTMLDivElement>(null);
  const { templates, selectedTemplate, setSelectedTemplate } = useTemplates();
  const { exportToPDF, exportToHTML, exportToMarkdown, exportToDOCX, isExporting } = usePDFExport();

  // États
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [markdown, setMarkdown] = useState(`# 📚 Document Complet sur 4 Pages 📄

## Page 1: Introduction et Vue d'Ensemble 🎯

Bienvenue dans ce document de test complet sur 4 pages ! 🚀 Ce document a été conçu pour tester toutes les fonctionnalités de pagination et de formatage de notre application MDtoPDF Pro.

### 📋 Objectifs principaux
- Tester la pagination sur 4 pages distinctes
- Vérifier l'affichage correct des émojis et caractères spéciaux
- Valider le rendu de tous les éléments Markdown
- S'assurer que les sauts de page fonctionnent parfaitement
- Tester la mise en page avec différents types de contenu

### 🎨 Types de contenu testés
Ce document contient une variété d'éléments pour validation complète :

**Formatage de texte** avec gras et italique, ainsi que du \`code en ligne\`.

### 📊 Tableau de données principal
| Équipe | Responsable | Statut | Progression | Échéance |
|--------|-------------|--------|------------|----------|
| Développement | Alice Martin | ✅ Active | 75% | 15/12/2024 |
| Design | Bob Chen | 🎨 En cours | 60% | 20/12/2024 |
| Marketing | Charlie Silva | 📋 Planning | 30% | 10/01/2025 |
| Support | Diana Kumar | 🆕 Nouveau | 10% | 05/01/2025 |
| QA | Erik Wilson | 🔍 Revue | 45% | 18/12/2024 |

### 🎯 Points techniques à considérer
- Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod
- Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
- Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
- Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
- Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia

### 📝 Contenu additionnel pour la page 1
Ceci est du contenu supplémentaire pour s'assurer que la première page est bien remplie et que tous les éléments de formatage sont correctement interprétés.

Plus de contenu pour tester l'espace disponible :
- **Élément 1** : Description détaillée avec informations techniques
- **Élément 2** : Information complémentaire avec données spécifiques
- **Élément 3** : Contenu avancé avec paramètres configurables
- **Élément 4** : Spécifications importantes pour validation

### 🔍 Test des caractères spéciaux
Support des caractères internationaux : éàèùçâêîôûäëïöüß ñ áéíóú üñ ¡¿

Fin de la première page ! Passage à la section suivante. 📖

<!-- pagebreak -->

## Page 2: Développement et Code Source 💻

### 🛠️ Exemples de code par langage

#### JavaScript/TypeScript
\`\`\`javascript
// Exemple de fonction avancée
class DocumentProcessor {
  constructor(options = {}) {
    this.options = {
      format: 'pdf',
      quality: 'high',
      ...options
    };
    this.pages = [];
  }

  async processMarkdown(content) {
    try {
      console.log("Processing markdown content... 🚀");
      const processed = await this.parseMarkdown(content);
      const pages = this.splitIntoPages(processed);

      for (const page of pages) {
        await this.renderPage(page);
      }

      return {
        success: true,
        totalPages: pages.length,
        message: "✅ Processing completed successfully!"
      };
    } catch (error) {
      console.error("❌ Processing failed:", error);
      return { success: false, error: error.message };
    }
  }

  splitIntoPages(content) {
    return content.split(/<!--\\s*pagebreak\\s*-->/gi);
  }
}

// Utilisation
const processor = new DocumentProcessor({ quality: 'ultra' });
const result = await processor.processMarkdown(markdownContent);
\`\`\`

#### Python
\`\`\`python
class PDFGenerator:
    def __init__(self, output_path="document.pdf"):
        self.output_path = output_path
        self.pages = []

    def add_page(self, content):
        """Ajoute une nouvelle page au document"""
        page = {
            'content': content,
            'page_number': len(self.pages) + 1,
            'timestamp': datetime.now()
        }
        self.pages.append(page)
        print(f"✅ Page {page['page_number']} ajoutée avec succès")

    def generate_pdf(self):
        """Génère le PDF final"""
        if not self.pages:
            raise ValueError("❌ Aucune page à générer")

        print(f"🚀 Génération du PDF avec {len(self.pages)} pages...")
        # Logique de génération PDF ici
        return True
\`\`\`

### 📝 Listes structurées avec émojis

#### Liste des priorités projet
1. 🥇 **Priorité Absolue** : Finaliser le moteur de rendu PDF
2. 🥈 **Haute Priorité** : Optimiser les performances de pagination
3. 🥉 **Priorité Moyenne** : Améliorer l'interface utilisateur
4. 📋 **Priorité Basse** : Ajouter des thèmes supplémentaires

#### Technologies utilisées
- 🍎 **Frontend** : React, TypeScript, Heroicons
- 🍊 **Backend** : Node.js, Express, Sharp
- 🍌 **PDF** : jsPDF, html2canvas
- 🍇 **Styling** : CSS-in-JS, Responsive Design
- 🍓 **Testing** : Jest, React Testing Library
- 🥑 **DevOps** : Vite, GitHub Actions, Docker

### 🎯 Citations et recommandations
> "Un bon code se lit comme de la prose, mais de la prose que même un non-programmeur peut comprendre." - Donald Knuth 💡

⚠️ **Attention importante** : Ce document teste la capacité de l'application à gérer du contenu complexe incluant du code, des tableaux, des listes et du formatage avancé sur plusieurs pages.

### 📊 Métriques de performance
- **Temps de rendu** : &lt; 500ms par page
- **Qualité d'image** : 300 DPI optimisé
- **Taille maximale** : 50MB par document
- **Pages supportées** : Jusqu'à 100 pages
- **Format de sortie** : PDF/A-1b compatible

Milieu du document ! Passons à l'analyse comparative. 🎪

<!-- pagebreak -->

## Page 3: Analyse et Comparaisons 📈

### 📊 Analyse comparative des solutions

#### Tableau comparatif des frameworks PDF
| Framework | Taille (KB) | Vitesse | Qualité | Support | Écosystème |
|-----------|-------------|---------|---------|---------|------------|
| jsPDF | 120 | ⚡ Rapide | 🟨 Moyen | ✅ Complet | 🌐 Mature |
| PDFKit | 250 | 🐢 Lent | 🟢 Élevée | ✅ Complet | 🌐 Mature |
| Puppeteer | 5000 | 🚀 Très rapide | 🟢 Élevée | ✅ Complet | 🌐 Mature |
| html2pdf | 80 | ⚡ Rapide | 🟨 Moyenne | 🟡 Limité | 🌱 Croissant |
| Notre solution | 95 | ⚡ Rapide | 🟢 Élevée | ✅ Complet | 🌱 Innovation |

### 🎨 Tests de mise en page

#### Mise en page multi-colonnes
<div style="display: flex; gap: 20px;">
<div style="flex: 1;">
**Colonne 1 : Contenu principal**

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</div>
<div style="flex: 1;">
**Colonne 2 : Contenu secondaire**

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</div>
</div>

### 🧪 Tests de compatibilité

#### Support des éléments Markdown avancés
| Élément | Support | Notes | Priorité |
|---------|---------|-------|----------|
| **Gras** | ✅ | \`**texte**\` | 🔴 Critique |
| *Italique* | ✅ | \`*texte*\` | 🔴 Critique |
| \`Code\` | ✅ | Backticks | 🔴 Critique |
| ~Barré~ | ✅ | \`~texte~\` | 🟡 Important |
| ==Surligné== | ✅ | \`==texte==\` | 🟡 Important |
| Liens | ✅ | \`[texte](url)\` | 🔴 Critique |
| Images | ✅ | \`![alt](url)\` | 🟢 Normal |
| Tableaux | ✅ | Syntaxe GitHub | 🟢 Normal |
| Footnotes | ⏳ | \`[^1]\` | 🟡 Important |

### 🔍 Tests de rendering

#### Support des caractères spéciaux
- **Mathématiques** : E = mc², ∑(i=1→n) i², α, β, γ, δ, ε
- **Devise** : $100, €50, £75, ¥1000, ₹250
- **Symboles** : ©, ®, ™, ℗, ℠, ℞, ℧, ℩
- **Flèches** : ←, →, ↑, ↓, ↔, ⇄, ⇆, ⇇, ⇈, ⇉, ⇊, ⇋, ⇌
- **Géométriques** : ■, □, ▢, ▣, ▤, ▥, ▦, ▧, ▨, ▩, ▪, ▫, ▬, ▭, ▮, ▯, ▰, ▱

### 📈 Graphiques et diagrammes

#### Statistiques d'utilisation mensuelle
\`\`\`
Mois    | Utilisateurs | Documents | Pages  | Taux de succès
Janvier |     1,200    |    450   | 2,340  |     98.5%
Février |     1,450    |    520   | 2,890  |     99.1%
Mars    |     1,780    |    680   | 3,450  |     98.9%
Avril   |     2,100    |    820   | 4,120  |     99.3%
Mai     |     2,450    |    950   | 4,890  |     99.0%
\`\`\`

### Recommendations techniques

#### Meilleures pratiques pour la pagination
1. **Planification** : Anticiper le contenu par page avant l'ecriture
2. **Sauts explicites** : Utiliser les sauts de page pour controler la pagination
3. **Equilibre** : Eviter les pages trop pleines ou trop vides
4. **Consistance** : Maintenir un style cohérent entre les pages
5. **Tests** : Verifier le rendu sur différents formats de papier

Analyse terminee ! Derniere page avec conclusion et annexes.

<!-- pagebreak -->

## Page 4: Conclusion, Ressources et Annexes

### Resume des realisations

#### Fonctionnalités validées
- **Pagination multi-pages** : Support jusqu'à 100+ pages avec sauts explicites
- **Formatage complet** : Tous les éléments Markdown supportés
- **Qualité professionnelle** : Export PDF haute qualité (300 DPI)
- **Performance optimisée** : Rendu rapide même pour les documents volumineux
- **Interface moderne** : Design responsive et accessible
- **Personnalisation** : Templates et thèmes configurables

#### 🎯 Métriques de succès
- **Taux de conversion** : 99.2% de succès sur les tests
- **Performance** : Temps moyen de génération : 1.2 secondes
- **Qualité** : Résolution 300 DPI, compression optimisée
- **Compatibilité** : Support des standards PDF/A-1b
- **Satisfaction** : 4.8/5 étoiles basé sur les retours utilisateurs

### 🎁 Bonus : Collection complète d'émojis

#### Émotions et expressions
😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😜 🤪 😝 🤑 🤗 🤭 🤫 🤔 🤐 🤨 😐 😑 😶 😏 😒 🙄 😬 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🤢 🤮 🤧 🥵 🥶 🥴 😵 🤯 🤠 🥳 😎 🤓 🧐

#### Animaux et nature
🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🙈 🙉 🙊 🐒 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷️ 🕸️ 🦂 🐢 🐍 🦎 🦖 🦕 🦙 🦚 🦛 🦘 🦡 🦫 🦦 🦥 🐘 🐪 🐫 🦏 🐃 🐂 🐄 🐎 🐖 🐑 🐏 🐐 🦌 🐀 🐁 🐓 🦃 🦚 🦜 🦢 🦩 🕊️ 🐇 🦝 🦨 🦡 🦦 🦥 🐁 🐀 🦔 🦇 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵

#### Nourriture et boissons
🍎 🍏 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🥦 🥬 🥒 🌶️ 🫑 🌽 🥕 🫒 🧄 🧅 🥔 🍠 🥐 🥯 🥞 🧇 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🫓 🥨 🧆 🥘 🍝 🍜 🍲 🍛 🍣 🍱 🥟 🦪 🦀 🦞 🦐 🦑 🍦 🍧 🍨 🍦 🥧 🧁 🥠 🥮 🍮 🍯 🍼 🥛 ☕ 🫖 🍵 🫶 🍶 🍾 🍷 🍸 🍹 🍺 🍻 🥂 🥃 🥤 🧋 🧃 🧉 🧊 🥶 🥵

### 📊 Tableau récapitulatif final

#### Matrice de fonctionnalités
| Catégorie | Fonctionnalité | Statut | Impact | Priorité |
|-----------|----------------|---------|---------|----------|
| **Core** | Export PDF | ✅ Complet | 🔴 Critique | P0 |
| **Core** | Pagination | ✅ Complet | 🔴 Critique | P0 |
| **UX** | Toolbar formatage | ✅ Complet | 🟡 Important | P1 |
| **UX** | Templates | ✅ Complet | 🟢 Normal | P2 |
| **UX** | Import fichiers | ✅ Complet | 🟡 Important | P1 |
| **Tech** | Performance | ✅ Optimisé | 🟡 Important | P1 |
| **Tech** | Qualité PDF | ✅ Haute | 🔴 Critique | P0 |

### 📝 Instructions finales pour l'utilisateur

#### Guide d'utilisation optimale
1. **Préparation** : Organisez votre contenu avec des sauts de page explicites
2. **Formatage** : Utilisez la barre d'outils pour un formatage cohérent
3. **Templates** : Choisissez un template adapté à votre type de document
4. **Aperçu** : Vérifiez toujours l'aperçu avant l'export final
5. **Export** : Choisissez les options PDF selon vos besoins

#### Raccourcis clavier
- **Ctrl+B** : Mettre en gras
- **Ctrl+I** : Mettre en italique
- **Ctrl+K** : Insérer un lien
- **Ctrl+Shift+C** : Insérer du code
- **Ctrl+Enter** : Insérer un saut de page

### 🎯 Conclusion finale

Ce document complet de 4 pages démontre toutes les capacités de notre application MDtoPDF Pro. De la gestion de contenu complexe à l'export PDF de haute qualité, chaque fonctionnalité a été soigneusement développée et testée.

**L'application est maintenant prête pour un usage professionnel avec :**
- ✅ Gestion multi-pages robuste
- ✅ Formatage Markdown complet
- ✅ Templates personnalisables
- ✅ Import de fichiers facilité
- ✅ Export PDF de qualité professionnelle

Merci d'avoir testé notre solution complète ! 🙏

---

### 🔗 Ressources et liens utiles
- **Documentation** : [Guide utilisateur complet](https://docs.mdtopdf.pro)
- **Support** : [Centre d'aide](https://help.mdtopdf.pro)
- **Communauté** : [Forum Discord](https://discord.mdtopdf.pro)
- **GitHub** : [Dépôt source](https://github.com/mdtopdf/pro)

**Version finale du document complet** 📚✨🎉

Dernière ligne du document ! Mission accomplie ! 🚀🎊🎯`);


  const [fileName, setFileName] = useState('document');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [previewTheme, setPreviewTheme] = useState('modern');
  const [previewZoom, setPreviewZoom] = useState(100);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

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

  // Fonction pour obtenir le titre
  const getTitle = () => {
    return 'MD to PDF Pro';
  };

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    transition: 'all 0.3s ease',
    margin: '0 auto', // Centre le conteneur
    padding: '0 20px' // Ajoute des marges latérales pour le centrage
  };



  const mainContentStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    padding: '12px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box' as const
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
      switch (exportFormat) {
        case 'pdf':
          await exportToPDF(markdownRef, fileName, pdfOptions);
          break;
        case 'html':
          exportToHTML(markdown, fileName, markdownRef);
          break;
        case 'md':
          exportToMarkdown(markdown, fileName);
          break;
        default:
          await exportToPDF(markdownRef, fileName, pdfOptions);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleExportFormatChange = (format: string) => {
    setExportFormat(format);
  };

  const handleExportHTML = () => {
    exportToHTML(markdown, fileName, markdownRef);
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

  const handleFileImport = (content: string, fileName: string) => {
    setMarkdown(content);
    setFileName(fileName.replace(/\.(md|markdown)$/i, ''));
    setShowImport(false);
  };

  const handleApplyTemplate = (content: string, style?: any) => {
    if (content) {
      setMarkdown(content);
    }
    // Si un style est fourni, l'appliquer au thème de prévisualisation
    if (style) {
      // Logique pour appliquer le style personnalisé
      console.log('Applying template style:', style);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewModeChange = (mode: 'single' | 'all') => {
    setViewMode(mode);
    if (mode === 'single') {
      setCurrentPage(1);
    }
  };

  const handleTabChange = (tab: 'editor' | 'import' | 'templates' | 'export') => {
    switch (tab) {
      case 'editor':
        setShowTemplates(false);
        setShowExport(false);
        setShowImport(false);
        setShowOptions(true);
        break;
      case 'import':
        setShowTemplates(false);
        setShowExport(false);
        setShowImport(true);
        setShowOptions(false);
        break;
      case 'templates':
        setShowTemplates(true);
        setShowExport(false);
        setShowImport(false);
        setShowOptions(false);
        break;
      case 'export':
        setShowTemplates(false);
        setShowExport(true);
        setShowImport(false);
        setShowOptions(false);
        break;
    }
  };


  return (
    <div style={containerStyle}>
      {/* Header */}
      <Header
        title={getTitle()}
        showImport={showImport}
        showTemplates={showTemplates}
        showExport={showExport}
        isDarkMode={isDarkMode}
        onTabChange={handleTabChange}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={leftPanelStyle}>
          {showOptions && (
            <PDFControlPanel
              pdfOptions={pdfOptions}
              onOptionsChange={setPdfOptions}
              fileName={fileName}
              onFileNameChange={setFileName}
              onExportPDF={handleExportPDF}
              onExportChange={handleExportFormatChange}
              previewTheme={previewTheme}
              onThemeChange={setPreviewTheme}
              previewZoom={previewZoom}
              onZoomChange={setPreviewZoom}
              isDarkMode={isDarkMode}
              exportFormat={exportFormat}
            />
          )}
          {showImport && (
            <FileImport
              onFileImport={handleFileImport}
              isDarkMode={isDarkMode}
            />
          )}

          <MarkdownEditor
            markdown={markdown}
            onChange={setMarkdown}
            showPreview={false}
            onTogglePreview={() => setShowPreview(!showPreview)}
            isDarkMode={isDarkMode}
          />
          {showTemplates && (
            <TemplateSelector
              templates={templates}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
              onCreateTemplate={handleCreateTemplate}
              isDarkMode={isDarkMode}
              onApplyTemplate={handleApplyTemplate}
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
          {/* Aperçu PDF */}
          <div style={{ position: 'relative' }}>
              <PDFPreview
              ref={markdownRef}
              markdown={markdown}
              previewTheme={previewTheme}
              previewZoom={previewZoom}
              onZoomChange={setPreviewZoom}
              isDarkMode={isDarkMode}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProMarkdownToPDFRefactored;
