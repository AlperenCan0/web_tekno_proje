import { useState, useCallback, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

/**
 * Location Picker Component - Haritadan konum seçme bileşeni
 * Kullanıcılar haritaya tıklayarak konum seçebilir
 * Seçilen konum marker ile gösterilir
 */

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  onLocationSelect,
  height = '400px',
}) => {
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );

  // Harita merkezi - Seçili konum varsa onu, yoksa Türkiye merkezini kullan
  const mapCenter = useMemo(() => {
    if (selectedPosition) {
      return selectedPosition;
    }
    if (latitude && longitude) {
      return { lat: latitude, lng: longitude };
    }
    return { lat: 39.9334, lng: 32.8597 }; // Türkiye merkezi
  }, [selectedPosition, latitude, longitude]);

  // Haritaya tıklandığında konum seç
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setSelectedPosition({ lat, lng });
        onLocationSelect(lat, lng);
      }
    },
    [onLocationSelect]
  );

  // Harita container stilleri
  const mapContainerStyle = {
    width: '100%',
    height: height,
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
    clickableIcons: false,
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  if (!apiKey) {
    return (
      <div className="w-full bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-yellow-800">
          Google Maps API key bulunamadı. Lütfen .env dosyasına VITE_GOOGLE_MAPS_API_KEY ekleyin.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-2 text-sm text-gray-600">
        Haritaya tıklayarak konum seçin
      </div>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={selectedPosition ? 15 : 6}
          options={mapOptions}
          onClick={handleMapClick}
        >
          {selectedPosition && (
            <Marker
              position={selectedPosition}
              title="Seçilen konum"
              draggable={true}
              onDragEnd={(e) => {
                if (e.latLng) {
                  const lat = e.latLng.lat();
                  const lng = e.latLng.lng();
                  setSelectedPosition({ lat, lng });
                  onLocationSelect(lat, lng);
                }
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      {selectedPosition && (
        <div className="mt-2 text-sm text-gray-600">
          Seçilen konum: {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;

