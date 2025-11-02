import React, { useRef, useState, useMemo, useEffect } from 'react';
import { DocumentArrowDownIcon, RocketLaunchIcon, SunIcon, MoonIcon, SwatchIcon, ArrowDownTrayIcon, Cog6ToothIcon, DocumentTextIcon, EyeIcon, SparklesIcon, AcademicCapIcon, CircleStackIcon, BookOpenIcon, MagnifyingGlassIcon, ChartBarIcon, PencilIcon, PlusIcon, MinusIcon, ArrowPathIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { marked } from 'marked';
import FileNameInput from './ui/FileNameInput';

const ProMarkdownToPDF: React.FC = () => {
  const markdownRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState('document');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [markdown, setMarkdown] = useState(`# MDtoPDF Converter - Test Complet

Ce **document de test** démontre la *fidélité* du rendu Markdown vers HTML avec tous les éléments standards.

---

## 🎯 Fonctionnalités principales

- ✅ Interface professionnelle avec Heroicons
- 🌓 Thème sombre/clair adaptatif
- 📄 Export multi-formats (PDF, HTML, DOCX)
- 🎨 Templates personnalisables
- ⚡ Éditeur Markdown en temps réel
- 📊 Statistiques en temps réel des documents
- **Orientation** portrait ou paysage
- **Taille de police** ajustable

### Comment utiliser ?

1. **Saisissez** votre contenu Markdown dans l'éditeur
2. **Personnalisez** les options PDF
3. **Choisissez** votre template préféré
4. **Exportez** dans le format désiré

---

## 📝 Exemples de mise en forme

### Texte enrichi

Texte **gras** et texte *italique* et texte ***gras et italique***.

Texte \`en ligne\` avec du code.

Texte ~~barré~~ et texte souligné.

### Listes variées

#### Liste à puces
- Premier élément avec **texte important**
- Deuxième élément avec *texte en italique*
- Troisième élément avec \`code inline\`
  - Sous-élément A
    - Sous-sous-élément A.1
  - Sous-élément B
- Quatrième élément

#### Liste numérotée
1. Premier point **important**
2. Deuxième point avec *italique*
   1. Sous-point 2.1 avec \`code\`
   2. Sous-point 2.2
3. Troisième point avec **gras et *italique***

---

## 💻 Exemples de code

### JavaScript
\`\`\`javascript
// Fonction de conversion Markdown vers HTML
function convertMarkdown(markdown) {
  const html = marked(markdown);
  return html;
}

// Test avec différents contenus
const testContent = \`# Titre
Ceci est un **test** du convertisseur.\`;

console.log(convertMarkdown(testContent));
\`\`\`

### Python
\`\`\`python
# Exemple en Python
def calculate_pdf_pages(word_count, words_per_page=500):
  """Calcule le nombre de pages approximatif pour un PDF"""
  return max(1, (word_count + words_per_page - 1) // words_per_page)

# Utilisation
words = 1250
pages = calculate_pdf_pages(words)
print(f"Environ {pages} pages pour {words} mots")
\`\`\`

---

## 📊 Tableaux

### Tableau simple

| Nom | Âge | Ville | Statut |
|-----|-----|-------|--------|
| Alice | 25 | Paris | ✅ Active |
| Bob | 30 | Lyon | 🔄 En cours |
| Charlie | 35 | Marseille | ⏸️ Pause |

### Tableau avec alignement

| Gauche | Centre | Droite |
|:-------|:------:|-------:|
| Texte 1 | Texte 2 | Texte 3 |
| Plus long | Moyen | Court |
| **Gras** | *Italique* | \`Code\` |

---

## 💬 Citations et notes

> **Note importante :** Ce convertisseur supporte tous les éléments Markdown standards avec un rendu fidèle et professionnel.
>
> Il préserve la mise en forme, les couleurs et la typographie pour un résultat optimal.

> Cette citation imbriquée montre que le système gère correctement
>
> > Les citations à plusieurs niveaux

---

## 🔗 Liens et références

Visitez [le site de MDtoPDF](https://example.com) pour plus d'informations.

Lien avec email : <contact@example.com>

---

## 🎨 Conclusion

Ce **test complet** démontre que le convertisseur MDtoPDF offre un rendu :

- 🎯 **Fidèle** : Respect exact de la syntaxe Markdown
- 🎨 **Professionnel** : Mise en forme soignée et moderne
- 🌈 **Complet** : Support de tous les éléments standards
- ⚡ **Performant** : Conversion rapide et fluide

*Généré avec ❤️ par MDtoPDF Converter Pro*

---

**Essayez de modifier ce texte et voyez le résultat en temps réel !**`);

  const [pdfOptions, setPdfOptions] = useState({
    format: 'a4',
    orientation: 'portrait',
    fontSize: 7,
    margin: 5,
    header: '',
    footer: '',
    enableHeader: false,
    enableFooter: false,
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewTheme, setPreviewTheme] = useState<'modern' | 'classic' | 'academic' | 'minimal'>('modern');
  const [previewZoom, setPreviewZoom] = useState(100);
  const [previewHTML, setPreviewHTML] = useState('');

  const getWordCount = () => {
    return markdown.split(/\s+/).filter(word => word.length > 0).length;
  };

  // Mettre à jour le preview HTML quand le markdown change
  useEffect(() => {
    const updatePreview = async () => {
      const html = await convertMarkdownToHTML(markdown);
      setPreviewHTML(html);
    };
    updatePreview();
  }, [markdown]);



  // Configuration de marked avec le renderer personnalisé
  useMemo(() => {
    // Utiliser le renderer de base pour plus de compatibilité
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Sauts de ligne avec \n
      pedantic: false
    });
  }, []);

  // Fonction pour gérer les gradients CSS dans le PDF
  const processCSSForPDF = (css: string) => {
    console.log('🎨 Traitement des gradients CSS pour le PDF...');

    // Expression régulière pour détecter les gradients CSS
    const gradientRegex = /(background|background-image):\s*linear-gradient\([^)]+\)/gi;
    const radialGradientRegex = /(background|background-image):\s*radial-gradient\([^)]+\)/gi;

    // Approche plus robuste : détecter tous les cas de texte avec gradient
    // 1. Détecter color: transparent (typique des gradients texte)
    const transparentTextRegex = /color:\s*transparent\s*!important/gi;

    // 2. Détecter -webkit-background-clip: text
    const textClipRegex = /-webkit-background-clip:\s*text/gi;
    const textClipRegex2 = /background-clip:\s*text/gi;

    // 3. Détecter les combinaisons background + background-clip dans le même bloc
    const textGradientBlockRegex = /[^}]*-webkit-background-clip:\s*text[^}]*background:[^;]*linear-gradient\([^)]+\)[^}]*}/gi;

    // Fonction pour valider et nettoyer une couleur
    const validateColor = (color: string): string => {
      if (!color) return '';

      // Couleurs hexadécimales
      if (color.match(/^#[0-9a-fA-F]{3,6}$/)) return color;

      // Couleurs rgb/rgba
      if (color.match(/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/)) return color;
      if (color.match(/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/)) return color;

      // Couleurs nommées communes
      const namedColors: Record<string, string> = {
        'white': '#ffffff',
        'black': '#000000',
        'red': '#ff0000',
        'blue': '#0000ff',
        'green': '#008000',
        'yellow': '#ffff00',
        'orange': '#ffa500',
        'purple': '#800080',
        'pink': '#ffc0cb',
        'brown': '#a52a2a',
        'gray': '#808080',
        'grey': '#808080',
        'lightgray': '#d3d3d3',
        'darkgray': '#a9a9a9',
        'f8fafc': '#f8fafc',
        'f1f5f9': '#f1f5f9',
        '667eea': '#667eea',
        '764ba2': '#764ba2'
      };

      return namedColors[color.toLowerCase()] || '';
    };

    // Expression pour extraire les couleurs des gradients (plus précise)
    const colorRegex = /#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|[a-fA-F]{6}|[a-fA-F]{3}|\b[a-zA-Z]+\b(?=\s*[0-9%]|\s*,|\s*\))/g;

    let processedCSS = css;
    let gradientCount = 0;

    // Traiter les gradients linéaires
    processedCSS = processedCSS.replace(gradientRegex, (match) => {
      gradientCount++;
      console.log(`🔍 Gradient linéaire détecté (${gradientCount}):`, match);

      // Extraire toutes les couleurs du gradient
      const colors = match.match(colorRegex) || [];
      console.log(`🎨 Toutes les couleurs brutes extraites:`, colors);

      // Valider et nettoyer les couleurs
      const validColors = colors
        .map(color => color.trim())
        .filter(color => {
          // Filtrer les éléments qui ne sont pas des couleurs
          if (!color || color === 'to' || color.includes('deg') || color.includes('linear-gradient')) {
            return false;
          }
          const validated = validateColor(color);
          return validated !== '';
        })
        .map(color => validateColor(color));

      console.log(`✅ Couleurs validées:`, validColors);

      // Prendre la première couleur comme couleur dominante
      const dominantColor = validColors.length > 0 ? validColors[0] : '#f8fafc';
      console.log(`🏆 Couleur dominante sélectionnée:`, dominantColor);

      // Remplacer le gradient par la couleur dominante
      const property = match.includes('background') ? 'background' : 'background-image';
      return `${property}: ${dominantColor} !important`;
    });

    // Traiter les gradients radiaux
    processedCSS = processedCSS.replace(radialGradientRegex, (match) => {
      gradientCount++;
      console.log(`🔍 Gradient radial détecté (${gradientCount}):`, match);

      const colors = match.match(colorRegex) || [];
      console.log(`🎨 Couleurs brutes du gradient radial:`, colors);

      const validColors = colors
        .map(color => color.trim())
        .filter(color => {
          if (!color || color.includes('radial-gradient') || color.includes('circle') ||
              color.includes('ellipse') || color.includes('at')) {
            return false;
          }
          const validated = validateColor(color);
          return validated !== '';
        })
        .map(color => validateColor(color));

      const dominantColor = validColors.length > 0 ? validColors[0] : '#f8fafc';
      console.log(`🏆 Couleur dominante du gradient radial:`, dominantColor);

      const property = match.includes('background') ? 'background' : 'background-image';
      return `${property}: ${dominantColor} !important`;
    });

    // TRAITEMENT PLUS ROBUSTE DES GRADIENTS TEXTE
    console.log('🔍 Détection des gradients texte...');

    // 1. Traiter les blocs complets contenant des gradients texte
    processedCSS = processedCSS.replace(textGradientBlockRegex, (match) => {
      gradientCount++;
      console.log(`🔍 Bloc gradient texte détecté (${gradientCount}):`, match.substring(0, 100) + '...');

      // Extraire la première couleur du gradient dans ce bloc
      const gradientMatch = match.match(/background:[^;]*linear-gradient\([^)]+\)/i);
      if (gradientMatch) {
        const colors = gradientMatch[0].match(colorRegex) || [];
        const validColors = colors
          .map(color => color.trim())
          .filter(color => {
            if (!color || color.includes('linear-gradient') || color.includes('background')) {
              return false;
            }
            return validateColor(color) !== '';
          })
          .map(color => validateColor(color));

        const textColor = validColors.length > 0 ? validColors[0] : '#2563eb';
        console.log(`🖋️ Bloc gradient → couleur: ${textColor}`);

        // Remplacer tout le bloc par un style simple
        return match
          .replace(/-webkit-background-clip:\s*text[^;]*;?/gi, '')
          .replace(/background-clip:\s*text[^;]*;?/gi, '')
          .replace(/background:[^;]*linear-gradient\([^)]+\)[^;]*;?/gi, '')
          .replace(/color:\s*transparent[^;]*;?/gi, '')
          + ` color: ${textColor} !important; background: transparent !important;`;
      }
      return match;
    });

    // 2. Remplacer toutes les occurences de color: transparent par une couleur par défaut
    processedCSS = processedCSS.replace(transparentTextRegex, () => {
      gradientCount++;
      console.log(`🔍 Texte transparent détecté (${gradientCount}) → couleur par défaut`);
      return 'color: #2563eb !important';
    });

    // 3. Nettoyer les restes de -webkit-background-clip
    processedCSS = processedCSS.replace(textClipRegex, () => {
      console.log(`🔍 -webkit-background-clip: text détecté → nettoyage`);
      return '';
    });

    processedCSS = processedCSS.replace(textClipRegex2, () => {
      console.log(`🔍 background-clip: text détecté → nettoyage`);
      return '';
    });

    if (gradientCount > 0) {
      console.log(`✅ ${gradientCount} gradient(s) traité(s) pour le PDF (incluant gradients texte)`);
    } else {
      console.log('ℹ️ Aucun gradient détecté dans les styles');
    }

    return processedCSS;
  };

  const convertMarkdownToHTML = async (text: string) => {
    try {
      // Configuration simple de marked pour garantir la compatibilité
      marked.setOptions({
        gfm: true,
        breaks: true
      });

      let html = await marked.parse(text);

      // Remplacement simple des balises pour ajouter les classes
      html = html
        .replace(/<h1>/g, '<h1 class="preview-h1">')
        .replace(/<h2>/g, '<h2 class="preview-h2">')
        .replace(/<h3>/g, '<h3 class="preview-h3">')
        .replace(/<h4>/g, '<h4 class="preview-h4">')
        .replace(/<h5>/g, '<h5 class="preview-h5">')
        .replace(/<h6>/g, '<h6 class="preview-h6">')
        .replace(/<p>/g, '<p class="preview-p">')
        .replace(/<ul>/g, '<ul class="preview-ul">')
        .replace(/<ol>/g, '<ol class="preview-ol">')
        .replace(/<li>/g, '<li class="preview-li">')
        .replace(/<pre>/g, '<div class="preview-pre-wrapper"><pre class="preview-pre">')
        .replace(/<\/pre>/g, '</pre></div>')
        .replace(/<code>/g, '<code class="preview-code">')
        .replace(/<blockquote>/g, '<blockquote class="preview-blockquote">')
        .replace(/<a /g, '<a class="preview-link" ')
        .replace(/<table>/g, '<div class="preview-table-wrapper"><table class="preview-table">')
        .replace(/<\/table>/g, '</table></div>')
        .replace(/<th>/g, '<th class="preview-th">')
        .replace(/<td>/g, '<td class="preview-td">')
        .replace(/<hr>/g, '<hr class="preview-hr">');

      return html;

    } catch (error) {
      console.error('Erreur lors de la conversion Markdown:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      return `<div class="preview-error">❌ Erreur de conversion Markdown: ${errorMessage}</div>`;
    }
  };

  // Thèmes de preview
  const getPreviewTheme = () => {
    const baseTheme = {
      container: {
        background: isDarkMode ? '#0f172a' : '#ffffff',
        color: isDarkMode ? '#f1f5f9' : '#1f2937',
        borderRadius: '16px',
        border: '1px solid ' + (isDarkMode ? '#334155' : '#e5e7eb'),
        boxShadow: isDarkMode ? '0 10px 30px -5px rgba(0, 0, 0, 0.3)' : '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: '1.7',
        fontSize: '15px',
        padding: '40px',
        transform: `scale(${previewZoom / 100})`,
        transformOrigin: 'top left',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }
    };

    const themes = {
      modern: {
        ...baseTheme,
        css: `
          .markdown-preview {
            max-width: none;
          }
          .preview-h1 {
            color: #0f172a;
            font-size: 2.5rem;
            font-weight: 800;
            margin: 2rem 0 1.5rem;
            line-height: 1.1;
            letter-spacing: -0.025em;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .preview-h2 {
            color: #1e293b;
            font-size: 1.875rem;
            font-weight: 700;
            margin: 2rem 0 1rem;
            line-height: 1.3;
            position: relative;
            padding-left: 1rem;
          }
          .preview-h2::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
          }
          .preview-h3 {
            color: #334155;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1.5rem 0 0.75rem;
            line-height: 1.4;
          }
          .preview-p {
            color: #475569;
            margin: 1.25rem 0;
            line-height: 1.7;
            font-size: 1rem;
          }
          .preview-code {
            background: #f1f5f9;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            font-family: 'JetBrains Mono', 'SF Mono', Monaco, monospace;
            font-size: 0.875rem;
            color: #dc2626;
            font-weight: 500;
          }
          .preview-pre-wrapper {
            margin: 1.5rem 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .preview-pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 1.5rem;
            margin: 0;
            overflow-x: auto;
            font-family: 'JetBrains Mono', 'SF Mono', Monaco, monospace;
            font-size: 0.875rem;
            line-height: 1.5;
          }
          .preview-blockquote {
            margin: 1.5rem 0;
            padding: 1rem 1.5rem;
            border-left: 4px solid #667eea;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 0 12px 12px 0;
            position: relative;
          }
          .preview-blockquote::before {
            content: '"';
            position: absolute;
            top: 0.5rem;
            left: 1rem;
            font-size: 3rem;
            color: #667eea;
            opacity: 0.2;
            font-family: Georgia, serif;
          }
          .preview-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
          }
          .preview-link:hover {
            color: #764ba2;
            border-bottom-color: #764ba2;
          }
          .preview-table-wrapper {
            margin: 1.5rem 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .preview-table {
            width: 100%;
            border-collapse: collapse;
            background: #ffffff;
          }
          .preview-th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.875rem;
          }
          .preview-td {
            padding: 1rem;
            border-bottom: 1px solid #e5e7eb;
            color: #374151;
          }
          .preview-hr {
            border: none;
            height: 2px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 3rem 0;
            border-radius: 1px;
          }
        `
      },
      classic: {
        ...baseTheme,
        css: `
          .markdown-preview {
            font-family: 'Georgia', 'Times New Roman', serif;
          }
          .preview-h1 {
            color: #2c3e50;
            font-size: 2.25rem;
            font-weight: 700;
            margin: 2rem 0 1.5rem;
            border-bottom: 3px solid #3498db;
            padding-bottom: 0.5rem;
          }
          .preview-h2 {
            color: #34495e;
            font-size: 1.75rem;
            font-weight: 600;
            margin: 1.75rem 0 1rem;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 0.25rem;
          }
          .preview-h3 {
            color: #34495e;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1.5rem 0 0.75rem;
          }
          .preview-p {
            color: #2c3e50;
            margin: 1.25rem 0;
            line-height: 1.8;
            text-align: justify;
          }
          .preview-code {
            background: #ecf0f1;
            padding: 0.125rem 0.375rem;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            color: #c0392b;
          }
          .preview-pre-wrapper {
            margin: 1.5rem 0;
          }
          .preview-pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 1.5rem;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
          }
          .preview-blockquote {
            margin: 1.5rem 0;
            padding: 1rem 1.5rem;
            border-left: 5px solid #3498db;
            background: #ecf0f1;
            font-style: italic;
            color: #7f8c8d;
          }
          .preview-link {
            color: #3498db;
            text-decoration: underline;
          }
          .preview-link:hover {
            color: #2980b9;
          }
          .preview-table-wrapper {
            margin: 1.5rem 0;
          }
          .preview-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #34495e;
          }
          .preview-th {
            background: #34495e;
            color: white;
            padding: 0.75rem;
            text-align: left;
            font-weight: 600;
            border: 1px solid #2c3e50;
          }
          .preview-td {
            padding: 0.75rem;
            border: 1px solid #bdc3c7;
            color: #2c3e50;
          }
          .preview-hr {
            border: none;
            height: 2px;
            background: #bdc3c7;
            margin: 2rem 0;
          }
        `
      },
      academic: {
        ...baseTheme,
        css: `
          .markdown-preview {
            font-family: 'Times New Roman', Times, serif;
            text-align: justify;
          }
          .preview-h1 {
            color: #000000;
            font-size: 2rem;
            font-weight: 700;
            margin: 2rem 0 1.5rem;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .preview-h2 {
            color: #000000;
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1.75rem 0 1rem;
            text-align: left;
          }
          .preview-h3 {
            color: #333333;
            font-size: 1.25rem;
            font-weight: 600;
            margin: 1.5rem 0 0.75rem;
            font-style: italic;
          }
          .preview-p {
            color: #000000;
            margin: 1.25rem 0;
            line-height: 1.8;
            text-align: justify;
            text-indent: 2em;
          }
          .preview-p:first-child {
            text-indent: 0;
          }
          .preview-code {
            background: #f8f9fa;
            padding: 0.125rem 0.375rem;
            border: 1px solid #dee2e6;
            border-radius: 2px;
            font-family: 'Courier New', monospace;
            color: #495057;
            font-size: 0.9em;
          }
          .preview-pre-wrapper {
            margin: 1.5rem 0;
          }
          .preview-pre {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 1rem;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
            font-size: 0.9em;
            line-height: 1.6;
          }
          .preview-blockquote {
            margin: 1.5rem 0;
            padding: 1rem 1.5rem;
            border-left: 4px solid #6c757d;
            background: #f8f9fa;
            font-style: italic;
            color: #6c757d;
          }
          .preview-link {
            color: #0056b3;
            text-decoration: underline;
          }
          .preview-link:hover {
            color: #004085;
          }
          .preview-table-wrapper {
            margin: 1.5rem 0;
          }
          .preview-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #dee2e6;
          }
          .preview-th {
            background: #e9ecef;
            color: #495057;
            padding: 0.75rem;
            text-align: left;
            font-weight: 600;
            border: 1px solid #dee2e6;
            font-size: 0.9em;
          }
          .preview-td {
            padding: 0.75rem;
            border: 1px solid #dee2e6;
            color: #212529;
            font-size: 0.9em;
          }
          .preview-hr {
            border: none;
            height: 1px;
            background: #dee2e6;
            margin: 2rem 0;
          }
        `
      },
      minimal: {
        ...baseTheme,
        css: `
          .markdown-preview {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-weight: 300;
          }
          .preview-h1 {
            color: #000000;
            font-size: 2rem;
            font-weight: 300;
            margin: 2rem 0 1.5rem;
            letter-spacing: -0.02em;
          }
          .preview-h2 {
            color: #000000;
            font-size: 1.5rem;
            font-weight: 400;
            margin: 1.75rem 0 1rem;
            border-bottom: 1px solid #e5e5e5;
            padding-bottom: 0.5rem;
          }
          .preview-h3 {
            color: #333333;
            font-size: 1.25rem;
            font-weight: 400;
            margin: 1.5rem 0 0.75rem;
          }
          .preview-p {
            color: #333333;
            margin: 1.25rem 0;
            line-height: 1.8;
          }
          .preview-code {
            background: #f5f5f5;
            padding: 0.25rem 0.5rem;
            border-radius: 2px;
            font-family: 'SF Mono', Monaco, monospace;
            color: #d32f2f;
            font-size: 0.9em;
          }
          .preview-pre-wrapper {
            margin: 1.5rem 0;
          }
          .preview-pre {
            background: #f5f5f5;
            color: #333333;
            padding: 1rem;
            border-radius: 2px;
            font-family: 'SF Mono', Monaco, monospace;
            overflow-x: auto;
            font-size: 0.875rem;
            line-height: 1.6;
          }
          .preview-blockquote {
            margin: 1.5rem 0;
            padding: 1rem 0 1rem 1.5rem;
            border-left: 3px solid #d32f2f;
            color: #666666;
            font-style: italic;
          }
          .preview-link {
            color: #d32f2f;
            text-decoration: none;
          }
          .preview-link:hover {
            text-decoration: underline;
          }
          .preview-table-wrapper {
            margin: 1.5rem 0;
          }
          .preview-table {
            width: 100%;
            border-collapse: collapse;
          }
          .preview-th {
            background: #f5f5f5;
            color: #333333;
            padding: 0.75rem;
            text-align: left;
            font-weight: 400;
            border-bottom: 1px solid #e5e5e5;
          }
          .preview-td {
            padding: 0.75rem;
            border-bottom: 1px solid #f5f5f5;
            color: #333333;
          }
          .preview-hr {
            border: none;
            height: 1px;
            background: #e5e5e5;
            margin: 2rem 0;
          }
        `
      }
    };

    // Appliquer le thème sombre si nécessaire
    const selectedTheme = themes[previewTheme];
    if (isDarkMode) {
      return {
        ...selectedTheme,
        container: {
          ...selectedTheme.container,
          background: '#0f172a',
          color: '#f1f5f9',
          border: '1px solid #334155'
        },
        css: selectedTheme.css.replace(/#ffffff/g, '#0f172a')
                   .replace(/#f8fafc/g, '#1e293b')
                   .replace(/#f1f5f9/g, '#e2e8f0')
                   .replace(/#2c3e50/g, '#f1f5f9')
                   .replace(/#34495e/g, '#e2e8f0')
                   .replace(/#000000/g, '#f1f5f9')
                   .replace(/#333333/g, '#e2e8f0')
      };
    }

    return selectedTheme;
  };

  const getEstimatedPages = () => {
    const wordsPerPage = 500;
    return Math.max(1, Math.ceil(getWordCount() / wordsPerPage));
  };

  const updatePDFOptions = (newOptions: any) => {
    setPdfOptions(prev => ({ ...prev, ...newOptions }));
  };

  const handleExportPDF = async () => {
    if (!markdown.trim()) {
      alert('Veuillez entrer du contenu Markdown avant d\'exporter');
      return;
    }

    try {
      console.log('Début export PDF, markdown length:', markdown.length);
      console.log('showPreview:', showPreview);
      console.log('markdownRef.current:', markdownRef.current);

      // Utiliser le HTML du preview déjà formaté avec les thèmes et styles
      const markdownHTML = previewHTML;
      console.log('Utilisation du preview HTML pour PDF, length:', markdownHTML.length);
      console.log('Preview HTML preview:', markdownHTML.substring(0, 200) + '...');

      // Créer un élément temporaire pour le contenu HTML
      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        width: ${pdfOptions.orientation === 'landscape' ? '11in' : '8.5in'};
        min-height: ${pdfOptions.orientation === 'landscape' ? '8.5in' : '11in'};
        /* Supprime le padding haut: la marge haute sera gérée par y lors de l'ajout au PDF */
        padding: 0 ${pdfOptions.margin}mm ${pdfOptions.margin}mm 0;
        background: white;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: ${pdfOptions.fontSize}pt;
        line-height: 1.7;
        color: #333;
        max-width: ${pdfOptions.orientation === 'landscape' ? '11in' : '8.5in'};
        box-sizing: border-box;
      `;

      // Récupérer le thème actuel pour appliquer les mêmes styles que le preview
      const currentTheme = getPreviewTheme();
      console.log('🎨 Thème preview utilisé pour PDF:', previewTheme);
      console.log('📄 Fidélité garantie: PDF utilisera les mêmes styles que le preview');

      // Traiter les CSS du thème pour gérer les gradients
      const processedThemeCSS = processCSSForPDF(currentTheme.css);

      // Utiliser le CSS du thème traité pour garantir la fidélité avec le preview
      const themedCSS = processedThemeCSS + `
        /* Ajustements PDF pour garantir la fidélité */
        .markdown-preview {
          background: white !important;
          margin: 0 !important;
          /* Supprime le padding haut: la marge haute est appliquée par y dans jsPDF */
          padding: 0 ${pdfOptions.margin}mm ${pdfOptions.margin}mm 0 !important;
          transform: none !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          max-width: 100% !important;
          width: 100% !important;
          overflow-x: hidden !important;
          box-sizing: border-box !important;
        }

        /* Adapter les tailles pour le PDF */
        .preview-h1 { font-size: 16px !important; margin: 12px 0 8px 0 !important; }
        .preview-h2 { font-size: 13px !important; margin: 10px 0 6px 0 !important; }
        .preview-h3 { font-size: 11px !important; margin: 8px 0 4px 0 !important; }
        .preview-h4, .preview-h5, .preview-h6 { font-size: 10px !important; margin: 6px 0 3px 0 !important; }
        .preview-p { font-size: 9px !important; margin: 5px 0 !important; line-height: 1.4 !important; }
        .preview-ul, .preview-ol { font-size: 9px !important; margin: 5px 0 !important; padding-left: 10px !important; }
        .preview-li { font-size: 9px !important; margin: 2px 0 !important; }
        .preview-pre { font-size: 8px !important; margin: 5px 0 !important; padding: 6px !important; }
        .preview-code { font-size: 0.75em !important; padding: 1px 3px !important; }
        .preview-blockquote { font-size: 9px !important; margin: 5px 0 !important; padding-left: 8px !important; }

        /* Tableaux - adaptation automatique aux dimensions du contenu */
        .preview-table-wrapper {
          font-size: 8px !important;
          margin: 5px 0 !important;
          width: auto !important; /* Permettre au tableau de s'adapter à son contenu */
          max-width: 100% !important; /* Mais ne pas dépasser la largeur disponible */
          min-width: 100% !important; /* Assurer une largeur minimale */
          overflow-x: auto !important; /* Permettre le scroll horizontal si nécessaire */
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
          box-sizing: border-box !important;
          display: block !important; /* Permettre le scroll */
        }
        .preview-table {
          font-size: 8px !important;
          margin: 0 !important;
          width: auto !important; /* Laisser le tableau déterminer sa largeur naturelle */
          min-width: 100% !important; /* Largeur minimale = largeur du conteneur */
          max-width: none !important; /* Pas de limite maximale */
          table-layout: auto !important; /* Layout automatique pour s'adapter au contenu */
          border-collapse: collapse !important;
          border-spacing: 0 !important;
          box-sizing: border-box !important;
          white-space: nowrap !important; /* Éviter les retours à la ligne automatiques */
        }
        .preview-th, .preview-td {
          font-size: 8px !important;
          padding: 6px 8px !important;
          border: 1px solid #e5e7eb !important;
          box-sizing: border-box !important;
          vertical-align: middle !important;
          line-height: 1.35 !important;
          white-space: normal !important; /* Permettre les retours à la ligne dans les cellules */
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          hyphens: auto !important;
        }

        /* Adaptation intelligente des largeurs de colonnes */
        .preview-table th,
        .preview-table td {
          min-width: 40px !important; /* Largeur minimale pour chaque cellule */
          max-width: 150px !important; /* Largeur maximale pour éviter les débordements */
          overflow: hidden !important;
          text-overflow: ellipsis !important; /* Ellipse pour le texte trop long */
        }

        /* Colonnes avec contenu numérique potentiel - largeur réduite */
        .preview-table th:first-child,
        .preview-table td:first-child {
          min-width: 60px !important; /* Première colonne souvent numérique */
          max-width: 100px !important;
        }

        /* Colonnes avec contenu textuel - largeur normale */
        .preview-table th:nth-child(2),
        .preview-table td:nth-child(2) {
          min-width: 80px !important; /* Deuxième colonne souvent textuelle */
          max-width: 180px !important;
        }

        /* Colonnes suivantes - largeur adaptative */
        .preview-table th:nth-child(n+3),
        .preview-table td:nth-child(n+3) {
          min-width: 60px !important;
          max-width: 120px !important;
        }

        /* S'assurer que le contenu des tableaux reste lisible */
        .preview-table td,
        .preview-table th {
          vertical-align: top !important;
          line-height: 1.2 !important;
        }

        /* RÈGLES ANTI-GRADIENTS TEXTE - UNIQUMENT SUR LES PROBLÈMES */
        .preview-h1, .preview-h2, .preview-h3, .preview-h4, .preview-h5, .preview-h6 {
          background: transparent !important;
          -webkit-background-clip: initial !important;
          background-clip: initial !important;
          -webkit-text-fill-color: initial !important;
          text-fill-color: initial !important;
          /* Garde la couleur si elle n'est pas transparent */
        }
        .markdown-preview *[style*="color: transparent"] {
          color: inherit !important;
          background: transparent !important;
        }
        .markdown-preview *[style*="background: linear-gradient"] {
          background: transparent !important;
        }
      `;

      const styledHTML = `<style>${themedCSS}</style>`;

      // Ajouter l'en-tête
      if (pdfOptions.header) {
        tempDiv.innerHTML += `<div style="text-align: center; font-size: 7px; color: #6b7280; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">${pdfOptions.header}</div>`;
      }

      // Ajouter le contenu HTML converti avec la structure du preview
      tempDiv.innerHTML += styledHTML + `<div class="markdown-preview">${markdownHTML}</div>`;

      // Ajouter le pied de page
      if (pdfOptions.footer) {
        tempDiv.innerHTML += `<div style="text-align: center; font-size: 7px; color: #6b7280; margin-top: 8px; border-top: 1px solid #e5e7eb; padding-top: 3px;">${pdfOptions.footer}</div>`;
      }

      console.log('tempDiv.innerHTML length:', tempDiv.innerHTML.length);
      console.log('tempDiv.innerHTML preview:', tempDiv.innerHTML.substring(0, 300) + '...');

      document.body.appendChild(tempDiv);

      // Attendre que le contenu soit rendu
      await new Promise(resolve => setTimeout(resolve, 300));

      console.log('Début conversion html2canvas');

      // Convertir en canvas puis en PDF (en tenant compte de l'échelle)
      const scaleFactor = 1.5; // Doit rester cohérent avec la pagination
      const domWidthPx = tempDiv.scrollWidth;
      const domHeightPx = tempDiv.scrollHeight;
      const canvas = await html2canvas(tempDiv, {
        scale: scaleFactor,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: domWidthPx,
        height: domHeightPx,
        windowWidth: domWidthPx,
        windowHeight: domHeightPx,
        logging: true
      });

      console.log('Canvas créé, dimensions:', canvas.width, 'x', canvas.height);
      const effectiveScale = canvas.width / domWidthPx; // ≈ scaleFactor
      console.log('Échelle DOM→Canvas:', effectiveScale.toFixed(3));

      document.body.removeChild(tempDiv);

      // Créer le PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: pdfOptions.orientation as 'portrait' | 'landscape',
        unit: 'mm',
        format: pdfOptions.format as 'a4' | 'letter' | 'legal' | 'a3'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      console.log('PDF dimensions:', pdfWidth, 'x', pdfHeight, 'mm');
      console.log('Image dimensions:', imgWidth, 'x', imgHeight, 'px');

      // Vérification format A4
      const isA4 = pdfOptions.format === 'a4';
      const a4WidthMm = 210;
      const a4HeightMm = 297;

      if (isA4) {
        console.log('✅ Format A4 détecté - Dimensions standard:', a4WidthMm, 'x', a4HeightMm, 'mm');
        console.log('📏 Dimensions actuelles PDF:', pdfWidth, 'x', pdfHeight, 'mm');

        // Validation des dimensions A4
        if (Math.abs(pdfWidth - a4WidthMm) > 1 || Math.abs(pdfHeight - a4HeightMm) > 1) {
          console.warn('⚠️ Attention: Les dimensions PDF ne correspondent pas exactement au format A4 standard');
        }
      }

      // Convertir les dimensions du PDF de mm en pixels (96 DPI = 1px = 0.264583mm)
      // Plus précis: 1mm = 3.7795275591px à 96 DPI
      const mmToPx = 3.7795275591;
      const pdfWidthPx = pdfWidth * mmToPx;
      const pdfHeightPx = pdfHeight * mmToPx;

      // Calculer l'espace disponible en tenant compte des marges (gauche à 5mm)
      const marginMm = pdfOptions.margin;
      const marginPx = marginMm * mmToPx;
      const leftMarginPx = 5 * mmToPx; // Marge gauche fixe de 5mm

      // Marge de gauche 5mm, droite = marginMm, haut = marginMm, bas = marginMm
      const availableWidthPx = pdfWidthPx - leftMarginPx - marginPx; // marge gauche fixe + marge droite
      const availableHeightPx = pdfHeightPx - (marginPx * 2); // marges haut et bas

      console.log('📐 Conversion mm→px:', mmToPx.toFixed(4), 'px/mm');
      console.log('📏 Marges:', marginMm, 'mm =', marginPx.toFixed(1), 'px');
      console.log('📏 Espace disponible:', availableWidthPx.toFixed(1), 'x', availableHeightPx.toFixed(1), 'px');

      // APPROCHE CORRIGÉE: tenir compte de l'échelle html2canvas
      const pxToMm = 0.2645833333; // 1 CSS px = 0.264583 mm @ 96 DPI

      // Dimensions canvas (px canvas) et DOM (px CSS)
      const finalWidthPx = imgWidth;   // px canvas
      const finalHeightPx = imgHeight; // px canvas
      const finalWidthDomPx = finalWidthPx / effectiveScale;   // px CSS
      const finalHeightDomPx = finalHeightPx / effectiveScale; // px CSS

      // Convertir en mm pour le PDF à partir des px CSS
      const finalWidthMm = finalWidthDomPx * pxToMm;
      const finalHeightMm = finalHeightDomPx * pxToMm;

      console.log('🚫 PAS DE SCALE - Dimensions originales conservées');
      console.log('📏 Dimensions originales canvas:', finalWidthPx, 'x', finalHeightPx, 'px');
      console.log('📏 Dimensions en mm:', finalWidthMm.toFixed(1), 'x', finalHeightMm.toFixed(1), 'mm');

      // Calculer combien de pages sont nécessaires (en respectant l'échelle)
      const availableHeightPxCanvas = availableHeightPx * effectiveScale; // hauteur dispo en px canvas
      const totalPages = Math.ceil(finalHeightPx / availableHeightPxCanvas);

      // Valeur informative en mm (basée sur pixels CSS)
      const availableHeightMm = availableHeightPx * pxToMm;
      console.log('📊 Pagination:');
      console.log('   Hauteur disponible par page:', availableHeightMm.toFixed(1), 'mm');
      console.log('   Hauteur totale du contenu:', finalHeightMm.toFixed(1), 'mm');
      console.log('   Nombre de pages requises:', totalPages);

      // Position de départ (avec marges) - marge de gauche à 5mm
      const x = 5; // Marge de gauche fixée à 5mm
      const y = marginMm;

      if (totalPages === 1) {
        // Document sur une seule page - placement direct SANS SCALE
        console.log('📄 Document tient sur une seule page (SANS SCALE)');

        if (isA4) {
          const totalWidthMm = x + finalWidthMm + marginMm; // 0 + contenu + marge droite
          const totalHeightMm = y + finalHeightMm + marginMm; // marge haut + contenu + marge bas

          console.log('🔍 Validation A4 - 1 page (marge gauche 0):');
          console.log('   Largeur totale:', totalWidthMm.toFixed(1), 'mm /', a4WidthMm, 'mm');
          console.log('   Hauteur totale:', totalHeightMm.toFixed(1), 'mm /', a4HeightMm, 'mm');

          if (totalWidthMm <= a4WidthMm && totalHeightMm <= a4HeightMm) {
            console.log('✅ Le contenu respecte les dimensions A4');
          } else {
            console.log('ℹ️ Le contenu dépasse A4 mais sera exporté avec ses dimensions originales');
          }
        }

        pdf.addImage(imgData, 'PNG', x, y, finalWidthMm, finalHeightMm);
      } else {
        // Document sur plusieurs pages - DÉCOUPAGE en px canvas
        console.log('📄 Génération de', totalPages, 'pages');

        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage(); // Ajouter une nouvelle page
          }

          // Calculer la zone de cette page en pixels (canvas)
          const pageYpx = page * availableHeightPxCanvas;
          const pageHeightPx = Math.min(availableHeightPxCanvas, finalHeightPx - pageYpx);

          // Convertir en mm pour le PDF (revenir en px CSS avant)
          const pageHeightMm = (pageHeightPx / effectiveScale) * pxToMm;

          console.log(`📄 Page ${page + 1}/${totalPages}:`);
          console.log(`   Source: Y=${pageYpx.toFixed(1)}px, Hauteur=${pageHeightPx.toFixed(1)}px`);
          console.log(`   PDF: Y=${y.toFixed(1)}mm, Hauteur=${pageHeightMm.toFixed(1)}mm`);

          // Créer un canvas pour cette portion de page
          const pageCanvas = document.createElement('canvas');
          const pageCtx = pageCanvas.getContext('2d');

          if (!pageCtx) {
            throw new Error('Impossible de créer le contexte 2D pour le canvas de page');
          }

          pageCanvas.width = finalWidthPx;
          pageCanvas.height = pageHeightPx;

          // Copier SEULEMENT la portion nécessaire du canvas original
          pageCtx.drawImage(
            canvas,
            0, pageYpx, // Source X, Y dans le canvas original
            finalWidthPx, pageHeightPx, // Source width, height
            0, 0, // Destination X, Y dans le nouveau canvas
            finalWidthPx, pageHeightPx // Destination width, height
          );

          const pageImgData = pageCanvas.toDataURL('image/png', 1.0);

          // Ajouter l'image de la page au PDF SANS SCALE
          pdf.addImage(pageImgData, 'PNG', x, y, finalWidthMm, pageHeightMm);
        }
      }

      pdf.save(`${fileName}.pdf`);

      console.log('📄 PDF sauvegardé avec succès - Format:', pdfOptions.format.toUpperCase(), 'Marges:', marginMm, 'mm');

    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert('Erreur lors de l\'export PDF: ' + errorMessage);
    }
  };

  const handleExportDOCX = () => {
    alert('Export DOCX avancé - Cette fonctionnalité sera bientôt disponible !');
  };

  const handleExportMD = () => {
    if (!markdown.trim()) {
      alert('Veuillez entrer du contenu Markdown avant d\'exporter');
      return;
    }

    // Créer le contenu Markdown avec métadonnées
    const mdContent = `---
title: ${fileName}
author: MDtoPDF Converter Pro
date: ${new Date().toLocaleDateString('fr-FR')}
format: ${pdfOptions.format.toUpperCase()}
orientation: ${pdfOptions.orientation}
margin: ${pdfOptions.margin}mm
---

# ${fileName}

${markdown}

---
*Généré par MDtoPDF Converter Pro le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}*
*Configuration: Format ${pdfOptions.format.toUpperCase()}, Orientation ${pdfOptions.orientation}, Marge ${pdfOptions.margin}mm*`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  
  const handleExportHTML = () => {
    // Utiliser l'aperçu HTML pour garantir la cohérence
    const previewHTML = convertMarkdownToHTML(markdown);

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: ${isDarkMode ? '#1a1a1a' : '#ffffff'};
            color: ${isDarkMode ? '#ffffff' : '#333333'};
        }
        h1 {
            color: #2563eb;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
            font-weight: 700;
            margin: 30px 0 20px 0;
        }
        h2 {
            color: #1e293b;
            margin-top: 40px;
            font-weight: 600;
            margin: 25px 0 15px 0;
        }
        h3 {
            color: #374151;
            font-weight: 600;
            margin: 20px 0 10px 0;
        }
        p {
            margin: 20px 0;
            text-align: justify;
        }
        ul {
            margin: 15px 0;
            padding-left: 20px;
        }
        li {
            margin: 8px 0;
        }
        code {
            background: ${isDarkMode ? '#374151' : '#f3f4f6'};
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            color: #dc2626;
            font-size: 0.9em;
        }
        pre {
            background: ${isDarkMode ? '#374151' : '#f3f4f6'};
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
        }
        pre code {
            background: transparent;
            padding: 0;
            color: inherit;
        }
        blockquote {
            border-left: 4px solid #2563eb;
            padding-left: 20px;
            color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
            font-style: italic;
            margin: 20px 0;
        }
        strong {
            font-weight: 600;
        }
        em {
            font-style: italic;
        }
        a {
            color: #2563eb;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .metadata {
            margin-top: 40px;
            padding: 20px;
            background: ${isDarkMode ? '#374151' : '#f8fafc'};
            border-radius: 8px;
            font-size: 12px;
            color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
            border: 1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'};
        }
        .metadata strong {
            color: ${isDarkMode ? '#f3f4f6' : '#1f2937'};
        }
        @media print {
            body { padding: 20px; }
            .metadata { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    ${pdfOptions.header ? `<div style="text-align: center; font-size: 12px; color: #6b7280; margin-bottom: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">${pdfOptions.header}</div>` : ''}

    ${previewHTML}

    ${pdfOptions.footer ? `<div style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 10px;">${pdfOptions.footer}</div>` : ''}

    <div class="metadata">
        <strong>Généré par MDtoPDF Converter Pro</strong><br>
        Format: ${pdfOptions.format.toUpperCase()} |
        Orientation: ${pdfOptions.orientation} |
        Taille police: ${pdfOptions.fontSize}pt |
        Marge: ${pdfOptions.margin}mm<br>
        Pages estimées: ${getEstimatedPages()} |
        Mots: ${getWordCount()} |
        Caractères: ${markdown.length}<br>
        <small>Créé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</small>
    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const containerStyle = {
    backgroundColor: isDarkMode ? '#0f0f23' : '#f8fafc',
    color: isDarkMode ? '#f1f5f9' : '#1e293b',
    padding: '32px',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    lineHeight: '1.1',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0,
    marginBottom: '8px'
  };

  const buttonStyle = {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const panelStyle = {
    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
    border: '1px solid ' + (isDarkMode ? '#334155' : '#e2e8f0'),
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: isDarkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const tabButtonStyle = (isActive: boolean) => ({
    flex: 1,
    padding: '14px 20px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: isActive
      ? (isDarkMode ? '#3b82f6' : '#2563eb')
      : 'transparent',
    color: isActive
      ? 'white'
      : (isDarkMode ? '#94a3b8' : '#64748b'),
    fontSize: '14px',
    fontWeight: isActive ? '700' : '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease'
  });

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
    borderRadius: '8px',
    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    color: isDarkMode ? '#f1f5f9' : '#1f2937',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '400px',
    padding: '16px',
    border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
    borderRadius: '12px',
    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
    color: isDarkMode ? '#f1f5f9' : '#1f2937',
    fontSize: '14px',
    fontFamily: '"SF Mono", Monaco, "Cascadia Code", monospace',
    resize: 'vertical' as const,
    transition: 'all 0.2s ease',
    lineHeight: '1.6'
  };

  // Obtenir le thème de preview actuel
  const currentTheme = getPreviewTheme();

  // Templates fictifs pour démonstration
  const templates = [
    {
      id: 1,
      name: 'Moderne Pro',
      description: 'Design épuré avec typographie moderne',
      category: 'professionnel'
    },
    {
      id: 2,
      name: 'Academic',
      description: 'Format académique formel pour publications',
      category: 'éducation'
    },
    {
      id: 3,
      name: 'Creative',
      description: 'Design créatif avec couleurs et mise en page dynamique',
      category: 'créatif'
    }
  ];

  return (
    <div style={containerStyle} data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        height: '80px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <RocketLaunchIcon
            style={{
              width: '48px',
              height: '48px',
              color: '#3b82f6',
              filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.4))'
            }}
          />
          <div>
            <h1 style={headerStyle}>Markdown to PDF Converter</h1>
            <div style={{ fontSize: '14px', color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: '500' }}>
              {getWordCount().toLocaleString()} mots • ~{getEstimatedPages()} pages • Conversion professionnelle
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            padding: '12px 20px',
            backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
            color: isDarkMode ? '#f1f5f9' : '#475569',
            border: '1px solid ' + (isDarkMode ? '#475569' : '#e2e8f0'),
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          {isDarkMode ? <SunIcon style={{ width: '18px', height: '18px' }} /> : <MoonIcon style={{ width: '18px', height: '18px' }} />}
          {isDarkMode ? 'Clair' : 'Sombre'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
        borderRadius: '12px',
        padding: '6px',
        marginBottom: '24px',
        border: '1px solid ' + (isDarkMode ? '#334155' : '#e2e8f0')
      }}>
        <button
          onClick={() => { setShowTemplates(false); setShowExport(false); }}
          style={tabButtonStyle(!showTemplates && !showExport)}
        >
          <Cog6ToothIcon style={{ width: '18px', height: '18px' }} />
          Options PDF
        </button>
        <button
          onClick={() => { setShowTemplates(true); setShowExport(false); }}
          style={tabButtonStyle(showTemplates)}
        >
          <SwatchIcon style={{ width: '18px', height: '18px' }} />
          Templates ({templates.length})
        </button>
        <button
          onClick={() => { setShowTemplates(false); setShowExport(true); }}
          style={tabButtonStyle(showExport)}
        >
          <ArrowDownTrayIcon style={{ width: '18px', height: '18px' }} />
          Export
        </button>
      </div>

      {/* Options Panel */}
      {!showTemplates && !showExport && (
        <>
          <div style={panelStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
              <Cog6ToothIcon style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
              Options PDF
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px', fontWeight: '600', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Format
                </label>
                <select
                  value={pdfOptions.format}
                  onChange={(e) => updatePDFOptions({ format: e.target.value })}
                  style={{...inputStyle, padding: '6px 8px', fontSize: '12px' }}
                >
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                  <option value="a3">A3</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px', fontWeight: '600', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Orientation
                </label>
                <select
                  value={pdfOptions.orientation}
                  onChange={(e) => updatePDFOptions({ orientation: e.target.value })}
                  style={{...inputStyle, padding: '6px 8px', fontSize: '12px' }}
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Paysage</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px', fontWeight: '600', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Police (pt)
                </label>
                <input
                  type="number"
                  min="8"
                  max="24"
                  value={pdfOptions.fontSize}
                  onChange={(e) => updatePDFOptions({ fontSize: parseInt(e.target.value) })}
                  style={{...inputStyle, padding: '6px 8px', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px', fontWeight: '600', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Marge (mm)
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={pdfOptions.margin}
                  onChange={(e) => updatePDFOptions({ margin: parseInt(e.target.value) })}
                  style={{...inputStyle, padding: '6px 8px', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px', fontWeight: '600', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  En-tête
                </label>
                <input
                  type="text"
                  placeholder="En-tête..."
                  value={pdfOptions.header}
                  onChange={(e) => updatePDFOptions({ header: e.target.value })}
                  style={{...inputStyle, padding: '6px 8px', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '2px', fontSize: '11px', fontWeight: '600', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  Pied de page
                </label>
                <input
                  type="text"
                  placeholder="Pied de page..."
                  value={pdfOptions.footer}
                  onChange={(e) => updatePDFOptions({ footer: e.target.value })}
                  style={{...inputStyle, padding: '6px 8px', fontSize: '12px' }}
                />
              </div>
            </div>

            <FileNameInput
              value={fileName}
              onChange={setFileName}
              placeholder="document"
              isDarkMode={isDarkMode}
              buttonText="Exporter en PDF"
              onButtonClick={handleExportPDF}
              showIcon={true}
            />
          </div>

          <div style={panelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                <PencilIcon style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
              Éditeur Markdown
              </h3>
              <button
                onClick={() => setShowPreview(!showPreview)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: showPreview ? (isDarkMode ? '#3b82f6' : '#2563eb') : (isDarkMode ? '#374151' : '#f3f4f6'),
                  color: showPreview ? 'white' : (isDarkMode ? '#f1f5f9' : '#1f2937'),
                  border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <EyeIcon style={{ width: '16px', height: '16px' }} />
                {showPreview ? 'Masquer' : 'Afficher'} l'aperçu
              </button>
            </div>

            <div style={{ display: showPreview ? 'grid' : 'block', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr', gap: '16px' }}>
              {/* Éditeur */}
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    ✏️ Source Markdown
                  </label>
                </div>
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  style={textareaStyle}
                  placeholder="Entrez votre contenu Markdown ici..."
                />
              </div>

              {/* Aperçu Avancé */}
              {showPreview && (
                <div>
                  {/* Contrôles du preview */}
                  <div style={{
                    marginBottom: '16px',
                    padding: '12px',
                    background: isDarkMode ? '#1e293b' : '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid ' + (isDarkMode ? '#334155' : '#e2e8f0')
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: isDarkMode ? '#f1f5f9' : '#1e293b'
                      }}>
                        <EyeIcon style={{ width: '16px', height: '16px' }} />
                        Aperçu Avancé
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '12px',
                        color: isDarkMode ? '#94a3b8' : '#64748b'
                      }}>
                        <span>{getWordCount()} mots</span>
                        <span>•</span>
                        <span>~{getEstimatedPages()} pages</span>
                        <span>•</span>
                        <span>{previewZoom}%</span>
                      </div>
                    </div>

                    {/* Sélecteur de thème */}
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{
                        display: 'flex',
                        marginBottom: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: isDarkMode ? '#94a3b8' : '#64748b'
                      }}>
                        <SwatchIcon style={{ width: '14px', height: '14px', marginRight: '6px', verticalAlign: 'middle' }} />
                        Thème de l'aperçu
                      </label>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '8px'
                      }}>
                        {[
                          { key: 'modern', label: 'Moderne', icon: <SparklesIcon style={{ width: '12px', height: '12px' }} /> },
                          { key: 'classic', label: 'Classique', icon: <BookOpenIcon style={{ width: '12px', height: '12px' }} /> },
                          { key: 'academic', label: 'Académique', icon: <AcademicCapIcon style={{ width: '12px', height: '12px' }} /> },
                          { key: 'minimal', label: 'Minimal', icon: <CircleStackIcon style={{ width: '12px', height: '12px' }} /> }
                        ].map((theme) => (
                          <button
                            key={theme.key}
                            onClick={() => setPreviewTheme(theme.key as any)}
                            style={{
                              padding: '8px 12px',
                              border: '1px solid ' + (previewTheme === theme.key
                                ? (isDarkMode ? '#3b82f6' : '#2563eb')
                                : (isDarkMode ? '#475569' : '#d1d5db')),
                              borderRadius: '8px',
                              background: previewTheme === theme.key
                                ? (isDarkMode ? '#3b82f6' : '#2563eb')
                                : (isDarkMode ? '#0f172a' : '#ffffff'),
                              color: previewTheme === theme.key
                                ? '#ffffff'
                                : (isDarkMode ? '#f1f5f9' : '#1f2937'),
                              fontSize: '11px',
                              fontWeight: previewTheme === theme.key ? '600' : '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            {theme.icon} {theme.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contrôle de zoom */}
                    <div style={{
                      display: 'flex',
                      flexDirection:'row',
                      alignItems: 'center',
                      gap: '6 px'
                    }}>
                      <div>
                        <MagnifyingGlassIcon style={{ width: '14px', height: '14px', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                        </div>
                      <div>

                      <label style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        minWidth: '60px',
                        marginRight:'16px'
                      }}>
                        
                        Zoom
                      </label>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flex: 1
                      }}>
                        <button
                          onClick={() => setPreviewZoom(Math.max(50, previewZoom - 10))}
                          style={{
                            padding: '4px 6px',
                            border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
                            borderRadius: '4px',
                            backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                            color: isDarkMode ? '#f1f5f9' : '#1f2937',
                            cursor: 'pointer'
                          }}
                        >
                          <MinusIcon style={{ width: '14px', height: '14px' }} />
                        </button>
                        <input
                          type="range"
                          min="50"
                          max="150"
                          value={previewZoom}
                          onChange={(e) => setPreviewZoom(parseInt(e.target.value))}
                          style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: '2px',
                            background: isDarkMode ? '#475569' : '#d1d5db',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        />
                        <button
                          onClick={() => setPreviewZoom(Math.min(150, previewZoom + 10))}
                          style={{
                            width: '28px',
                            height: '28px',
                            border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
                            borderRadius: '6px',
                            background: isDarkMode ? '#0f172a' : '#ffffff',
                            color: isDarkMode ? '#f1f5f9' : '#1f2937',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <PlusIcon style={{ width: '14px', height: '14px' }} />
                        </button>
                        <button
                          onClick={() => setPreviewZoom(100)}
                          style={{
                            padding: '4px 8px',
                            border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
                            borderRadius: '6px',
                            background: isDarkMode ? '#1e293b' : '#f1f5f9',
                            color: isDarkMode ? '#f1f5f9' : '#1f2937',
                            fontSize: '10px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <ArrowPathIcon style={{ width: '12px', height: '12px' }} />
                        </button>
                        <button
                          onClick={() => setPreviewZoom(100)}
                          style={{
                            padding: '4px 8px',
                            border: '1px solid ' + (isDarkMode ? '#475569' : '#d1d5db'),
                            borderRadius: '6px',
                            background: isDarkMode ? '#1e293b' : '#f1f5f9',
                            color: isDarkMode ? '#f1f5f9' : '#1f2937',
                            fontSize: '10px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Conteneur du preview avec scroll */}
                  <div style={{
                    position: 'relative',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    overflowX: 'auto',
                    borderRadius: '16px',
                    background: isDarkMode ? '#0f172a' : '#f8fafc',
                    border: '1px solid ' + (isDarkMode ? '#334155' : '#e2e8f0'),
                    padding: '20px'
                  }}>
                    <div
                      ref={markdownRef}
                      style={{
                        ...currentTheme.container,
                        minHeight: '500px',
                        width: '100%',
                        maxWidth: '800px',
                        margin: '0 auto'
                      }}
                      className="markdown-preview"
                      dangerouslySetInnerHTML={{ __html: previewHTML }}
                    />
                    <style>{currentTheme.css}</style>

                    {/* Indicateur de position */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: isDarkMode ? '#1e293b' : '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '600',
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {previewTheme}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Templates Panel */}
      {showTemplates && (
        <div style={panelStyle}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
            <SparklesIcon style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
            Templates Professionnels
          </h3>

          <div style={{ display: 'grid', gap: '16px' }}>
            {templates.map((template) => (
              <div key={template.id} style={{
                border: '1px solid ' + (isDarkMode ? '#334155' : '#e2e8f0'),
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: isDarkMode ? '#f1f5f9' : '#1e293b', marginBottom: '4px' }}>
                      {template.name}
                    </div>
                    <div style={{ fontSize: '14px', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: '1.5' }}>
                      {template.description}
                    </div>
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    backgroundColor: isDarkMode ? '#3b82f6' : '#dbeafe',
                    color: isDarkMode ? '#ffffff' : '#1d4ed8',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {template.category}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button style={{
            width: '100%',
            padding: '16px',
            marginTop: '20px',
            border: '2px dashed ' + (isDarkMode ? '#475569' : '#cbd5e1'),
            borderRadius: '12px',
            backgroundColor: 'transparent',
            color: isDarkMode ? '#64748b' : '#94a3b8',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}>
            <PlusIcon style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
            Créer un template personnalisé
          </button>
        </div>
      )}

      {/* Export Panel */}
      {showExport && (
        <div style={panelStyle}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
            📤 Export Multi-Formats
          </h3>

          <div style={{
            backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid ' + (isDarkMode ? '#334155' : '#e2e8f0')
          }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
              <ChartBarIcon style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle' }} />
              Statistiques du document
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '14px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                  {getWordCount().toLocaleString()}
                </div>
                <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '12px' }}>
                  Mots
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
                  {getEstimatedPages()}
                </div>
                <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '12px' }}>
                  Pages est.
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
                  {markdown.length.toLocaleString()}
                </div>
                <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '12px' }}>
                  Caractères
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
              Nom du fichier
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="document"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <button onClick={handleExportPDF} style={buttonStyle}>
              <DocumentArrowDownIcon style={{ width: '20px', height: '20px' }} />
              Exporter en PDF (HD)
            </button>

            <button onClick={handleExportMD} style={{
              ...buttonStyle,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              <DocumentTextIcon style={{ width: '20px', height: '20px' }} />
              Exporter en Markdown (.md)
            </button>

            <button onClick={handleExportDOCX} style={{
              ...buttonStyle,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <ArrowUpTrayIcon style={{ width: '20px', height: '20px' }} />
              Exporter en Word (DOCX)
            </button>

            <button onClick={handleExportHTML} style={{
              ...buttonStyle,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              🌐 Exporter en HTML (Interactif)
            </button>
          </div>

          {!markdown.trim() && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: isDarkMode ? '#7c2d12' : '#fef3c7',
              border: '1px solid ' + (isDarkMode ? '#dc2626' : '#f59e0b'),
              borderRadius: '12px',
              fontSize: '14px',
              color: isDarkMode ? '#fbbf24' : '#92400e',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              ⚠️ Veuillez entrer du contenu Markdown pour activer l'export
            </div>
          )}

          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
            borderRadius: '12px',
            fontSize: '12px',
            color: isDarkMode ? '#64748b' : '#475569',
            textAlign: 'center'
          }}>
            <strong>✨ Fonctionnalités Pro:</strong> Export haute qualité • Templates personnalisés • Métadonnées • Optimisation automatique
          </div>
        </div>
      )}
    </div>
  );
};

export default ProMarkdownToPDF;
