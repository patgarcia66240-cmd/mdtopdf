import { axe, toJSON } from 'axe-core';

export interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
}

export interface AccessibilityAuditResult {
  violations: AccessibilityViolation[];
  passes: any[];
  incomplete: any[];
  timestamp: Date;
  url: string;
  score: {
    totalViolations: number;
    criticalViolations: number;
    seriousViolations: number;
    moderateViolations: number;
    minorViolations: number;
  };
}

class AccessibilityAuditor {
  private static instance: AccessibilityAuditor;
  private auditHistory: AccessibilityAuditResult[] = [];

  static getInstance(): AccessibilityAuditor {
    if (!AccessibilityAuditor.instance) {
      AccessibilityAuditor.instance = new AccessibilityAuditor();
    }
    return AccessibilityAuditor.instance;
  }

  /**
   * Effectue un audit d'accessibilité complet sur le DOM actuel
   */
  async auditAccessibility(selector?: string): Promise<AccessibilityAuditResult> {
    const context = selector ? { include: [selector] } : undefined;
    const startTime = Date.now();

    try {
      // Configuration axe-core pour WCAG 2.1 AA
      const axeConfig = {
        rules: {
          // Activer toutes les règles WCAG 2.1 AA
          'color-contrast': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'aria-labels': { enabled: true },
          'focus-management': { enabled: true },
          'heading-order': { enabled: true },
          'landmark-roles': { enabled: true },
          'link-name': { enabled: true },
          'button-name': { enabled: true },
          'label-title-only': { enabled: true },
          'p-as-heading': { enabled: true },
          'select-name': { enabled: true },
          'table-header': { enabled: true },
          'td-headers-attr': { enabled: true },
          'aria-allowed-attr': { enabled: true },
          'aria-hidden-body': { enabled: true },
          'aria-hidden-focus': { enabled: true },
          'aria-input-field-name': { enabled: true },
          'aria-required-attr': { enabled: true },
          'aria-required-children': { enabled: true },
          'aria-required-parent': { enabled: true },
          'aria-roles': { enabled: true },
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
          'bypass': { enabled: true },
          'frame-title': { enabled: true },
          'html-has-lang': { enabled: true },
          'img-alt': { enabled: true },
          'input-button-name': { enabled: true },
          'meta-viewport-large': { enabled: true },
          'meta-viewport': { enabled: true },
          'region': { enabled: true }
        },
        tags: ['wcag2aa', 'wcag21aa']
      };

      // Exécuter l'audit axe-core
      const results = await axe(context, axeConfig);
      const jsonResults = toJSON(results);

      // Calculer les scores
      const violations = jsonResults.violations.map((violation: any) => ({
        id: violation.id,
        impact: violation.impact,
        tags: violation.tags,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map((node: any) => ({
          html: node.html,
          target: node.target,
          failureSummary: node.failureSummary
        }))
      }));

      const score = this.calculateScore(violations);

      const auditResult: AccessibilityAuditResult = {
        violations,
        passes: jsonResults.passes,
        incomplete: jsonResults.incomplete,
        timestamp: new Date(),
        url: window.location.href,
        score
      };

      this.auditHistory.push(auditResult);

      console.log(`✅ Audit d'accessibilité terminé en ${Date.now() - startTime}ms`);
      console.log(`📊 Score: ${score.criticalViolations} critiques, ${score.seriousViolations} sérieux`);

      return auditResult;

    } catch (error) {
      console.error('❌ Erreur lors de l\'audit d\'accessibilité:', error);
      throw new Error(`Échec de l'audit: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Calcule les scores d'accessibilité
   */
  private calculateScore(violations: AccessibilityViolation[]) {
    const score = {
      totalViolations: violations.length,
      criticalViolations: violations.filter(v => v.impact === 'critical').length,
      seriousViolations: violations.filter(v => v.impact === 'serious').length,
      moderateViolations: violations.filter(v => v.impact === 'moderate').length,
      minorViolations: violations.filter(v => v.impact === 'minor').length
    };
    return score;
  }

  /**
   * Génère des recommandations d'amélioration
   */
  generateRecommendations(results: AccessibilityAuditResult): string[] {
    const recommendations: string[] = [];

    // Analyser les violations et générer des recommandations
    results.violations.forEach(violation => {
      switch (violation.id) {
        case 'color-contrast':
          recommendations.push('🎨 Améliorer le contraste des couleurs pour respecter le ratio WCAG AA (4.5:1)');
          break;
        case 'keyboard-navigation':
          recommendations.push('⌨️ Assurer que tous les éléments interactifs sont navigables au clavier');
          break;
        case 'aria-labels':
          recommendations.push('🏷️ Ajouter des labels ARIA appropriés pour les lecteurs d\'écran');
          break;
        case 'focus-management':
          recommendations.push('🎯 Améliorer la gestion du focus visible et logique');
          break;
        case 'heading-order':
          recommendations.push('📝 Corriger la hiérarchie des titres (h1, h2, h3...)');
          break;
        case 'img-alt':
          recommendations.push('🖼️ Ajouter des textes alternatifs pour toutes les images');
          break;
        case 'button-name':
          recommendations.push('🔘 Ajouter des noms descriptifs pour tous les boutons');
          break;
        case 'link-name':
          recommendations.push('🔗 Assurer que tous les liens ont des textes descriptifs');
          break;
        case 'bypass':
          recommendations.push('⏭️ Ajouter un lien "passer au contenu" pour le clavier');
          break;
        case 'html-has-lang':
          recommendations.push('🌐 Ajouter un attribut lang à la balise HTML');
          break;
        default:
          recommendations.push(`🔧 Corriger: ${violation.description}`);
      }
    });

    return recommendations;
  }

  /**
   * Exporte les résultats en format JSON
   */
  exportResults(): string {
    return JSON.stringify(this.auditHistory, null, 2);
  }

  /**
   * Obtient l'historique des audits
   */
  getAuditHistory(): AccessibilityAuditResult[] {
    return [...this.auditHistory];
  }

  /**
   * Efface l'historique des audits
   */
  clearHistory(): void {
    this.auditHistory = [];
  }
}

export { AccessibilityAuditor };
export default AccessibilityAuditor;