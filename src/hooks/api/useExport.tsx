import { useMutation } from "@tanstack/react-query";

async function exportFile(markdown: string, format: "pdf" | "html" | "md", fileName = "document") {
  const res = await fetch(`/api/export-${format}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown, fileName }),
  });

  if (!res.ok) throw new Error(`Erreur export ${format}`);

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.${format}`;
  a.click();
  a.remove();
}

export const useExport = () =>
  useMutation({
    mutationFn: ({ markdown, format, fileName }: { markdown: string; format: "pdf" | "html" | "md"; fileName?: string }) =>
      exportFile(markdown, format, fileName),
  });
