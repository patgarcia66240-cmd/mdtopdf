import { usePDFQuery } from "./api/usePDFQuery";
import { useMarkdownToPDF } from "./useMarkdownToPDF.ts";
import { exportService } from "../services/exportService";

export const usePDFExport = () => {
  const pdfQuery = usePDFQuery();
  const { convertToPDF } = useMarkdownToPDF();

  const exportToPDF = async (
    elementRef: React.RefObject<HTMLElement | null>,
    fileName: string,
    pdfOptions?: any
  ) => {
    if (elementRef?.current) {
      await convertToPDF(elementRef as React.RefObject<HTMLElement>, fileName, pdfOptions);
    } else {
      alert("Aucun contenu disponible pour export local");
    }
  };

  const exportToHTML = async (markdown: string, fileName: string) => {
    await exportService.exportDocument({
      format: 'html',
      filename: fileName,
      markdown,
    });
  };

  const exportToMarkdown = async (markdown: string, fileName: string) => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.md`;
    a.click();
    a.remove();
  };

  const exportToDOCX = async (markdown: string, fileName: string) => {
    await exportService.exportDocument({
      format: 'docx',
      filename: fileName,
      markdown,
    });
  };

  return {
    exportToPDF,
    exportToHTML,
    exportToMarkdown,
    exportToDOCX,
    isExporting: pdfQuery.isPending,
  };
};
