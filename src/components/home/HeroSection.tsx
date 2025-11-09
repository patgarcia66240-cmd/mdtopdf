import React from 'react';
import { Link } from '@tanstack/react-router';
import { RocketLaunchIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const HeroSection: React.FC = () => {
  return (
    <section
      className="bg-gradient-to-br from-gray-800 to-gray-700 text-white py-16 px-8 text-center min-h-[400px] flex items-center"
      aria-labelledby="hero-title"
    >
      <div className="max-w-6xl mx-auto">
        <h1 id="hero-title" className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
          Convertissez Markdown vers PDF
          <span className="text-yellow-400"> Professionnel</span>
        </h1>

        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
          Transformez vos documents Markdown en PDF haute qualité avec prévisualisation en temps réel,
          templates personnalisables et export multi-formats.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/converter"
            className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center justify-center hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
            aria-label="Commencer à convertir vos documents Markdown"
          >
            <RocketLaunchIcon className="w-5 h-5 mr-2" />
            Commencer maintenant
          </Link>

          <Link
            to="/templates"
            className="bg-transparent text-white border border-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center justify-center hover:bg-white hover:text-gray-800 transition-colors duration-200"
            aria-label="Explorer les templates disponibles"
          >
            <Squares2X2Icon className="w-5 h-5 mr-2" />
            Voir les templates
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
