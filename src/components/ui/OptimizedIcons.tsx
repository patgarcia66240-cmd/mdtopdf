import React, { Suspense, lazy } from 'react';

// Interface pour les props des icônes
interface IconProps {
  className?: string;
  "aria-hidden"?: boolean;
}

// Composant de fallback pour le chargement des icônes
const IconSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={`animate-pulse bg-gray-300 rounded ${className || 'w-4 h-4'}`}
    aria-hidden="true"
  />
);

// Icônes chargées de manière lazy
const SunIcon = lazy(() =>
  import('@heroicons/react/24/outline').then(module => ({
    default: module.SunIcon
  }))
);

const MoonIcon = lazy(() =>
  import('@heroicons/react/24/outline').then(module => ({
    default: module.MoonIcon
  }))
);

const PencilIcon = lazy(() =>
  import('@heroicons/react/24/outline').then(module => ({
    default: module.PencilIcon
  }))
);

const ArrowDownTrayIcon = lazy(() =>
  import('@heroicons/react/24/outline').then(module => ({
    default: module.ArrowDownTrayIcon
  }))
);

const BookOpenIcon = lazy(() =>
  import('@heroicons/react/24/outline').then(module => ({
    default: module.BookOpenIcon
  }))
);

const ArchiveBoxIcon = lazy(() =>
  import('@heroicons/react/24/outline').then(module => ({
    default: module.ArchiveBoxIcon
  }))
);

// Composant wrapper pour les icônes avec lazy loading
const LazyIcon: React.FC<{
  icon: React.ComponentType<IconProps>;
  className?: string;
  "aria-hidden"?: boolean;
}> = ({ icon: Icon, className, "aria-hidden": ariaHidden }) => (
  <Suspense fallback={<IconSkeleton className={className} />}>
    <Icon className={className} aria-hidden={ariaHidden} />
  </Suspense>
);

// Export des icônes optimisées
export const OptimizedSunIcon: React.FC<IconProps> = (props) => (
  <LazyIcon icon={SunIcon} {...props} />
);

export const OptimizedMoonIcon: React.FC<IconProps> = (props) => (
  <LazyIcon icon={MoonIcon} {...props} />
);

export const OptimizedPencilIcon: React.FC<IconProps> = (props) => (
  <LazyIcon icon={PencilIcon} {...props} />
);

export const OptimizedArrowDownTrayIcon: React.FC<IconProps> = (props) => (
  <LazyIcon icon={ArrowDownTrayIcon} {...props} />
);

export const OptimizedBookOpenIcon: React.FC<IconProps> = (props) => (
  <LazyIcon icon={BookOpenIcon} {...props} />
);

export const OptimizedArchiveBoxIcon: React.FC<IconProps> = (props) => (
  <LazyIcon icon={ArchiveBoxIcon} {...props} />
);

// Export par défaut pour compatibilité
export {
  SunIcon,
  MoonIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  BookOpenIcon,
  ArchiveBoxIcon
};

export default {
  SunIcon: OptimizedSunIcon,
  MoonIcon: OptimizedMoonIcon,
  PencilIcon: OptimizedPencilIcon,
  ArrowDownTrayIcon: OptimizedArrowDownTrayIcon,
  BookOpenIcon: OptimizedBookOpenIcon,
  ArchiveBoxIcon: OptimizedArchiveBoxIcon
};