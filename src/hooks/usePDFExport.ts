import { usePDFQuery } from "./api/usePDFQuery";
import { useMarkdownToPDF } from "./useMarkdownToPDF.ts";
import { exportService } from "../services/exportService";

export const usePDFExport = () => {
  const pdfQuery = usePDFQuery();
  const { convertToPDF } = useMarkdownToPDF();

  const exportToPDF = async (
    elementRef: React.RefObject<HTMLDivElement | null>,
    fileName: string,
    pdfOptions?: any
  ) => {
    if (elementRef?.current) {
      await convertToPDF(elementRef as React.RefObject<HTMLElement>, fileName, pdfOptions);
    } else {
      alert("Aucun contenu disponible pour export local");
    }
  };

  const exportToHTML = async (markdown: string, fileName: string, previewElement?: React.RefObject<HTMLDivElement | null>) => {
    // Récupérer le HTML du preview si disponible
    let previewHTML = '';
    if (previewElement?.current) {
      previewHTML = previewElement.current.innerHTML;
      console.log('Preview HTML récupéré, longueur:', previewHTML.length);
      console.log('Contient PAGEBREAK?', previewHTML.includes('<!--PAGEBREAK-->'));

      // Debug: afficher un extrait du HTML
      if (previewHTML.length > 0) {
        console.log('Extrait du HTML preview:', previewHTML.substring(0, 200) + '...');
      }
    }

    // Utiliser le service d'export modifié qui accepte le preview HTML
    await exportService.exportDocument({
      format: 'html',
      filename: fileName,
      markdown,
      previewHTML // Passer le preview HTML au service
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
