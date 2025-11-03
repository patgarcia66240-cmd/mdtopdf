export default async function handler(req, res) {
  try {
    const { markdown, fileName = "document" } = req.body;
    if (!markdown) return res.status(400).send("No markdown provided");

    res.setHeader("Content-Type", "text/markdown");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}.md`);
    res.send(markdown);
  } catch (err) {
    res.status(500).json({ error: "Markdown export failed", details: err.message });
  }
}
