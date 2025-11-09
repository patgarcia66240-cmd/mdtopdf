import React from 'react';
import { Link } from '@tanstack/react-router';
import { StarIcon } from '@heroicons/react/24/outline';

const CTASection: React.FC = () => {
  return (
    <section className="bg-gray-800 text-white py-16 px-8 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-semibold mb-6">
          Prêt à transformer vos documents ?
        </h2>

        <p className="text-xl mb-8 opacity-90 leading-relaxed">
          Rejoignez des milliers d'utilisateurs satisfaits et commencez
          à créer des PDF professionnels en quelques clics.
        </p>

        <Link
          to="/converter"
          className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center justify-center hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
          aria-label="Commencer à utiliser MDtoPDF Pro maintenant"
        >
          <StarIcon className="w-5 h-5 mr-2" />
          Commencer gratuitement
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
