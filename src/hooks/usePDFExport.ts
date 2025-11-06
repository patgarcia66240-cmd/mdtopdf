import { usePDFQuery } from "./api/usePDFQuery";
import { useMarkdownToPDF } from "./useMarkdownToPDF.ts";
import { exportService } from "../services/exportService";

export const usePDFExport = () => {
  const pdfQuery = usePDFQuery();
  const { convertToPDF } = useMarkdownToPDF();

  const exportToPDF = async (
    elementRef: React.RefObject<HTMLDivElement | null>,
    fileName: string,
    pdfOptions?: any
  ) => {
    if (elementRef?.current) {
      await convertToPDF(elementRef as React.RefObject<HTMLElement>, fileName, pdfOptions);
    } else {
      alert("Aucun contenu disponible pour export local");
    }
  };

  const exportToHTML = async (markdown: string, fileName: string, previewElement?: React.RefObject<HTMLDivElement | null>) => {
    // Récupérer le HTML du preview si disponible
    let previewHTML = '';
    if (previewElement?.current) {
      previewHTML = previewElement.current.innerHTML;
      console.log('Preview HTML récupéré, longueur:', previewHTML.length);
      console.log('Contient PAGEBREAK?', previewHTML.includes('<!--PAGEBREAK-->'));

      // Debug: afficher un extrait du HTML
      if (previewHTML.length > 0) {
        console.log('Extrait du HTML preview:', previewHTML.substring(0, 200) + '...');
      }
    }

    // Utiliser le service d'export modifié qui accepte le preview HTML
    await exportService.exportDocument({
      format: 'html',
      filename: fileName,
      markdown,
      previewHTML // Passer le preview HTML au service
    });
  };

  const generateHTMLFromPreview = async (fileName: string, previewElement?: React.RefObject<HTMLDivElement | null>, markdown?: string): Promise<string> => {
    if (!previewElement?.current) {
      // Fallback si pas d'élément de preview disponible
      return generateFallbackHTML(fileName, markdown || '');
    }

    // Récupérer le HTML directement du DOM du preview
    const previewHTML = previewElement.current.innerHTML;

    // Utiliser uniquement nos propres styles (pas de getComputedStyle)
    const styles = `
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `;

    // Créer le HTML complet avec le contenu exact du preview
    const fullHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
        <style>
        /* Styles de l'aperçu récupérés */
        .preview-container {
            ${styles}
            min-height: 100vh;
            max-width: 1200px; /* Limite pour respecter le format A4 */
            margin: 40px auto; /* Marges importantes pour centrer */
            padding: 40px; /* Marges intérieures */
        }

        /* Conteneur pour pages A4 avec format strict */
        .a4-pages-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px; /* Espacement entre pages */
            width: 100%;
            max-width: 800px; /* Largeur A4 optimale */
            margin: 0 auto;
        }

        /* Pages A4 avec format strict et centrage */
        .a4-page {
            background-color: #ffffff;
            width: 100%;
            max-width: 210mm; /* Largeur A4 exacte */
            height: 297mm; /* Hauteur A4 exacte */
            aspect-ratio: 210/297; /* Ratio A4 parfait */
            border: 3px solid #1a202c;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            border-radius: 8px;
            position: relative;
            overflow: hidden;
            margin: 0 auto; /* Centrage horizontal */
            page-break-after: always;
        }

        /* Appliquer le style aux pages A4 dans le preview */
        .preview-export div[style*="aspect-ratio"] {
            background-color: #ffffff !important;
            border: 3px solid #1a202c !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
            border-radius: 8px !important;
            position: relative !important;
            overflow: hidden !important;
            max-width: 210mm !important; /* Largeur A4 stricte */
            width: 100% !important;
            aspect-ratio: 210/297 !important;
            margin: 0 auto !important;
            page-break-after: always !important;
        }

        /* Styles CSS importés du fichier preview-export.css */
    .preview-export {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 2px 4px;
      margin: 1px 0;
      font-family: 'Courier New', 'Consolas', monospace;
      font-size: 9px;
      line-height: 0.3;
      overflow-x: auto;
      white-space: pre;
      word-wrap: normal;
      overflow-wrap: normal;
    }

    .preview-code {
      background: none;
      padding: 0;
      border-radius: 0;
      font-family: inherit;
      font-size: inherit;
      color: inherit;
      white-space: pre;
    }

    /* Optimisation des blocs de code pour format hyper-compact */
    .preview-export pre {
            background-color: #f8fafc !important;
            padding: 2px 4px !important; /* Encore plus compact */
            border-radius: 3px !important;
            border: 1px solid #e2e8f0 !important;
            overflow-x: auto !important;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
            font-size: 9px !important; /* Encore plus petit */
            line-height: 0.3 !important; /* Ultra hyper compact */
            margin: 1px 0 !important; /* Minimal */
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
        }

        .preview-export code {
            background-color: #f1f5f9 !important;
            padding: 2px 4px !important;
            border-radius: 3px !important;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
            font-size: 10px !important;
        }

        .preview-export pre code {
            background: none !important;
            padding: 0 !important;
            border: none !important;
            font-size: inherit !important;
        }

        /* Compactage des tableaux */
        .preview-export table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 8px 0 !important; /* Plus compact */
            font-size: 11px !important; /* Plus petit */
        }

        .preview-export th,
        .preview-export td {
            border: 1px solid #e2e8f0 !important;
            padding: 4px 6px !important; /* Plus compact */
            text-align: left !important;
        }

        .preview-export th {
            background-color: #f8fafc !important;
            font-weight: 600 !important;
            font-size: 10px !important;
        }

        /* Compactage des listes */
        .preview-export ul,
        .preview-export ol {
            margin: 6px 0 !important; /* Plus compact */
            padding-left: 16px !important;
        }

        .preview-export li {
            margin: 1px 0 !important; /* Minimal */
            line-height: 1.0 !important; /* Interligne compact */
        }

        /* Compactage des titres */
        .preview-export h1 {
            font-size: 16px !important;
            margin: 6px 0 2px 0 !important; /* Ultra compact */
            line-height: 1.1 !important;
        }

        .preview-export h2 {
            font-size: 14px !important;
            margin: 5px 0 2px 0 !important; /* Ultra compact */
            line-height: 1.1 !important;
        }

        .preview-export h3 {
            font-size: 12px !important;
            margin: 4px 0 1px 0 !important; /* Ultra compact */
            line-height: 1.1 !important;
        }

        /* Compactage des paragraphes avec gestion du code */
        .preview-export p {
            margin: 0 !important; /* Aucune marge */
            line-height: 0.5 !important; /* Interligne minimal */
        }

        /* Paragraphes contenant du code */
        .preview-export p:has(code) {
            margin: 0px 0 !important; /* Aucune marge */
            line-height: 0.5 !important; /* Encore plus compact */
        }

        /* Code inline dans les paragraphes */
        .preview-export p code {
            background-color: #f1f5f9 !important;
            padding: 1px 1px !important; /* Ultra minimal */
            border-radius: 2px !important;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
            font-size: 10px !important;
            margin: 0 !important;
            display: inline-block;
        }

        /* Compactage des blockquotes */
        .preview-export blockquote {
            border-left: 3px solid #e2e8f0 !important;
            padding-left: 10px !important; /* Plus compact */
            margin: 6px 0 !important;
            font-style: italic !important;
            color: #6b7280 !important;
            line-height: 0.2!important;
        }

        /* Styles pour l'impression optimisés et compacts */
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
            font-size: 11px !important; /* Plus compact pour le papier */
            line-height: 0.3 !important;
          }

          /* Police monospace hyper-compacte pour le code à l'impression */
          .preview-export pre,
          .preview-export code {
            font-family: 'Courier New', monospace !important;
            font-size: 8px !important; /* Hyper compact à l'impression */
            line-height: 1.05 !important; /* Hyper-compact */
          }

          .preview-export pre {
            padding: 2px 3px !important; /* Minimaliste absolu */
            margin: 1px 0 !important; /* Presque inexistant */
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
          }

          /* Tableaux compacts à l'impression */
          .preview-export table {
            font-size: 9px !important;
            margin: 4px 0 !important;
          }

          .preview-export th,
          .preview-export td {
            padding: 2px 4px !important; /* Ultra compact */
          }

          /* Titres compacts à l'impression */
          .preview-export h1 { font-size: 14px !important; margin: 8px 0 3px 0 !important; }
          .preview-export h2 { font-size: 12px !important; margin: 6px 0 2px 0 !important; }
          .preview-export h3 { font-size: 11px !important; margin: 4px 0 1px 0 !important; }

          /* Paragraphes et listes hyper-compacts */
          .preview-export p {
            margin: 2px 0 !important;
            line-height: 1.1 !important;
          }

          .preview-export p:has(code) {
            margin: 1px 0 !important;
            line-height: 1.05 !important;
          }

          .preview-export li {
            margin: 1px 0 !important;
            line-height: 1.1 !important;
          }

          .preview-export ul,
          .preview-export ol {
            margin: 2px 0 !important;
          }

          /* Blockquotes compacts */
          .preview-export blockquote {
            margin: 3px 0 !important;
            padding-left: 6px !important;
            line-height: 1.2 !important;
          }

          .preview-export {
            background: white;
            box-shadow: none;
            border: none;
            padding: 0;
            margin: 0;
            max-width: none;
          }

          /* Masquer l'en-tête à l'impression */
          .preview-export > div:first-child {
            display: none !important;
          }

          /* Conteneur pages pour impression */
          .a4-pages-container {
            max-width: none;
            gap: 0;
            margin: 0;
            padding: 0;
          }

          /* Pages A4 format papier */
          .a4-page,
          .preview-export div[style*="aspect-ratio"] {
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            border: 1px solid #333 !important;
            box-shadow: none !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            margin: 0 !important;
            padding: 20mm 15mm !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }

          /* Dernière page pas de saut */
          .a4-page:last-child,
          .preview-export div[style*="aspect-ratio"]:last-child {
            page-break-after: auto !important;
          }

          /* Masquer les bordures décoratives à l'impression */
          div[style*="border: 2px dashed"],
          div[style*="border: 1px solid #667eea"],
          div[style*="border-left: 4px solid #e53e3e"],
          div[style*="background: linear-gradient"] {
            display: none !important;
          }
        }
    </style>
