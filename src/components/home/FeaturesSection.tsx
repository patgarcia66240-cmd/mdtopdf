import React from 'react';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-12 text-gray-800">
          Fonctionnalités puissantes pour vos documents
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center min-h-[280px] flex flex-col justify-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Conversion Markdown → PDF
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Transformez vos fichiers Markdown en PDF professionnels avec une qualité d'impression optimale.
              Support complet de la syntaxe Markdown incluant tableaux, listes et formatage avancé.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center min-h-[280px] flex flex-col justify-center">
            <div className="text-6xl mb-4">👁️</div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Prévisualisation temps réel
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Visualisez instantanément vos modifications avec un aperçu fidèle du rendu final.
              Ajustez la mise en page, les couleurs et la typographie en temps réel.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center min-h-[280px] flex flex-col justify-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Templates personnalisables
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Choisissez parmi une collection de templates professionnels ou créez le vôtre.
              Adaptez les couleurs, polices et mises en page à votre charte graphique.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center min-h-[280px] flex flex-col justify-center">
            <div className="text-6xl mb-4">📤</div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Export multi-formats
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Exportez vos documents en PDF, HTML, DOCX ou Markdown.
              Chaque format est optimisé pour garantir la meilleure qualité possible.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center min-h-[280px] flex flex-col justify-center">
            <div className="text-6xl mb-4">♿</div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Accessibilité complète
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Interface conçue pour tous les utilisateurs avec support du clavier,
              lecteur d'écran et conformité aux standards d'accessibilité WCAG.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center min-h-[280px] flex flex-col justify-center">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Performance optimisée
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Génération rapide même pour les documents volumineux.
              Cache intelligent et optimisation des ressources pour une expérience fluide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
