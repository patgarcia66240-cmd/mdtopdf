import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * 🧱 Hook pro : export en PDF A4 avec rendu de haute qualité pour les polices
 */
export const useMarkdownToPDF = () => {
  const [isConverting, setIsConverting] = useState(false);

  const convertToPDF = async (elementRef, fileName = 'document', options = {}) => {
    if (!elementRef?.current) {
      alert('Zone de rendu introuvable');
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
      fontSmoothing: el.style.fontSmoothing,
      webkitFontSmoothing: el.style.webkitFontSmoothing,
      mozOsxFontSmoothing: el.style.mozOsxFontSmoothing,
    };

    // Sauvegarde des styles de texte originaux pour l'effet relief
    const originalTextStyles = [];
    const textElements = el.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, li, td, th, strong, em, code');

    textElements.forEach((element, index) => {
      originalTextStyles[index] = {
        textShadow: element.style.textShadow,
        webkitTextShadow: element.style.webkitTextShadow,
        filter: element.style.filter,
        color: element.style.color,
        fontWeight: element.style.fontWeight,
        letterSpacing: element.style.letterSpacing,
      };

      // Appliquer un effet de relief/embossage élégant
      const computedStyle = window.getComputedStyle(element);
      const fontSize = parseFloat(computedStyle.fontSize);
      const currentColor = computedStyle.color;
      const isBold = computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 700;
      const isDark = document.body.dataset.theme === 'dark' ||
                    el.closest('[data-theme="dark"]') ||
                    currentColor === 'rgb(255, 255, 255)' ||
                    currentColor.includes('255, 255, 255');

      // Effet de relief adapté selon la taille et le poids du texte
      if (fontSize >= 32 || (fontSize >= 24 && isBold)) { // Gros titres
        element.style.textShadow = `
          -1px -1px 0px ${isDark ? '#1a1a2e' : '#ffffff'},
          1px -1px 0px ${isDark ? '#1a1a2e' : '#ffffff'},
          -1px 1px 0px ${isDark ? '#1a1a2e' : '#ffffff'},
          1px 1px 0px ${isDark ? '#1a1a2e' : '#ffffff'},
          0px 2px 3px rgba(0, 0, 0, 0.5),
          0px 4px 6px rgba(0, 0, 0, 0.3),
          0px 6px 12px rgba(0, 0, 0, 0.2)
        `;
        element.style.filter = `contrast(1.1) ${isDark ? 'brightness(1.05)' : 'brightness(0.95)'}`;
        element.style.fontWeight = '700';
        element.style.letterSpacing = '0.02em';
      } else if (fontSize >= 20 || (fontSize >= 16 && isBold)) { // Sous-titres et texte important
        element.style.textShadow = `
          -0.5px -0.5px 0px ${isDark ? '#2a2a3d' : '#f8f8f8'},
          0.5px -0.5px 0px ${isDark ? '#2a2a3d' : '#f8f8f8'},
          -0.5px 0.5px 0px ${isDark ? '#2a2a3d' : '#f8f8f8'},
          0.5px 0.5px 0px ${isDark ? '#2a2a3d' : '#f8f8f8'},
          0px 1px 2px rgba(0, 0, 0, 0.3),
          0px 2px 4px rgba(0, 0, 0, 0.2)
        `;
        element.style.filter = `contrast(1.05) ${isDark ? 'brightness(1.02)' : 'brightness(0.98)'}`;
      } else { // Texte normal
        element.style.textShadow = `
          -0.3px -0.3px 0px ${isDark ? '#374151' : '#fafafa'},
          0.3px -0.3px 0px ${isDark ? '#374151' : '#fafafa'},
          -0.3px 0.3px 0px ${isDark ? '#374151' : '#fafafa'},
          0.3px 0.3px 0px ${isDark ? '#374151' : '#fafafa'},
          0px 1px 1px rgba(0, 0, 0, 0.15)
        `;
        element.style.filter = 'contrast(1.02)';
      }

      // Effet spécial pour les éléments de code
      if (element.tagName.toLowerCase() === 'code') {
        element.style.textShadow = `
          -1px -1px 1px rgba(0, 0, 0, 0.5),
          1px 1px 1px rgba(255, 255, 255, 0.1),
          0px 2px 3px rgba(0, 0, 0, 0.3)
        `;
        element.style.background = isDark ? '#2d3748' : '#f7fafc';
        element.style.padding = '0.2em 0.4em';
        element.style.borderRadius = '3px';
      }
    });

    try {
      // Configuration optimisée pour le rendu du texte avec relief
      el.style.width = `${options.pageWidth || 800}px`;
      el.style.height = 'auto';
      el.style.overflow = 'visible';
      el.style.transform = 'none';
      el.style.fontSmoothing = 'antialiased';
      el.style.webkitFontSmoothing = 'antialiased';
      el.style.mozOsxFontSmoothing = 'grayscale';

      // Attendre que le navigateur applique les styles
      await new Promise(resolve => setTimeout(resolve, 400));

      // Configuration PDF A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = pdf.internal.pageSize.getWidth();   // 210 mm
      const pageHeight = pdf.internal.pageSize.getHeight();  // 297 mm
      const margin = options.margin || 15;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      // Capture avec paramètres optimisés pour le texte avec relief
      const canvas = await html2canvas(el, {
        scale: 2.5, // Échelle plus élevée pour capturer les détails du relief
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
        logging: false,
        removeContainer: false,
        // Paramètres spécifiques pour le texte avec relief
        foreignObjectRendering: false,
        imageTimeout: 25000, // Plus de temps pour le rendu du relief
        // Améliorer la qualité du texte et du relief
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('*');
          if (clonedElement) {
            clonedElement.style.fontSmoothing = 'antialiased';
            clonedElement.style.webkitFontSmoothing = 'antialiased';
            clonedElement.style.textRendering = 'geometricPrecision';
            clonedElement.style.imageRendering = 'crisp-edges';
            clonedElement.style.shapeRendering = 'crispEdges';
          }

          // Appliquer les mêmes effets de relief au document cloné
          const clonedTextElements = clonedDoc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, li, td, th, strong, em, code');
          clonedTextElements.forEach((element, index) => {
            if (originalTextStyles[index]) {
              const originalElement = textElements[index];
              if (originalElement) {
                element.style.textShadow = originalElement.style.textShadow;
                element.style.filter = originalElement.style.filter;
                element.style.fontWeight = originalElement.style.fontWeight;
                element.style.letterSpacing = originalElement.style.letterSpacing;
              }
            }
          });
        }
      });

      // Calcul des dimensions avec haute précision
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // Ajouter la première page
      pdf.addImage(canvas, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= contentHeight;

      // Ajouter les pages suivantes si nécessaire
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(canvas, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= contentHeight;
      }

      // Ajouter entêtes et pieds de page avec des polices nettes
      if (options.header || options.footer || options.showPageNumbers) {
        const totalPages = pdf.internal.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(100);

          if (options.header) {
            pdf.text(options.header, margin, 10);
          }

          if (options.footer) {
            pdf.text(options.footer, margin, pageHeight - 10);
          }

          if (options.showPageNumbers) {
            pdf.text(`Page ${i}/${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
          }
        }
      }

      // Sauvegarder le PDF
      pdf.save(`${fileName}.pdf`);

    } catch (err) {
      console.error('Erreur PDF:', err);
      alert('Erreur lors de la conversion PDF: ' + err.message);
    } finally {
      // Restauration des styles de texte originaux
      textElements.forEach((element, index) => {
        if (originalTextStyles[index]) {
          element.style.textShadow = originalTextStyles[index].textShadow;
          element.style.webkitTextShadow = originalTextStyles[index].webkitTextShadow;
          element.style.filter = originalTextStyles[index].filter;
          element.style.color = originalTextStyles[index].color;
          element.style.fontWeight = originalTextStyles[index].fontWeight;
          element.style.letterSpacing = originalTextStyles[index].letterSpacing;
        }
      });

      // Restauration des styles originaux
      Object.keys(originalStyles).forEach(key => {
        el.style[key] = originalStyles[key];
      });
      setIsConverting(false);
    }
  };

  const convertToPDFWithTextShadow = async (elementRef, fileName = 'document-shadow', options = {}) => {
    if (!elementRef?.current) {
      alert('Zone de rendu introuvable');
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
      fontSmoothing: el.style.fontSmoothing,
      webkitFontSmoothing: el.style.webkitFontSmoothing,
      mozOsxFontSmoothing: el.style.mozOsxFontSmoothing,
    };

    // Sauvegarde des styles de texte originaux
    const originalTextStyles = [];
    const textElements = el.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, li, td, th');

    textElements.forEach((element, index) => {
      originalTextStyles[index] = {
        textShadow: element.style.textShadow,
        webkitTextShadow: element.style.webkitTextShadow,
        filter: element.style.filter,
      };

      // Appliquer des ombres de texte élégantes
      const computedStyle = window.getComputedStyle(element);
      const fontSize = parseFloat(computedStyle.fontSize);
      const isDark = document.body.dataset.theme === 'dark' ||
                    el.closest('[data-theme="dark"]') ||
                    computedStyle.color === 'rgb(255, 255, 255)' ||
                    computedStyle.color.includes('255, 255, 255');

      if (fontSize >= 24) { // Pour les grands titres
        element.style.textShadow = isDark
          ? '0 4px 8px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.4)'
          : '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)';
        element.style.filter = isDark
          ? 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3)) brightness(1.1)'
          : 'drop-shadow(0 2px 4px rgba(37, 99, 235, 0.2)) brightness(0.95)';
      } else if (fontSize >= 18) { // Pour les sous-titres
        element.style.textShadow = isDark
          ? '0 2px 4px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.4)'
          : '0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)';
      } else { // Pour le texte normal
        element.style.textShadow = isDark
          ? '0 1px 2px rgba(0, 0, 0, 0.4)'
          : '0 1px 2px rgba(0, 0, 0, 0.1)';
      }
    });

    try {
      // Configuration optimisée pour le rendu du texte avec ombres
      el.style.width = `${options.pageWidth || 800}px`;
      el.style.height = 'auto';
      el.style.overflow = 'visible';
      el.style.transform = 'none';
      el.style.fontSmoothing = 'antialiased';
      el.style.webkitFontSmoothing = 'antialiased';
      el.style.mozOsxFontSmoothing = 'grayscale';

      // Attendre que le navigateur applique les styles
      await new Promise(resolve => setTimeout(resolve, 300));

      // Configuration PDF A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = pdf.internal.pageSize.getWidth();   // 210 mm
      const pageHeight = pdf.internal.pageSize.getHeight();  // 297 mm
      const margin = options.margin || 15;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      // Capture avec paramètres optimisés pour le texte avec ombres
      const canvas = await html2canvas(el, {
        scale: 2, // Échelle plus élevée pour capturer les détails des ombres
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: false,
        logging: false,
        removeContainer: false,
        // Paramètres spécifiques pour le texte avec ombres
        foreignObjectRendering: false,
        imageTimeout: 20000, // Plus de temps pour le rendu des ombres
        // Améliorer la qualité du texte et des ombres
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('*');
          if (clonedElement) {
            clonedElement.style.fontSmoothing = 'antialiased';
            clonedElement.style.webkitFontSmoothing = 'antialiased';
            clonedElement.style.textRendering = 'geometricPrecision';
            clonedElement.style.imageRendering = 'crisp-edges';
          }
        }
      });

      // Calcul des dimensions avec haute précision
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // Ajouter la première page
      pdf.addImage(canvas, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= contentHeight;

      // Ajouter les pages suivantes si nécessaire
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(canvas, 'PNG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= contentHeight;
      }

      // Ajouter entêtes et pieds de page avec des polices nettes et ombres
      if (options.header || options.footer || options.showPageNumbers) {
        const totalPages = pdf.internal.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(100);

          if (options.header) {
            pdf.text(options.header, margin, 10);
          }

          if (options.footer) {
            pdf.text(options.footer, margin, pageHeight - 10);
          }

          if (options.showPageNumbers) {
            pdf.text(`Page ${i}/${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
          }
        }
      }

      // Sauvegarder le PDF avec text shadow
      pdf.save(`${fileName}-shadow.pdf`);

    } catch (err) {
      console.error('Erreur PDF avec text shadow:', err);
      alert('Erreur lors de la conversion PDF avec text shadow: ' + err.message);
    } finally {
      // Restauration des styles de texte originaux
      textElements.forEach((element, index) => {
        if (originalTextStyles[index]) {
          element.style.textShadow = originalTextStyles[index].textShadow;
          element.style.webkitTextShadow = originalTextStyles[index].webkitTextShadow;
          element.style.filter = originalTextStyles[index].filter;
        }
      });

      // Restauration des styles originaux
      Object.keys(originalStyles).forEach(key => {
        el.style[key] = originalStyles[key];
      });
      setIsConverting(false);
    }
  };

  return { convertToPDF, convertToPDFWithTextShadow, isConverting };
};