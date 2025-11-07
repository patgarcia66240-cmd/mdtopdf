import { useExport } from "@/hooks/api/useExport";
import ExportPanel from "../modules/ExportPanel";

export const ExportPanelContainer = ({ markdown }: { markdown: string }) => {
  const exportMutation = useExport();

  return (
    <ExportPanel
      onExportPDF={() => exportMutation.mutate({ markdown, format: "pdf" })}
      onExportHTML={() => exportMutation.mutate({ markdown, format: "html" })}
      onExportMD={() => exportMutation.mutate({ markdown, format: "md" })}
      onExportDOCX={() => alert("DOCX coming soon")}
      wordCount={markdown.trim().length === 0 ? 0 : markdown.trim().split(/\s+/).length}
      charCount={markdown.length}
      lineCount={markdown.length === 0 ? 0 : markdown.split(/\r?\n/).length}
      isDarkMode={false}
      isExporting={exportMutation.isPending}
    />
  );
};
