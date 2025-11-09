import React from 'react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-12 text-gray-800">
          Ils nous font confiance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-8 rounded-xl border-l-4 border-blue-600 min-h-[200px] flex flex-col justify-between">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">⭐</span>
              ))}
            </div>
            <p className="text-gray-600 italic mb-4 leading-relaxed">
              "MDtoPDF Pro a révolutionné notre workflow de documentation.
              La qualité des PDF générés est exceptionnelle et l'interface est intuitive."
            </p>
            <div>
              <div className="font-semibold text-gray-800">
                Marie Dubois, Tech Lead
              </div>
              <div className="text-sm text-gray-500">
                Startup Tech - Paris
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border-l-4 border-blue-600 min-h-[200px] flex flex-col justify-between">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">⭐</span>
              ))}
            </div>
            <p className="text-gray-600 italic mb-4 leading-relaxed">
              "L'export multi-formats et les templates personnalisables nous permettent
              de maintenir une cohérence parfaite dans tous nos documents."
            </p>
            <div>
              <div className="font-semibold text-gray-800">
                Jean Martin, Directeur Marketing
              </div>
              <div className="text-sm text-gray-500">
                Agence Digitale - Lyon
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-xl border-l-4 border-blue-600 min-h-[200px] flex flex-col justify-between">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">⭐</span>
              ))}
            </div>
            <p className="text-gray-600 italic mb-4 leading-relaxed">
              "L'accessibilité et les raccourcis clavier font de cet outil
              un must-have pour notre équipe inclusive."
            </p>
            <div>
              <div className="font-semibold text-gray-800">
                Sophie Chen, UX Designer
              </div>
              <div className="text-sm text-gray-500">
                Entreprise Sociale - Bordeaux
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
