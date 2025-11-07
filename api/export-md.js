export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {  try {
    const { markdown, fileName = "document" } = req.body;
    if (!markdown) return res.status(400).send("No markdown provided");

  } catch (err) {
    console.error('Markdown export error:', err);
    res.status(500).json({ error: "Markdown export failed" });
  }  } catch (err) {
    res.status(500).json({ error: "Markdown export failed", details: err.message });
  }
}
