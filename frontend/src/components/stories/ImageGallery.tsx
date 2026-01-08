import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { getPhotoUrl } from '../../config';

export interface ImageGalleryProps {
  images: string[];
  title?: string;
  initialIndex?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onImageClick?: (index: number) => void;
}

/**
 * ImageGallery Component - Görselleri küçük thumbnail'ler olarak gösterir
 * Tıklanınca popup modal'da büyük görüntüler
 * Controlled veya uncontrolled modda çalışabilir
 */
const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  title,
  initialIndex = 0,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onImageClick,
}) => {
  const [internalSelectedIndex, setInternalSelectedIndex] = useState<number | null>(null);
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Controlled veya uncontrolled mod
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const selectedIndex = isControlled ? (initialIndex !== undefined ? initialIndex : 0) : (internalSelectedIndex ?? 0);

  if (!images || images.length === 0) {
    return null;
  }

  const openModal = (index: number) => {
    if (onImageClick) {
      onImageClick(index);
    } else {
      setInternalSelectedIndex(index);
      setInternalIsOpen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
      setInternalSelectedIndex(null);
      document.body.style.overflow = 'unset';
    }
  };

  const goToPrevious = () => {
    const newIndex = (selectedIndex - 1 + images.length) % images.length;
    if (onImageClick) {
      onImageClick(newIndex);
    } else {
      setInternalSelectedIndex(newIndex);
    }
  };

  const goToNext = () => {
    const newIndex = (selectedIndex + 1) % images.length;
    if (onImageClick) {
      onImageClick(newIndex);
    } else {
      setInternalSelectedIndex(newIndex);
    }
  };

  // Initial index'i ayarla
  React.useEffect(() => {
    if (!isControlled && initialIndex !== undefined && initialIndex >= 0) {
      setInternalSelectedIndex(initialIndex);
    }
  }, [initialIndex, isControlled]);

  // Body overflow yönetimi
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, images.length]);

  return (
    <>
      {/* Thumbnail Gallery */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Maximize2 className="w-5 h-5 text-amber-600" />
          Fotoğraflar ({images.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => openModal(index)}
            >
              <img
                src={getPhotoUrl(photo)}
                alt={`${title || 'Fotoğraf'} ${index + 1}`}
                className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Ana Fotoğraf
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Modal/Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-7xl w-full max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
                  aria-label="Kapat"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevious();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
                      aria-label="Önceki fotoğraf"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
                      aria-label="Sonraki fotoğraf"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Main Image */}
                <div className="relative flex-1 flex items-center justify-center bg-black/30 rounded-lg overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      src={getPhotoUrl(images[selectedIndex])}
                      alt={`${title || 'Fotoğraf'} ${selectedIndex + 1}`}
                      className="max-w-full max-h-[85vh] object-contain"
                    />
                  </AnimatePresence>
                </div>

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    {selectedIndex + 1} / {images.length}
                  </div>
                )}

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (onImageClick) {
                            onImageClick(index);
                          } else {
                            setInternalSelectedIndex(index);
                          }
                        }}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === selectedIndex
                            ? 'border-amber-500 ring-2 ring-amber-500/50'
                            : 'border-transparent hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={getPhotoUrl(photo)}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;

