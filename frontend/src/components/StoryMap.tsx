import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Story } from '../types';

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
 * Story Map Component - OpenStreetMap ile hikaye konumlarını gösterir
 * Hikayelerin koordinatlarını harita üzerinde marker olarak gösterir
 * API key gerektirmez
 */

interface StoryMapProps {
  stories: Story[];
  onStoryClick?: (story: Story) => void;
  height?: string;
}

const StoryMap: React.FC<StoryMapProps> = ({ stories, onStoryClick, height = '500px' }) => {
  // Harita merkezi - Türkiye (varsayılan)
  const defaultCenter: [number, number] = useMemo(() => [39.9334, 32.8597], []);

  // Koordinatları olan hikayeleri filtrele
  const storiesWithLocation = useMemo(
    () => stories.filter((story) => story.latitude && story.longitude),
    [stories]
  );

  // Eğer hikayeler varsa, ilk hikayeyi merkez al
  const mapCenter: [number, number] = useMemo(() => {
    if (storiesWithLocation.length > 0) {
      return [storiesWithLocation[0].latitude!, storiesWithLocation[0].longitude!];
    }
    return defaultCenter;
  }, [storiesWithLocation, defaultCenter]);

  const zoom = storiesWithLocation.length > 0 ? 6 : 5;

  return (
    <div className="w-full h-full relative z-0">
      <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden border border-gray-200 relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {storiesWithLocation.map((story) => (
            <Marker
              key={story.id}
              position={[story.latitude!, story.longitude!]}
              eventHandlers={{
                click: () => onStoryClick?.(story),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-1">{story.title}</h3>
                  {story.locationName && (
                    <p className="text-sm text-gray-600 mb-2">{story.locationName}</p>
                  )}
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                    {story.content.substring(0, 100)}...
                  </p>
                  <Link
                    to={`/stories/${story.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Devamını Oku →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default StoryMap;
