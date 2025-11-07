import { mdToPdf } from "md-to-pdf";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { markdown, fileName: rawFileName = "document" } = req.body;
    // Sanitize fileName: remove special chars that could enable header injection
    const fileName = String(rawFileName).replace(/[^\w\s.-]/g, '').trim() || 'document';    if (!markdown) return res.status(400).json({ error: "No markdown provided" });
    if (markdown.length > 1000000) return res.status(400).json({ error: "Markdown content too large" });
    const pdf = await mdToPdf({ content: markdown }, {
      pdf_options: {
        format: "A4",
        margin: "2cm",
        displayHeaderFooter: true,
        headerTemplate: "<div style='font-size:10px;text-align:center;'>Export PDF</div>",
        footerTemplate: "<div style='font-size:10px;text-align:center;'>Page <span class='pageNumber'></span> / <span class='totalPages'></span></div>",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}.pdf`);
    res.send(pdf.content);
  } catch (err) {
    console.error('PDF export error:', err);
    res.status(500).json({ error: "PDF export failed" });
  }}
