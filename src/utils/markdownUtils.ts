// Types locaux pour ce fichier
interface MarkdownElement {
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'quote' | 'table' | 'image' | 'link';
  content: string;
  level?: number;
  attributes?: Record<string, any>;
}

interface MarkdownProcessingOptions {
  sanitize?: boolean;
  breaks?: boolean;
  gfm?: boolean;
  smartLists?: boolean;
  smartypants?: boolean;
  tables?: boolean;
  taskLists?: boolean;
  strikethrough?: boolean;
  footnotes?: boolean;
  emoji?: boolean;
  highlight?: boolean;
  sub?: boolean;
  sup?: boolean;
  katex?: boolean;
  mermaid?: boolean;
  toc?: boolean;
}

interface MarkdownParseResult {
  html: string;
  metadata: MarkdownMetadata;
  toc: TableOfContents;
  elements: MarkdownElement[];
  stats: MarkdownStats;
}

interface MarkdownMetadata {
  title?: string;
  author?: string;
  date?: Date;
  tags?: string[];
  description?: string;
  wordCount: number;
  readingTime: number;
  languages?: string[];
  links?: {
    internal: number;
    external: number;
  };
  images?: {
    count: number;
    totalSize?: number;
  };
  custom?: Record<string, any>;
}

interface TableOfContents {
  title: string;
  entries: TOCEntry[];
  maxDepth: number;
}

interface TOCEntry {
  title: string;
  level: number;
  anchor: string;
  children: TOCEntry[];
  line?: number;
}

interface MarkdownStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  paragraphs: number;
  lines: number;
  sentences: number;
  headings: Record<number, number>;
  lists: number;
  listItems: number;
  codeBlocks: number;
  tables: number;
  images: number;
  links: number;
  footnotes: number;
  readingTime: number;
}

/**
 * Utilitaires pour le traitement et l'analyse de contenu Markdown
 */

// Expressions régulières pour l'analyse Markdown
const MARKDOWN_PATTERNS = {
  heading: /^(\#{1,6})\s+(.+)$/gm,
  paragraph: /^(?!#{1,6}|\s*\[|\s*[*+-]|\s*\d+\.|\s*```|\s*>)(.+)/gm,
  list: /^\s*([*+-]|\d+\.)\s+(.+)$/gm,
  codeBlock: /^```(\w*)\n([\s\S]*?)```$/gm,
  inlineCode: /`([^`]+)`/g,
  bold: /\*\*([^*]+)\*\*/g,
  italic: /\*([^*]+)\*/g,
  link: /\[([^\]]+)\]\(([^)]+)\)/g,
  image: /!\[([^\]]*)\]\(([^)]+)\)/g,
  blockquote: /^>\s+(.+)$/gm,
  hr: /^[-*_]{3,}$/gm,
  table: /^\|(.+)\|$/gm,
};

/**
 * Analyse le contenu Markdown et extrait les métadonnées
 */
export function parseMarkdownMetadata(content: string): MarkdownMetadata {
  const lines = content.split('\n');
  const frontMatter = extractFrontMatter(content);

  let title = '';
  let author = '';
  let description = '';
  let tags: string[] = [];
  let date: Date | undefined;

  // Extraire des métadonnées du contenu
  lines.forEach(line => {
    const titleMatch = line.match(/^#\s+(.+)$/);
    if (titleMatch && !title) {
      title = titleMatch[1].trim();
    }

    const authorMatch = line.match(/^(author|by):\s*(.+)$/i);
    if (authorMatch) {
      author = authorMatch[2].trim();
    }

    const descMatch = line.match(/^(description|summary):\s*(.+)$/i);
    if (descMatch) {
      description = descMatch[2].trim();
    }

    const tagMatch = line.match(/tags?:\s*(.+)$/i);
    if (tagMatch) {
      tags = tagMatch[1].split(/[,#]/).map(tag => tag.trim()).filter(Boolean);
    }

    const dateMatch = line.match(/^(date|created):\s*(.+)$/i);
    if (dateMatch) {
      date = new Date(dateMatch[2].trim());
    }
  });

  // Utiliser les métadonnées frontmatter si disponibles
  if (frontMatter) {
    title = frontMatter.title || title;
    author = frontMatter.author || author;
    description = frontMatter.description || description;
    tags = frontMatter.tags || tags;
    date = frontMatter.date || date;
  }

  const wordCount = countWords(content);
  const readingTime = calculateReadingTime(wordCount);

  return {
    title,
    author,
    date: date || new Date(),
    tags,
    description,
    wordCount,
    readingTime,
    languages: detectLanguages(content),
    links: countLinks(content),
    images: countImages(content),
    custom: frontMatter || {},
  };
}

/**
 * Extrait les métadonnées frontmatter (YAML ou JSON)
 */
function extractFrontMatter(content: string): Record<string, any> | null {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    // Essayer avec les accolades JSON
    const jsonFrontMatterRegex = /^\{\s*([\s\S]*?)\s*\}\s*\n/;
    const jsonMatch = content.match(jsonFrontMatterRegex);

    if (jsonMatch) {
      try {
        return JSON.parse(`{${jsonMatch[1]}}`);
      } catch {
        return null;
      }
    }

    return null;
  }

  try {
    // Parser YAML basique
    const yaml = match[1];
    const metadata: Record<string, any> = {};

    yaml.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        metadata[key.trim()] = value;
      }
    });

    return metadata;
  } catch {
    return null;
  }
}

/**
 * Compte le nombre de mots dans le texte
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calcule le temps de lecture en minutes
 */
export function calculateReadingTime(wordCount: number, wordsPerMinute: number = 200): number {
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Détecte les langues dans le contenu
 */
export function detectLanguages(content: string): string[] {
  const languages = new Set<string>();

  // Détecter les blocs de code
  const codeBlocks = content.match(/```(\w+)/g);
  if (codeBlocks) {
    codeBlocks.forEach(block => {
      const lang = block.replace('```', '').trim();
      if (lang) languages.add(lang);
    });
  }

  // Détection basique de langue à partir du texte
  if (/[ÀÂÄÇÈÊËÏÎÔÖÙÛÜàâäçèêëïîôöùûüÿ]/.test(content)) {
    languages.add('french');
  }

  if (/[ñáéíóúü]/.test(content)) {
    languages.add('spanish');
  }

  if (/[ßäöü]/.test(content)) {
    languages.add('german');
  }

  return Array.from(languages);
}

