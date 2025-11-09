import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';

/**
 * Composant Breadcrumbs avec données structurées Schema.org
 * Fournit une navigation hiérarchique optimisée pour le SEO
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Génère les données structurées BreadcrumbList pour Schema.org
 */
const generateBreadcrumbStructuredData = (items: BreadcrumbItem[], baseUrl: string = 'https://mdtopdf-pro.app') => {
  const validItems = items.filter(item => item.href || item.current);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": validItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.current ? undefined : `${baseUrl}${item.href}`
    }))
  };
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {

  // Générer les données structurées
  const structuredData = React.useMemo(() => generateBreadcrumbStructuredData(items), [items]);
  const structuredJson = React.useMemo(() => JSON.stringify(structuredData, null, 2), [structuredData]);

  // Injecter les données structurées dans le head
  React.useEffect(() => {
    const scriptId = 'breadcrumb-structured-data';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement;

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    if (scriptElement.textContent !== structuredJson) {
      scriptElement.textContent = structuredJson;
    }
  }, [structuredJson]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Fil d'Ariane"
      className={className}
      style={{
        padding: '1rem 0',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <ol
          style={{
            display: 'flex',
            alignItems: 'center',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            fontSize: '0.875rem',
            color: '#6b7280'
          }}
        >
          {/* Lien vers l'accueil toujours présent */}
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              to="/"
              style={{
                color: '#2563eb',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Retour à l'accueil"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: '0.5rem' }}
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Accueil
            </Link>
          </li>

          {/* Séparateur */}
          <li style={{
            display: 'flex',
            alignItems: 'center',
            margin: '0 0.5rem'
          }} aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: '#9ca3af' }}
            >
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </li>

          {/* Items du fil d'Ariane */}
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <li style={{ display: 'flex', alignItems: 'center' }}>
                {item.current ? (
                  <span
                    style={{
                      color: '#1f2937',
                      fontWeight: '500'
                    }}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <Link
                    to={item.href}
                    style={{
                      color: '#2563eb',
                      textDecoration: 'none'
                    }}
                    aria-label={`Aller à ${item.label}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span style={{ color: '#6b7280' }}>
                    {item.label}
                  </span>
                )}
              </li>

              {/* Séparateur entre les items (sauf pour le dernier) */}
              {index < items.length - 1 && (
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '0 0.5rem'
                }} aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: '#9ca3af' }}
                  >
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </div>
    </nav>
  );
};

/**
 * Hook personnalisé pour générer automatiquement les breadcrumbs
 * basé sur l'URL actuelle
 */
export const useBreadcrumbs = () => {
  const location = useLocation();

  const generateBreadcrumbs = React.useCallback(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Construire les breadcrumbs basé sur les segments de l'URL
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Traduire les segments en labels lisibles
      let label = segment;
      switch (segment) {
        case 'converter':
          label = 'Convertisseur';
          break;
        case 'templates':
          label = 'Templates';
          break;
        case 'exports':
          label = 'Exports';
          break;
        case 'settings':
          label = 'Paramètres';
          break;
        case 'faq':
          label = 'FAQ';
          break;
        case 'docs':
          label = 'Documentation';
          break;
        case 'contact':
          label = 'Contact';
          break;
        default:
          // Pour les routes dynamiques comme /templates/:id
          if (segment.match(/^[a-f0-9]+$/i)) {
            label = 'Détails';
          } else {
            // Capitaliser la première lettre
            label = segment.charAt(0).toUpperCase() + segment.slice(1);
          }
      }

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  }, [location.pathname]);

  return generateBreadcrumbs();
};

export default Breadcrumbs;
