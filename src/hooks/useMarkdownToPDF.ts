import { useState, RefObject } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Type pour compatibilité avec le code existant
interface MarkdownToPDFOptions {
  // Propriétés de PDFOptions
  format?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margins?: { top: number; right: number; bottom: number; left: number; };
  fontSize?: number;
  fontFamily?: string;

  // Propriétés pour compatibilité ascendante
  pageWidth?: number;
  margin?: number;
  showPageNumbers?: boolean;

  // Propriétés legacy pour compatibilité (string)
  header?: string;
  footer?: string;

  // Propriétés modernes (HeaderFooter objects)
  headerFooter?: { text: string; alignment: 'left' | 'center' | 'right'; fontSize: number; fontStyle: 'normal' | 'bold' | 'italic'; };
}

// Helper pour obtenir la marge depuis les options (compatibilité)
const getMargin = (options: MarkdownToPDFOptions): number => {
  // Utiliser l'ancienne propriété margin si disponible
  if (options.margin !== undefined) {
    return options.margin;
  }

  // Utiliser les nouvelles marges si disponibles
  if (options.margins) {
    // Retourner la marge la plus petite (conservative)
    return Math.min(options.margins.top, options.margins.bottom, options.margins.left, options.margins.right);
  }

  // Valeur par défaut
  return 15;
};

