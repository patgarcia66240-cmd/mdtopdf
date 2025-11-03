import { usePDFExport } from "@/hooks/usePDFExport";
import { useExport } from "@/hooks/api/useExport";

export const ExportPanelContainer = ({ markdown }: { markdown: string }) => {
  const { exportPDF, isExporting } = usePDFExport();
  const exportMutation = useExport();

  return (
    <ExportPanel
      onExportPDF={() => exportPDF(markdown)}
      onExportHTML={() => exportMutation.mutate({ markdown, format: "html" })}
      onExportMD={() => exportMutation.mutate({ markdown, format: "md" })}
      onExportDOCX={() => alert("DOCX coming soon")}
      wordCount={markdown.split(/\s+/).length}
      charCount={markdown.length}
      lineCount={markdown.split("\n").length}
      isDarkMode={false}
      isExporting={isExporting || exportMutation.isPending}
    />
  );
};
