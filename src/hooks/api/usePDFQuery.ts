import { useMutation } from "@tanstack/react-query";

async function exportPDF(markdown: string, fileName = "document") {
  const res = await fetch(`/api/export-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown, fileName }),
  });

  if (!res.ok) throw new Error("Erreur export PDF");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.pdf`;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
export const usePDFQuery = () =>
  useMutation({
    mutationFn: ({ markdown, fileName }: { markdown: string; fileName?: string }) =>
      exportPDF(markdown, fileName),
  });