export const useMarkdownToPDF = () => {
  const [isConverting, setIsConverting] = useState(false);

  /**
   * Convertit un élément HTML en PDF (effet relief complet)
   */
  const convertToPDF = async (
    elementRef: RefObject<HTMLElement>,
    fileName = "document",
    options: MarkdownToPDFOptions = {}
  ): Promise<void> => {
    if (!elementRef?.current) {
      alert("Zone de rendu introuvable");
      return;
    }

    setIsConverting(true);
    const el = elementRef.current;

    // Sauvegarde du style original
    const originalStyles = {
      width: el.style.width,
      height: el.style.height,
      overflow: el.style.overflow,
      transform: el.style.transform,
      fontSmoothing: (el.style as any).fontSmoothing,
      webkitFontSmoothing: (el.style as any).webkitFontSmoothing,
      mozOsxFontSmoothing: (el.style as any).mozOsxFontSmoothing,
    };

    // Sauvegarde des styles de texte originaux
    const originalTextStyles: Record<string, any>[] = [];
    const textElements = el.querySelectorAll<
      HTMLElement
    >("h1,h2,h3,h4,h5,h6,p,span,div,li,td,th,strong,em,code");

    textElements.forEach((element, index) => {
      originalTextStyles[index] = {
        textShadow: element.style.textShadow,
        filter: element.style.filter,
        color: element.style.color,
        fontWeight: element.style.fontWeight,
        letterSpacing: element.style.letterSpacing,
      };

      const computedStyle = window.getComputedStyle(element);
      const fontSize = parseFloat(computedStyle.fontSize);
      const color = computedStyle.color;
      const isBold =
        computedStyle.fontWeight === "bold" ||
        parseInt(computedStyle.fontWeight) >= 700;
      const isDark =
        document.body.dataset.theme === "dark" ||
        !!el.closest("[data-theme='dark']") ||
        color === "rgb(255, 255, 255)";
      // Titres / texte normal / code avec effets
      if (fontSize >= 32 || (fontSize >= 24 && isBold)) {
        element.style.textShadow = `
          -1px -1px 0px ${isDark ? "#1a1a2e" : "#ffffff"},
          1px -1px 0px ${isDark ? "#1a1a2e" : "#ffffff"},
          -1px 1px 0px ${isDark ? "#1a1a2e" : "#ffffff"},
          1px 1px 0px ${isDark ? "#1a1a2e" : "#ffffff"},
          0px 2px 3px rgba(0,0,0,0.5),
          0px 4px 6px rgba(0,0,0,0.3),
          0px 6px 12px rgba(0,0,0,0.2)
        `;
      } else if (fontSize >= 20 || (fontSize >= 16 && isBold)) {
        element.style.textShadow = `
          -0.5px -0.5px 0px ${isDark ? "#2a2a3d" : "#f8f8f8"},
          0.5px 0.5px 0px ${isDark ? "#2a2a3d" : "#f8f8f8"}
        `;
      } else {
        element.style.textShadow = `
          -0.3px -0.3px 0px ${isDark ? "#374151" : "#fafafa"},
          0.3px 0.3px 0px ${isDark ? "#374151" : "#fafafa"}
        `;
      }

      if (element.tagName.toLowerCase() === "code") {
        element.style.background = isDark ? "#2d3748" : "#f7fafc";
        element.style.padding = "0.2em 0.4em";
        element.style.borderRadius = "3px";
      }
    });

    try {
      el.style.width = `${options.pageWidth || 800}px`;
      el.style.overflow = "visible";
      el.style.transform = "none";
      (el.style as any).webkitFontSmoothing = "antialiased";

      await new Promise((r) => setTimeout(r, 400));

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = getMargin(options);
      const contentWidth = pageWidth - margin * 2;

      // Calculate available content height more precisely
      let headerSpace = 0;
      let footerSpace = 0;

      if (options.header) {
        headerSpace = 15; // Reserve space for header (approximately 15mm)
      }
      if (options.footer || options.showPageNumbers) {
        footerSpace = 45; // Reserve much more space for footer (approximately 45mm)
      }

      // Content height = total page height - top margin - bottom margin - header space - footer space
      const contentHeight = pageHeight - margin - margin - headerSpace - footerSpace;

      // Process page breaks - get HTML content and split by page breaks
      const htmlContent = el.innerHTML;

      // Look for page break divs in the HTML content
      const pageBreakPattern = /<div[^>]*style="[^"]*page-break-before:\s*always[^"]*"[^>]*><\/div>/gi;
      const hasPageBreaks = pageBreakPattern.test(htmlContent);

      let pagesContent: HTMLElement[] = [];

      if (hasPageBreaks) {
        // Split HTML content by page breaks
        const parts = htmlContent.split(pageBreakPattern);

        parts.forEach((part, _index) => {
          const cleanPart = part.trim();
          if (cleanPart) {
            // Create a new div for each page content
            const pageDiv = document.createElement('div');
            pageDiv.style.cssText = el.style.cssText;
            pageDiv.style.width = `${options.pageWidth || 800}px`;
            pageDiv.style.backgroundColor = '#ffffff';
            pageDiv.innerHTML = cleanPart;
            pagesContent.push(pageDiv);
          }
        });

        // If no valid pages were created, use the whole content
        if (pagesContent.length === 0) {
          pagesContent = [el];
        }
      } else {
        // No explicit page breaks, use whole content
        pagesContent = [el];
      }

      // Process each page content separately
      for (let pageIndex = 0; pageIndex < pagesContent.length; pageIndex++) {
        const pageContent = pagesContent[pageIndex];

        if (pageIndex > 0) {
          pdf.addPage();
        }

        // Capture this page content
        const canvas = await html2canvas(pageContent, {
          scale: 2.5,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
        });

        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        // Calculate vertical offset for content based on header with extra safety margin
        const contentOffsetY = margin + headerSpace + 2; // Add 2mm extra safety margin

        // Debug logging
        console.log(`Page dimensions: width=${pageWidth}mm, height=${pageHeight}mm`);
        console.log(`Margins: ${margin}mm, Header: ${headerSpace}mm, Footer: ${footerSpace}mm`);
        console.log(`Content area: width=${contentWidth}mm, height=${contentHeight}mm`);
        console.log(`Canvas dimensions: width=${canvas.width}px, height=${canvas.height}px`);
        console.log(`Image dimensions: width=${imgWidth}mm, height=${imgHeight}mm`);

        // Calculate the maximum safe height for content
        const maxSafeHeight = contentHeight - 5; // Add 5mm extra safety margin

        // Check if this page content fits in available height
        if (imgHeight <= maxSafeHeight) {
          pdf.addImage(canvas, "PNG", margin, contentOffsetY, imgWidth, imgHeight, undefined, "FAST");
          console.log(`Content fits: imgHeight=${imgHeight}mm <= maxSafeHeight=${maxSafeHeight}mm`);
        } else {
          // Content is too tall, split it further with strict height limits
          const pageImgHeight = (maxSafeHeight * canvas.width) / contentWidth;
          const splitPages = Math.ceil(canvas.height / pageImgHeight);

          console.log(`Splitting content: canvas.height=${canvas.height}, pageImgHeight=${pageImgHeight}, splitPages=${splitPages}`);

          for (let splitPage = 0; splitPage < splitPages; splitPage++) {
            if (splitPage > 0) {
              pdf.addPage();
            }

            // Create a temporary canvas for this split page
            const pageCanvas = document.createElement('canvas');
            const pageCtx = pageCanvas.getContext('2d');
            if (!pageCtx) {
              throw new Error('Failed to get 2D context for canvas');
            }            pageCanvas.width = canvas.width;

            // Calculate the height for this split page
            const sourceY = splitPage * pageImgHeight;
            const remainingHeight = canvas.height - sourceY;
            pageCanvas.height = Math.min(pageImgHeight, remainingHeight);

            // Draw the portion of the original canvas for this split page
            pageCtx.drawImage(
              canvas,
              0, sourceY, // Source x, y
              canvas.width, pageCanvas.height, // Source width, height
              0, 0, // Destination x, y
              canvas.width, pageCanvas.height // Destination width, height
            );

            // Calculate the exact height in mm for this split page
            const splitPageHeightMm = (pageCanvas.height * contentWidth) / canvas.width;

            // Triple-check that we don't exceed the allowed height
            const finalHeight = Math.min(splitPageHeightMm, maxSafeHeight);

            console.log(`Split page ${splitPage}: canvasHeight=${pageCanvas.height}, calculatedHeight=${splitPageHeightMm}mm, finalHeight=${finalHeight}mm`);

            // Add this split page to the PDF with strict height control
            pdf.addImage(pageCanvas, "PNG", margin, contentOffsetY, imgWidth, finalHeight, undefined, "FAST");
          }
        }
      }

      // Headers / footers
      if (options.header || options.footer || options.showPageNumbers) {
        const totalPages = pdf.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(100);
          if (options.header) pdf.text(options.header, margin, 10);
          if (options.footer)
            pdf.text(options.footer, margin, pageHeight - margin - 5);
          if (options.showPageNumbers)
            pdf.text(
              `Page ${i}/${totalPages}`,
              pageWidth - margin - 20,
              pageHeight - margin - 5
            );
        }
      }

      pdf.save(`${fileName}.pdf`);
    } catch (err: any) {
      console.error("Erreur PDF:", err);
      alert("Erreur lors de la conversion PDF: " + err.message);
    } finally {
      // Restauration des styles
      textElements.forEach((el, i) => {
        const o = originalTextStyles[i];
        if (o) {
          el.style.textShadow = o.textShadow;
          el.style.filter = o.filter;
          el.style.color = o.color;
          el.style.fontWeight = o.fontWeight;
          el.style.letterSpacing = o.letterSpacing;
        }
      });
      (Object.keys(originalStyles) as Array<keyof typeof originalStyles>).forEach((key) => {
        (el.style as any)[key] = originalStyles[key];
      });      setIsConverting(false);
    }
  };

  return { convertToPDF, isConverting };
};