/**
 * Compte les liens dans le contenu
 */
export function countLinks(content: string): { internal: number; external: number } {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];

  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    if (url.startsWith('http://') || url.startsWith('https://')) {
      externalLinks.push(url);
    } else {
      internalLinks.push(url);
    }
  }

  return {
    internal: internalLinks.length,
    external: externalLinks.length,
  };
}

/**
 * Compte les images dans le contenu
 */
export function countImages(content: string): { count: number; totalSize?: number } {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let count = 0;
  let totalSize = 0;

  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    count++;
    // Estimation basique de la taille (très approximative)
    totalSize += 100000; // ~100KB par image en moyenne
  }

  return {
    count,
    totalSize: count > 0 ? totalSize : undefined,
  };
}

/**
 * Génère une table des matières à partir des en-têtes
 */
export function generateTableOfContents(content: string, maxDepth: number = 6): TableOfContents {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const entries: TOCEntry[] = [];
  const slugger = createSlugger();

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();

    if (level <= maxDepth) {
      const slug = slugger.slug(text);
      const entry: TOCEntry = {
        title: text,
        level,
        anchor: slug,
        children: [],
        line: content.substring(0, match.index).split('\n').length,
      };

      entries.push(entry);
    }
  }

  return {
    title: 'Table of Contents',
    entries: buildTOCHierarchy(entries),
    maxDepth,
  };
}

/**
 * Construit la hiérarchie de la table des matières
 */
function buildTOCHierarchy(entries: TOCEntry[]): TOCEntry[] {
  const hierarchy: TOCEntry[] = [];
  const stack: TOCEntry[] = [];

  entries.forEach(entry => {
    // Pop entrées de niveau supérieur
    while (stack.length > 0 && stack[stack.length - 1].level >= entry.level) {
      stack.pop();
    }

    // Ajouter au parent ou à la racine
    if (stack.length === 0) {
      hierarchy.push(entry);
    } else {
      stack[stack.length - 1].children!.push(entry);
    }

    stack.push(entry);
  });

  return hierarchy;
}

/**
 * Crée un slugger simple pour les ancres
 */
function createSlugger() {
  const seen = new Map<string, number>();

  return {
    slug(text: string): string {
      let slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      if (seen.has(slug)) {
        const count = seen.get(slug)! + 1;
        seen.set(slug, count);
        slug = `${slug}-${count}`;
      } else {
        seen.set(slug, 0);
      }

      return slug;
    },
  };
}

/**
 * Valide le contenu Markdown
 */
