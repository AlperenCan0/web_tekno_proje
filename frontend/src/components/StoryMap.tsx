import { useMemo } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Story } from '../types';

/**
 * Story Map Component - Google Maps ile hikaye konumlarını gösterir
 * Hikayelerin koordinatlarını harita üzerinde marker olarak gösterir
 */

interface StoryMapProps {
  stories: Story[];
  onStoryClick?: (story: Story) => void;
}

const StoryMap: React.FC<StoryMapProps> = ({ stories, onStoryClick }) => {
  // Harita merkezi - Türkiye (varsayılan)
  const defaultCenter = useMemo(() => ({ lat: 39.9334, lng: 32.8597 }), []);

  // Koordinatları olan hikayeleri filtrele
  const storiesWithLocation = useMemo(
    () => stories.filter((story) => story.latitude && story.longitude),
    [stories]
  );

  // Harita container stilleri
  const mapContainerStyle = {
    width: '100%',
    height: '500px',
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
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
    <div className="w-full h-full">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={storiesWithLocation.length > 0 ? 6 : 5}
          options={mapOptions}
        >
          {storiesWithLocation.map((story) => (
            <Marker
              key={story.id}
              position={{
                lat: story.latitude!,
                lng: story.longitude!,
              }}
              onClick={() => onStoryClick?.(story)}
              title={story.title}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default StoryMap;

