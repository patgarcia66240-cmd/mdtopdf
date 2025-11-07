import { AccessibilityAuditor } from './AccessibilityAuditor';

/**
 * Script de test pour l'audit d'accessibilité
 * Ce script peut être exécuté dans la console du navigateur pour tester l'audit
 */

export const testAccessibilityAudit = async () => {
  console.log('🚀 Début du test d\'accessibilité WCAG 2.1 AA...');

  const auditor = AccessibilityAuditor.getInstance();

  try {
    // Audit complet de la page
    const results = await auditor.auditAccessibility();

    console.log('📊 RÉSULTATS DE L\'AUDIT D\'ACCESSIBILITÉ');
    console.log('='.repeat(50));
    console.log(`🔍 URL: ${results.url}`);
    console.log(`⏰ Timestamp: ${results.timestamp.toLocaleString()}`);
    console.log(`📈 Score total: ${results.score.totalViolations} violations`);
    console.log(`  - Critiques: ${results.score.criticalViolations} 🔴`);
    console.log(`  - Sérieuses: ${results.score.seriousViolations} 🟠`);
    console.log(`  - Modérées: ${results.score.moderateViolations} 🟡`);
    console.log(`  - Mineures: ${results.score.minorViolations} 🟢`);

    if (results.violations.length > 0) {
      console.log('\n🚨 VIOLATIONS DÉTECTÉES:');
      console.log('-'.repeat(30));

      results.violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.description}`);
        console.log(`   Impact: ${violation.impact}`);
        console.log(`   Éléments affectés: ${violation.nodes.length}`);
        console.log(`   Help: ${violation.help}`);
        console.log(`   URL: ${violation.helpUrl}`);
        console.log('');
      });

      // Générer les recommandations
      const recommendations = auditor.generateRecommendations(results);
      console.log('💡 RECOMMANDATIONS D\'AMÉLIORATION:');
      console.log('-'.repeat(35));
      recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    } else {
      console.log('✅ AUCUNE VIOLATION DÉTECTÉE - Application conforme WCAG 2.1 AA!');
    }

    // Exporter les résultats
    const exportResults = auditor.exportResults();
    console.log('\n📄 Résultats exportés (longueur):', exportResults.length);

    return results;

  } catch (error) {
    console.error('❌ Erreur lors du test d\'accessibilité:', error);
    throw error;
  }
};

/**
 * Fonction pour créer du contenu de test avec des problèmes d'accessibilité connus
 */
export const createTestContent = () => {
  const testHTML = `
    <div id="accessibility-test-content">
      <!-- Test: Manque de lang attribute -->
      <div>
        <!-- Test: Bouton sans texte accessible -->
        <button onclick="alert('clicked')"></button>

        <!-- Test: Image sans alt -->
        <img src="test.jpg" />

        <!-- Test: Lien sans texte -->
        <a href="#"></a>

        <!-- Test: Manque de contraste (simulé) -->
        <div style="color: #ffffff; background-color: #f0f0f0;">
          Texte à faible contraste
        </div>

        <!-- Test: Input sans label -->
        <input type="text" placeholder="Entrez du texte" />

        <!-- Test: Header sans titre h1 -->
        <section>
          <h2>Section sans h1</h2>
          <p>Contenu de la section</p>
        </section>

        <!-- Test: Table sans thead -->
        <table>
          <tr>
            <td>Cellule 1</td>
            <td>Cellule 2</td>
          </tr>
        </table>

        <!-- Test: Bonnes pratiques -->
        <h1>Titre principal correct</h1>
        <button aria-label="Bouton avec label ARIA">Action</button>
        <img src="good.jpg" alt="Image descriptive" />
        <a href="#accessible">Lien accessible</a>
        <label for="good-input">Champ avec label:</label>
        <input type="text" id="good-input" />

        <!-- Test: Navigation clavier -->
        <div tabindex="0" role="button">
          Élément focusable au clavier
        </div>
      </div>
    </div>
  `;

  // Injecter le contenu de test dans la page
  const testContainer = document.createElement('div');
  testContainer.innerHTML = testHTML;
  document.body.appendChild(testContainer);

  console.log('🧪 Contenu de test d\'accessibilité injecté');
  return testContainer;
};

/**
 * Fonction pour nettoyer le contenu de test
 */
export const cleanupTestContent = () => {
  const testContainer = document.getElementById('accessibility-test-content');
  if (testContainer) {
    testContainer.remove();
    console.log('🧹 Contenu de test nettoyé');
  }
};

// Auto-test si le script est exécuté directement
if (typeof window !== 'undefined') {
  console.log('🔧 Utilitaires de test d\'accessibilité chargés');
  console.log('📝 Commandes disponibles:');
  console.log('  testAccessibilityAudit() - Lancer un audit complet');
  console.log('  createTestContent() - Créer du contenu de test');
  console.log('  cleanupTestContent() - Nettoyer le contenu de test');
}