export function validateMarkdown(content: string): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Vérifier les blocs de code fermés
  const codeBlocks = content.match(/```/g);
  if (codeBlocks && codeBlocks.length % 2 !== 0) {
    errors.push('Un bloc de code n\'est pas correctement fermé');
  }

  // Vérifier les listes
  const lines = content.split('\n');
  let inList = false;

  lines.forEach((line, index) => {
    // Vérifier les éléments de liste
    const isListItem = /^\s*([*+-]|\d+\.)\s/.test(line);

    if (isListItem && !inList) {
      inList = true;
    } else if (!isListItem && inList && line.trim() === '') {
      // Ligne vide dans la liste (acceptable)
    } else if (!isListItem && inList && line.trim()) {
      warnings.push(`Ligne ${index + 1}: Élément de liste non formatté correctement`);
    } else if (!isListItem && inList && line.trim() === '') {
      inList = false;
    }
  });

  // Vérifier les liens
  const links = content.match(/\[([^\]]+)\]\(([^)]*)\)/g);
  if (links) {
    links.forEach((link, index) => {
      if (link.includes('[](')) {
        warnings.push(`Lien ${index + 1}: Texte du lien vide`);
      }

      const urlMatch = link.match(/\(([^)]+)\)/);
      if (urlMatch && !urlMatch[1].trim()) {
        warnings.push(`Lien ${index + 1}: URL vide`);
      }
    });
  }

  // Vérifier les images
  const images = content.match(/!\[([^\]]*)\]\(([^)]*)\)/g);
  if (images) {
    images.forEach((image, index) => {
      const altMatch = image.match(/!\[([^\]]*)\]/);
      if (altMatch && !altMatch[1].trim()) {
        warnings.push(`Image ${index + 1}: Texte alt manquant ou vide`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Nettoie le contenu Markdown
 */
export function cleanMarkdown(content: string, options: {
  removeTrailingWhitespace?: boolean;
  normalizeLineEndings?: boolean;
  removeEmptyLines?: boolean;
} = {}): string {
  const {
    removeTrailingWhitespace = true,
    normalizeLineEndings = true,
    removeEmptyLines = false,
  } = options;

  let cleaned = content;

  // Normaliser les fins de ligne
  if (normalizeLineEndings) {
    cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  // Supprimer les espaces de fin de ligne
  if (removeTrailingWhitespace) {
    cleaned = cleaned.replace(/[ \t]+$/gm, '');
  }

  // Supprimer les lignes vides multiples
  if (removeEmptyLines) {
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  }

  return cleaned;
}

/**
 * Extrait les éléments Markdown spécifiques
 */
export function extractMarkdownElements(content: string, elementType: 'heading' | 'link' | 'image' | 'code'): string[] {
  const elements: string[] = [];

switch (elementType) {
    case 'heading': {
      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      let headingMatch;
      while ((headingMatch = headingRegex.exec(content)) !== null) {
        elements.push(headingMatch[0]);
      }
      break;
    }

    case 'link': {
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let linkMatch;
      while ((linkMatch = linkRegex.exec(content)) !== null) {
        elements.push(linkMatch[0]);
      }
      break;
    }

    case 'image': {
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      let imageMatch;
      while ((imageMatch = imageRegex.exec(content)) !== null) {
        elements.push(imageMatch[0]);
      }
      break;
    }

    case 'code': {
      const codeRegex = /`([^`]+)`|```(\w*)\n([\s\S]*?)```/g;
      let codeMatch;
      while ((codeMatch = codeRegex.exec(content)) !== null) {
        elements.push(codeMatch[0]);
      }
      break;
    }
  }

  return elements;
}

/**
 * Analyse la lisibilité du contenu
 */
export function analyzeReadability(content: string): {
  score: number;
  grade: 'very-easy' | 'easy' | 'fairly-easy' | 'standard' | 'fairly-difficult' | 'difficult' | 'very-difficult';
  avgWordsPerSentence: number;
  avgCharsPerWord: number;
  avgSentencesPerParagraph: number;
} {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  const words = content.trim().split(/\s+/).filter(w => w.length > 0);
  const chars = content.replace(/\s/g, '');

  const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
  const avgCharsPerWord = words.length > 0 ? chars.length / words.length : 0;
  const avgSentencesPerParagraph = paragraphs.length > 0 ? sentences.length / paragraphs.length : 0;

  // Score de lisibilité basé sur les métriques Flesch simplifiées
  const score = Math.max(0, Math.min(100, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (avgCharsPerWord / words.length))));

  let grade: string;
  if (score >= 90) grade = 'very-easy';
  else if (score >= 80) grade = 'easy';
  else if (score >= 70) grade = 'fairly-easy';
  else if (score >= 60) grade = 'standard';
  else if (score >= 50) grade = 'fairly-difficult';
  else if (score >= 30) grade = 'difficult';
  else grade = 'very-difficult';

  return {
    score: Math.round(score),
    grade: grade as any,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgCharsPerWord: Math.round(avgCharsPerWord * 10) / 10,
    avgSentencesPerParagraph: Math.round(avgSentencesPerParagraph * 10) / 10,
  };
}

export default {
  parseMarkdownMetadata,
  countWords,
  calculateReadingTime,
  detectLanguages,
  countLinks,
  countImages,
  generateTableOfContents,
  validateMarkdown,
  cleanMarkdown,
  extractMarkdownElements,
  analyzeReadability,
};
