import { useState, useEffect, useRef } from 'react';

interface LazyImageOptions {
  threshold?: number;
  rootMargin?: string;
  placeholder?: string;
  className?: string;
}

export const useLazyImage = (options: LazyImageOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNkMxNy43OTA5IDI2IDE2IDI0LjIwOTEgMTYgMjJDMTYgMTkuNzkwOSAxNy43OTA5IDE4IDIwIDE4QzIyLjIwOTEgMTggMjQgMTkuNzkwOSAyNCAyMkMyNCAyNC4yMDkxIDIyLjIwOTEgMjYgMjAgMjZaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg==',
    className = ''
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  const getImageProps = (src: string, alt: string) => ({
    ref: imgRef,
    src: isInView ? src : placeholder,
    alt,
    loading: 'lazy',
    decoding: 'async',
    onLoad: handleLoad,
    onError: handleError,
    className: `${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    style: {
      filter: isLoaded ? 'none' : 'blur(5px)',
    }
  });

  return {
    isLoaded,
    isInView,
    hasError,
    getImageProps
  };
};

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  onLoad,
  onError
}) => {
  const { getImageProps } = useLazyImage({ className, placeholder });

  return (
    <img
      {...getImageProps(src, alt)}
      onLoad={(e) => {
        onLoad?.();
        // Additional load handling
      }}
      onError={(e) => {
        onError?.();
        // Additional error handling
      }}
    />
  );
};

export default useLazyImage;