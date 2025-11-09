import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loadingStrategy?: 'lazy' | 'eager' | 'proximity';
  threshold?: number;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loadingStrategy = 'lazy',
  threshold = 0.1,
  fallback,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(loadingStrategy === 'eager');
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Skeleton de chargement
  const ImageSkeleton: React.FC = () => (
    <div
      className={`animate-pulse bg-gray-300 rounded ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );

  // Intersection Observer pour le lazy loading
  useEffect(() => {
    if (loadingStrategy === 'eager' || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [loadingStrategy, threshold]);

  // Gestion du chargement de l'image
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Affichage du fallback en cas d'erreur
  if (hasError) {
    return fallback || (
      <div
        className={`flex items-center justify-center bg-gray-200 text-gray-500 rounded ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-xs text-center px-2">Image non disponible</span>
      </div>
    );
  }

  // Affichage du skeleton pendant le chargement
  if (!isInView || !isLoaded) {
    return (
      <div ref={imgRef} style={{ width, height }}>
        <ImageSkeleton />
        {isInView && (
          <img
            src={src}
            alt={alt}
            className={`absolute inset-0 ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            style={{ width, height }}
            onLoad={handleLoad}
            onError={handleError}
            loading={loadingStrategy === 'lazy' ? 'lazy' : 'eager'}
          />
        )}
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`transition-opacity duration-300 ${className}`}
      style={{ width, height }}
      onLoad={handleLoad}
      onError={handleError}
      loading={loadingStrategy === 'lazy' ? 'lazy' : 'eager'}
    />
  );
};

export default OptimizedImage;