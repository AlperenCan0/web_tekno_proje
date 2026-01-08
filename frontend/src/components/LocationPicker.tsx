import { useState, useCallback, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet default marker icon fix
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/**
 * Location Picker Component - Haritadan konum seçme bileşeni
 * OpenStreetMap tabanlı - API key gerektirmez
 */

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
}

// Harita tıklama olaylarını yakalayan bileşen
const MapClickHandler: React.FC<{
  onLocationSelect: (lat: number, lng: number) => void;
  setPosition: (pos: { lat: number; lng: number }) => void;
}> = ({ onLocationSelect, setPosition }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

// Harita merkezini değiştiren bileşen
const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  onLocationSelect,
  height = '400px',
}) => {
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );

  // Initial position değiştiğinde güncelle
  useEffect(() => {
    if (latitude && longitude) {
      setSelectedPosition({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  // Harita merkezi
  const mapCenter = useMemo((): [number, number] => {
    if (selectedPosition) {
      return [selectedPosition.lat, selectedPosition.lng];
    }
    if (latitude && longitude) {
      return [latitude, longitude];
    }
    return [39.9334, 32.8597]; // Türkiye merkezi (Ankara)
  }, [selectedPosition, latitude, longitude]);

  const zoom = selectedPosition ? 15 : 6;

  return (
    <div className="w-full">
      <div className="mb-2 text-sm text-gray-600">
        Haritaya tıklayarak konum seçin
      </div>
      <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={mapCenter} zoom={zoom} />
          <MapClickHandler
            onLocationSelect={onLocationSelect}
            setPosition={setSelectedPosition}
          />
          {selectedPosition && (
            <Marker
              position={[selectedPosition.lat, selectedPosition.lng]}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  setSelectedPosition({ lat: position.lat, lng: position.lng });
                  onLocationSelect(position.lat, position.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      {selectedPosition && (
        <div className="mt-2 text-sm text-gray-600">
          Seçilen konum: {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
