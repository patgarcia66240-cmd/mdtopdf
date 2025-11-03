import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

export default async function handler(req, res) {
  try {
    const { markdown, fileName = "document" } = req.body;
    if (!markdown) return res.status(400).send("No markdown provided");

    const result = await remark().use(gfm).use(html).process(markdown);

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}.html`);
    res.send(result.toString());
  } catch (err) {
    res.status(500).json({ error: "HTML export failed", details: err.message });
  }
}
