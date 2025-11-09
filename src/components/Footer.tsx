import { Link } from "@tanstack/react-router";

/**
 * Composant Footer SEO-friendly pour MDtoPDF Pro
 * Inclut les liens de navigation, informations légales et liens externes
 */
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 px-8 pt-4 mt-auto" role="contentinfo">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Section principale avec description */}
        <div>
          <h3 className="text-white mb-4 text-xl font-semibold">
            MDtoPDF Pro
          </h3>
          <p className="leading-relaxed mb-4">
            Convertisseur Markdown vers PDF professionnel avec prévisualisation en temps réel,
            templates personnalisables et export multi-formats.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/patgarcia66240-cmd/mdtopdf"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="GitHub - Code source"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="/sitemap.xml"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Plan du site"
            >
              Sitemap
            </a>
          </div>
        </div>

        {/* Section fonctionnalités */}
        <div>
          <h4 className="text-white mb-4 text-lg font-semibold">
            Fonctionnalités
          </h4>
          <ul className="list-none p-0 m-0 space-y-2">
            <li>
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors no-underline"
              >
                Conversion Markdown → PDF
              </Link>
            </li>
            <li>
              <Link
                to="/templates"
                className="text-gray-300 hover:text-white transition-colors no-underline"
              >
                Templates personnalisables
              </Link>
            </li>
            <li>
              <Link
                to="/exports"
                className="text-gray-300 hover:text-white transition-colors no-underline"
              >
                Historique d'exports
              </Link>
            </li>
          </ul>
        </div>

        {/* Section support */}
        <div>
          <h4 className="text-white mb-4 text-lg font-semibold">
            Support
          </h4>
          <ul className="list-none p-0 m-0 space-y-2">
            <li>
              <a
                href="/docs"
                className="text-gray-300 hover:text-white transition-colors no-underline"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href="/faq"
                className="text-gray-300 hover:text-white transition-colors no-underline"
              >
                FAQ
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-gray-300 hover:text-white transition-colors no-underline"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Section copyright */}
      <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm">
        <p>&copy; 2025 MDtoPDF Pro. Tous droits réservés. | Version 1.0.0</p>
      </div>
    </footer>
  );
};

export default Footer;