</head>
<body>
    <div class="preview-export">
        <!-- En-tête élégant pour l'export -->
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border-radius: 16px; border: 1px solid rgba(102, 126, 234, 0.2);">
            <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                📄 Document A4 Exporté
            </h1>
            <p style="margin: 0; font-size: 16px; color: #6b7280; font-weight: 500;">
                ${fileName} • Généré le ${new Date().toLocaleDateString('fr-FR')}
            </p>
        </div>

        <!-- Conteneur pour les pages A4 centrées et formatées -->
        <div class="a4-pages-container">
            ${previewHTML}
        </div>
    </div>
</body>
</html>`;

    return fullHTML;
  };

  const generateFallbackHTML = async (fileName: string, markdown: string): Promise<string> => {
    // Utiliser marked pour convertir le markdown en HTML
    const { marked } = await import('marked');

    // Configuration de marked
    const options = {
      breaks: true,
      gfm: true,
      sanitize: false,
      pedantic: false,
      smartLists: true,
      smartypants: false,
      mangle: false,
      headerIds: false
    };

    // Traiter les sauts de page
    let processedMarkdown = markdown.replace(/<!--\s*pagebreak\s*-->/gi, '\n<!--PAGEBREAK-->\n');
    let html = await marked(processedMarkdown, options);

    // Diviser le contenu en pages
    const pages = html.split(/<!--PAGEBREAK-->/gi).filter(page => page.trim());

    // Générer le HTML avec un BEL affichage inspiré du preview
    const pageHTML = pages.map((pageContent, index) => `
      <!-- En-tête de page -->
      <div style="
        text-align: center;
        margin-bottom: 20px;
      ">
        <h3 style="
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        ">
          <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Aperçu A4 - Page ${index + 1}/${pages.length}
        </h3>
      </div>

      <!-- Page A4 avec BEL affichage -->
      <div style="
        position: relative;
        margin-bottom: ${index < pages.length - 1 ? '40px' : '0'};
        page-break-after: ${index < pages.length - 1 ? 'always' : 'auto'};
      ">
        <!-- Conteneur de la page A4 -->
        <div style="
          background: #ffffff;
          width: 100%; /* Prend toute la largeur disponible */
          height: calc(100vw * 297 / 210); /* Calcule la hauteur en fonction du ratio A4 */
          max-height: 100vh; /* Limite à la hauteur de l'écran */
          aspect-ratio: 210/297; /* Conserve le ratio A4 parfait */
          margin: 0;
          padding: 3% 4%; /* Padding en pourcentage pour s'adapter */
          box-sizing: border-box;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          border: 3px solid #1a202c;
          position: relative;
          overflow: hidden;
        ">
          <!-- Bordures multiples pour meilleure visibilité -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 2px dashed #484747ff;
            border-radius: 6px;
            margin: 3px;
            pointer-events: none;
            z-index: 2;
          "></div>

          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 1px solid #667eea;
            border-radius: 5px;
            margin: 8px;
            pointer-events: none;
            z-index: 1;
          "></div>

          <!-- En-tête de page stylisé -->
          <div style="
            position: absolute;
            top: 8mm;
            left: 15mm;
            right: 15mm;
            height: 1px;
            background: linear-gradient(90deg, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent);
          "></div>

          <!-- Badge de page -->
          <div style="
            position: absolute;
            top: 3%;
            right: 4%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.5% 1.5%;
            border-radius: 20px;
            font-size: clamp(10px, 1.5vw, 14px);
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
            z-index: 10;
          ">
            ${index + 1}
          </div>

          <!-- Contenu principal -->
          <div style="
            color: #1e293b;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            font-size: clamp(11px, 1.8vw, 16px);
            height: calc(100% - 15%);
            margin-top: 6%;
            overflow-y: auto;
            position: relative;
            z-index: 1;
          ">
            ${pageContent}
          </div>

          <!-- Pied de page élégant -->
          <div style="
            position: absolute;
            bottom: 3%;
            left: 4%;
            right: 4%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 2%;
            border-top: 1px solid #e2e8f0;
          ">
            <div style="
              font-size: clamp(9px, 1.2vw, 12px);
              color: #9ca3af;
              font-style: italic;
            ">
              Généré par MDtoPDF Pro
            </div>
            <div style="
              font-size: clamp(9px, 1.2vw, 12px);
              color: #6b7280;
              font-weight: 500;
            ">
              Page ${index + 1} sur ${pages.length}
            </div>
          </div>

          <!-- Coins décoratifs renforcés -->
          <div style="position: absolute; top: -5px; left: -5px; width: 20px; height: 20px; border-left: 4px solid #e53e3e; border-top: 4px solid #e53e3e; border-radius: 4px 0 0 0; z-index: 3;"></div>
          <div style="position: absolute; top: -5px; right: -5px; width: 20px; height: 20px; border-right: 4px solid #e53e3e; border-top: 4px solid #e53e3e; border-radius: 0 4px 0 0; z-index: 3;"></div>
          <div style="position: absolute; bottom: -5px; left: -5px; width: 20px; height: 20px; border-left: 4px solid #e53e3e; border-bottom: 4px solid #e53e3e; border-radius: 0 0 0 4px; z-index: 3;"></div>
          <div style="position: absolute; bottom: -5px; right: -5px; width: 20px; height: 20px; border-right: 4px solid #e53e3e; border-bottom: 4px solid #e53e3e; border-radius: 0 0 4px 0; z-index: 3;"></div>

          <!-- Bordure extérieure visible -->
          <div style="
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            border: 1px solid #cbd5e0;
            border-radius: 12px;
            pointer-events: none;
            z-index: 0;
          "></div>

          <!-- Indicateurs centraux -->
          <div style="
            position: absolute;
            top: 50%;
            left: -15px;
            right: -15px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #667eea, transparent);
            transform: translateY(-50%);
            z-index: 1;
          "></div>

          <div style="
            position: absolute;
            left: 50%;
            top: -15px;
            bottom: -15px;
            width: 2px;
            background: linear-gradient(0deg, transparent, #667eea, transparent);
            transform: translateX(-50%);
            z-index: 1;
          "></div>
        </div>

        <!-- Séparateur élégant entre pages -->
        ${index < pages.length - 1 ? `
          <div style="
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            <div style="
              width: 40px;
              height: 1px;
              background: linear-gradient(90deg, transparent, #cbd5e0, transparent);
            "></div>
            <div style="
              width: 8px;
              height: 8px;
              background: #cbd5e0;
              border-radius: 50%;
            "></div>
            <div style="
              width: 40px;
              height: 1px;
              background: linear-gradient(90deg, #cbd5e0, transparent, transparent);
            "></div>
          </div>
        ` : ''}
      </div>
    `).join('');

    // HTML complet avec les EXACTS mêmes styles que l'aperçu PDF
    const fullHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        /* Conteneur principal avec BEL affichage */
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
        }

        .preview-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 1400px; /* Même limitation que l'application */
            margin: 0 auto;
        }

        .content-wrapper {
            background: rgba(248, 250, 252, 0.8);
            border-radius: 16px;
            padding: 30px;
            overflow: visible;
            display: flex;
            justify-content: center;
        }

        .pages-container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 20px;
          width: 100%; /* Prend toute la largeur disponible */
        }

        /* En-tête principal */
        .main-header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            border-radius: 16px;
            border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .main-title {
            font-size: 32px;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0 0 10px 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .main-subtitle {
            font-size: 16px;
            color: #6b7280;
            margin: 0;
            font-weight: 500;
        }

        @media print {
          .preview-container, .content-wrapper {
            background: white;
            border: none;
            padding: 0;
            margin: 0;
            box-shadow: none;
          }
          .main-header {
            display: none;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          /* Restaurer les dimensions A4 réelles à l'impression */
          div[style*="width: 100%"] {
            width: 210mm !important;
            height: 297mm !important;
            aspect-ratio: 210/297 !important;
            max-height: none !important;
            padding: 20mm 15mm !important;
          }
          /* Masquer les bordures décoratives à l'impression */
          div[style*="border: 2px dashed #e53e3e"],
          div[style*="border: 1px solid #667eea"],
          div[style*="border-left: 4px solid #e53e3e"],
          div[style*="background: linear-gradient"] {
            display: none !important;
          }
          /* Garder seulement une bordure simple à l'impression */
          div[style*="border: 3px solid #1a202c"] {
            border: 1px solid #333 !important;
          }
          /* Positions absolues en mm pour l'impression */
          div[style*="top: 3%"] { top: 12mm !important; }
          div[style*="right: 4%"] { right: 15mm !important; }
          div[style*="bottom: 3%"] { bottom: 8mm !important; }
          div[style*="left: 4%"] { left: 15mm !important; }
        }

        @media screen {
          body {
            background: #f5f5f5;
            margin: 0;
            padding: 0;
          }
        }

        /* Styles pour les éléments markdown */
        h1 { color: #1e293b; font-size: 18px; margin: 16px 0 8px 0; font-weight: 700; }
        h2 { color: #334155; font-size: 15px; margin: 12px 0 6px 0; font-weight: 600; }
        h3 { color: #475569; font-size: 13px; margin: 10px 0 4px 0; font-weight: 600; }
        p { margin: 8px 0; }
        ul, ol { margin: 8px 0; padding-left: 16px; }
        li { margin: 3px 0; }
        blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 12px;
          margin: 8px 0;
          font-style: italic;
          color: #6b7280;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 6px 0;
          font-size: 0.75em;
        }
        th {
          border: 1px solid #e5e7eb;
          padding: 3px 5px;
          background-color: #f8fafc;
          text-align: left;
          font-weight: 600;
          font-size: 0.7em;
        }
        td {
          border: 1px solid #e5e7eb;
          padding: 3px 5px;
          font-size: 0.7em;
        }
        code {
          background-color: #f8fafc;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        pre {
          background-color: #f8fafc;
          padding: 8px;
          border-radius: 4px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 0.65em;
          border: 1px solid #e5e7eb;
        }
        a { color: #3b82f6; text-decoration: none; }
        a:hover { color: #2563eb; text-decoration: underline; }
    </style>
</head>
<body>
    <!-- Structure avec BEL affichage -->
    <div class="preview-container">
        <!-- En-tête principal élégant -->
        <div class="main-header">
            <h1 class="main-title">📄 Document A4 Exporté</h1>
            <p class="main-subtitle">${fileName} • ${pages.length} page${pages.length > 1 ? 's' : ''} • Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div class="content-wrapper">
            <div class="pages-container">
                ${pageHTML}
            </div>
        </div>
    </div>
</body>
</html>`;

    return fullHTML;
  };

  const exportToMarkdown = async (markdown: string, fileName: string) => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.md`;
    a.click();
    a.remove();
  };

  const exportToDOCX = async (markdown: string, fileName: string) => {
    await exportService.exportDocument({
      format: 'docx',
      filename: fileName,
      markdown,
    });
  };

  return {
    exportToPDF,
    exportToHTML,
    exportToMarkdown,
    exportToDOCX,
    isExporting: pdfQuery.isPending,
  };
};
