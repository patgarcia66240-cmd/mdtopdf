import { mdToPdf } from "md-to-pdf";

export default async function handler(req, res) {
  try {
    const { markdown, fileName = "document" } = req.body;
    if (!markdown) return res.status(400).send("No markdown provided");

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
    res.status(500).json({ error: "PDF export failed", details: err.message });
  }
}
