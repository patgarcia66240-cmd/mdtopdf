import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

export default async function handler(req, res) {
  try {
    const { markdown, fileName = "document" } = req.body;
    if (!markdown) return res.status(400).send("No markdown provided");

    // Traiter le markdown pour générer du HTML multi-pages
    const result = await remark().use(gfm).use(html).process(markdown);
    const htmlContent = result.toString();

    // Diviser le contenu en pages en utilisant les sauts de page
    const pages = htmlContent.split(/<!--\s*pagebreak\s*-->/gi);

    // Générer le HTML avec des pages séparées
    const multiPageHTML = generateMultiPageHTML(pages, fileName);

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}.html`);
    res.send(multiPageHTML);
  } catch (err) {
    res.status(500).json({ error: "HTML export failed", details: err.message });
  }
}

function generateMultiPageHTML(pages, fileName) {
  const pageTitle = fileName || "Document";

  const htmlHeader = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

        p {
            margin-bottom: 1em;
        }

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
            }
        }
    </style>
</head>
<body>`;

  const htmlFooter = `
</body>
</html>`;

  let pagesHTML = '';

  pages.forEach((pageContent, index) => {
    const pageNumber = index + 1;
    const cleanContent = pageContent.trim();

    if (cleanContent) {
      pagesHTML += `
    <div class="page">
        <div class="page-header">
            Page ${pageNumber}
        </div>
        <div class="page-content">
            ${cleanContent}
        </div>
        <div class="page-footer">
            ${pageTitle} - Page ${pageNumber}
        </div>
    </div>`;
    }
  });

  // Si aucune page valide, créer une page vide
  if (!pagesHTML) {
    pagesHTML = `
    <div class="page">
        <div class="page-header">
            Page 1
        </div>
        <div class="page-content">
            <p>Contenu vide</p>
        </div>
        <div class="page-footer">
            ${pageTitle} - Page 1
        </div>
    </div>`;
  }

  return htmlHeader + pagesHTML + htmlFooter;
}
