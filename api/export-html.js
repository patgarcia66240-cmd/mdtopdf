import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { parse } from "node-html-parser";
import DOMPurify from "isomorphic-dompurify";

// --- Instance du moteur Markdown (créée une seule fois)
const markdownProcessor = remark().use(gfm).use(html);

/**
 * Découpe un HTML en pages selon :
 * - des balises <div class="page"> (preview)
 * - ou des commentaires <!-- pagebreak -->
 */
function splitIntoPages(htmlContent) {
  const root = parse(htmlContent);
  const pageElements = root.querySelectorAll("div.page");

  if (pageElements.length > 0) {
    return pageElements.map((pageEl) =>
      DOMPurify.sanitize(pageEl.innerHTML.trim())
    );
  }

  return htmlContent
    .split(/<!--\s*pagebreak\s*-->/gi)
    .map((page) => DOMPurify.sanitize(page.trim()));
}
/**
 * Génère le squelette HTML complet avec style multi-pages A4
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function generateMultiPageHTML(pages, fileName) {
  const pageTitle = escapeHtml(fileName || "Document");

  const htmlHeader = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 20px;
      background: #ffffff;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      background: white;
      margin: 0 auto 20px auto;
      padding: 20mm;
      border: 1px solid #e2e8f0;
      box-sizing: border-box;
      page-break-after: always;
      position: relative;
    }
    .page:last-child {
      page-break-after: avoid;
      margin-bottom: 0;
    }
    .page-header {
      position: absolute;
      top: 10mm;
      left: 20mm;
      right: 20mm;
      height: 15mm;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }
    .page-content {
      margin-top: 30mm;
      margin-bottom: 20mm;
    }
    .page-footer {
      position: absolute;
      bottom: 10mm;
      left: 20mm;
      right: 20mm;
      height: 10mm;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 11px;
      color: #94a3b8;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #1e293b;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    h1 { font-size: 28px; font-weight: 700; }
    h2 { font-size: 22px; font-weight: 600; }
    h3 { font-size: 18px; font-weight: 600; }
    h4 { font-size: 16px; font-weight: 600; }
    p { margin-bottom: 1em; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background-color: #f8fafc;
      font-weight: 600;
    }
    code {
      background-color: #f1f5f9;
      padding: 2px 4px;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9em;
    }
    pre {
      background-color: #f1f5f9;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9em;
    }
    blockquote {
      border-left: 4px solid #6b7280;
      padding-left: 16px;
      margin: 1em 0;
      color: #64748b;
      font-style: italic;
    }
    ul, ol {
      margin: 1em 0;
      padding-left: 24px;
    }
    a {
      color: #6b7280;
      text-decoration: none;
      border-bottom: 1px solid #6b7280;
    }
    a:hover {
      color: #4b5563;
      border-bottom-color: #4b5563;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1em 0;
    }
    @media print {
      body {
        padding: 0;
        background: white;
      }
      .page {
        margin: 0;
        border: none;
        box-shadow: none;
        page-break-after: always;
      }
    }
  </style>
</head>
<body>`;

  const htmlFooter = `</body></html>`;

  // Construction des pages
  let pagesHTML = pages
    .map((pageContent, i) => {
      const content = pageContent.trim();
      const pageNum = i + 1;
      if (!content) return "";
      return `
<div class="page" data-page="${pageNum}">
  <div class="page-header">Page ${pageNum}</div>
  <div class="page-content">${content}</div>
  <div class="page-footer">${pageTitle} - Page ${pageNum}</div>
</div>`;
    })
    .join("\n");

  // Si vide
  if (!pagesHTML.trim()) {
    pagesHTML = `
    const { markdown, fileName: rawFileName = "document", previewHTML } = req.body;
    // Sanitize filename: remove path separators and limit to alphanumeric, spaces, hyphens, underscores
    const fileName = String(rawFileName)
      .replace(/[\/\\]/g, '')
      .replace(/[^a-zA-Z0-9\s_-]/g, '')
      .substring(0, 100)
      .trim() || 'document';  <div class="page-header">Page 1</div>
  <div class="page-content"><p>Contenu vide</p></div>
  <div class="page-footer">${pageTitle} - Page 1</div>
</div>`;
  }

  return htmlHeader + pagesHTML + htmlFooter;
}  if (!pagesHTML.trim()) {
    pagesHTML = `
<div class="page">
  <div class="page-header">Page 1</div>
  <div class="page-content"><p>Contenu vide</p></div>
  <div class="page-footer">${pageTitle} - Page 1</div>
</div>`;
  }

  return htmlHeader + pagesHTML + htmlFooter;
}  if (!pagesHTML.trim()) {
    pagesHTML = `
<div class="page">
  <div class="page-header">Page 1</div>
  <div class="page-content"><p>Contenu vide</p></div>
  <div class="page-footer">${pageTitle} - Page 1</div>
</div>`;
  }

  return htmlHeader + pagesHTML + htmlFooter;
}  if (!pagesHTML.trim()) {
    pagesHTML = `
<div class="page">
  <div class="page-header">Page 1</div>
  <div class="page-content"><p>Contenu vide</p></div>
  <div class="page-footer">${pageTitle} - Page 1</div>
</div>`;
  }

  return htmlHeader + pagesHTML + htmlFooter;
}  if (!pagesHTML.trim()) {
    pagesHTML = `
<div class="page">
  <div class="page-header">Page 1</div>
  <div class="page-content"><p>Contenu vide</p></div>
  <div class="page-footer">${pageTitle} - Page 1</div>
</div>`;
  }

  return htmlHeader + pagesHTML + htmlFooter;
}  if (!pagesHTML.trim()) {
    pagesHTML = `
<div class="page">
  <div class="page-header">Page 1</div>
  <div class="page-content"><p>Contenu vide</p></div>
  <div class="page-footer">${pageTitle} - Page 1</div>
</div>`;
  }

  return htmlHeader + pagesHTML + htmlFooter;
}  if (!pagesHTML.trim()) {
    pagesHTML = `
<div class="page">
  <div class="page-header">Page 1</div>
  <div class="page-content"><p>Contenu vide</p></div>
  <div class="page-footer">${pageTitle} - Page 1</div>
</div>`;
  }

  return htmlHeader + pagesHTML + htmlFooter;
}}

/**
 * --- ROUTE API ---
 * POST /api/export-html
 * Body: { markdown?: string, previewHTML?: string, fileName?: string }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { markdown, previewHTML, fileName = "document" } = req.body;

    if (typeof markdown !== "string" && typeof previewHTML !== "string") {
      return res.status(400).json({ error: "Aucun contenu valide fourni" });
    }

    // Génération du HTML principal
    let htmlContent = previewHTML;
    if (!htmlContent) {
      const result = await markdownProcessor.process(markdown);
      htmlContent = result.toString();
    }

    const pages = splitIntoPages(htmlContent);
    const finalHTML = generateMultiPageHTML(pages, fileName);

    // Sécurisation du nom de fichier
    const safeFileName = encodeURIComponent(fileName);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName.replace(/"/g, '\\"')}.html"`);
    res.status(200).send(finalHTML);
  } catch (err) {
    console.error("Erreur export HTML:", err);
    res.status(500).json({
      error: "Échec de la génération du document HTML",
      ...(process.env.NODE_ENV === "development" && { details: err.message }),
    });
  }
}
