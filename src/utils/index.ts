/**
 * Export centralisé de tous les utilitaires
 */

// Export des utilitaires PDF
export * from './pdfUtils';

// Export des utilitaires Markdown
export * from './markdownUtils';

// Export des utilitaires de fichiers
export * from './fileUtils';

// Export des utilitaires de validation
export * from './validationUtils';

// Export des utilitaires de performance (à ajouter plus tard)
// export * from './performanceUtils';

// Export des utilitaires de cache (à ajouter plus tard)
// export * from './cacheUtils';

// Export des utilitaires de débogage (à ajouter plus tard)
// export * from './debugUtils';

/**
 * Utilitaires combinés fréquemment utilisés
 */

// Validation combinée de Markdown + PDF
export const validateMarkdownPDF = (markdown: string, pdfOptions?: any) => {
  const { validateMarkdown } = require('./markdownUtils');
  const { validatePDFOptions } = require('./validationUtils');

  const markdownValidation = validateMarkdown(markdown);
  const pdfValidation = validatePDFOptions(pdfOptions || {});

  return {
    isValid: markdownValidation.isValid && pdfValidation.isValid,
    errors: [...markdownValidation.errors, ...pdfValidation.errors],
    warnings: [...markdownValidation.warnings, ...pdfValidation.warnings],
  };
};

// Utilitaire complet pour le traitement de fichiers
export const processMarkdownFile = async (file: File) => {
  const { processFileUpload } = require('./fileUtils');
  const { parseMarkdownMetadata, validateMarkdown } = require('./markdownUtils');

  const uploadResult = await processFileUpload(file);
  const metadata = parseMarkdownMetadata(uploadResult.content);
  const validation = validateMarkdown(uploadResult.content);

  return {
    file: uploadResult,
    metadata,
    validation,
  };
};

// Utilitaire de validation de formulaire réutilisable
export const createFormValidator = (schema: any, options?: any) => {
  const { validateForm } = require('./validationUtils');

  return {
    validate: (data: any) => validateForm(data, schema, options),
    schema,
  };
};

// Export par défaut pour faciliter l'import
export default {
  // PDF Utils
  calculatePDFMetrics: require('./pdfUtils').calculatePDFMetrics,
  getPageDimensions: require('./pdfUtils').getPageDimensions,

  // Markdown Utils
  parseMarkdownMetadata: require('./markdownUtils').parseMarkdownMetadata,
  generateTableOfContents: require('./markdownUtils').generateTableOfContents,

  // File Utils
  validateFile: require('./fileUtils').validateFile,
  processFileUpload: require('./fileUtils').processFileUpload,

  // Validation Utils
  validateSchema: require('./validationUtils').validateSchema,
  validateForm: require('./validationUtils').validateForm,
};