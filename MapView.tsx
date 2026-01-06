import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { GetLocation } from './GetLoc';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pin } from '../types';
import { genreColors } from '../lib/mockData';
import { MapPin as MapPinIcon, Building2 } from 'lucide-react';
import { renderToString } from 'react-dom/server';

interface MapViewProps {
  pins: Pin[];
  onPinClick: (pin: Pin) => void;
  onMapDoubleClick: (lat: number, lng: number) => void;
  isOverlayOpen?: boolean;
}

  export function MapView({ pins, onPinClick, onMapDoubleClick, isOverlayOpen }: MapViewProps) {
    // カスタムアイコン作成
    const createCustomIcon = (pin: Pin, count: number) => {
      const color = genreColors[pin.genre];
      const iconHtml = renderToString(
        <div className="flex items-center justify-center">
          {pin.userRole === 'business' ? (
            <div style={{ backgroundColor: color }} className="w-10 h-10 rotate-45 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden">
               <div className="-rotate-45 text-white">
                 <Building2 size={18} />
               </div>
            </div>
          ) : (
            <div style={{ backgroundColor: color }} className="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
              <MapPinIcon size={18} />
            </div>
          )}
        </div>
      );
  
      return L.divIcon({
        html: iconHtml,
        className: 'custom-pin',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });
    };
  
    return (
        <div className={`flex-1 w-full h-full relative ${isOverlayOpen ? 'z-0' : 'z-10'}`}>
        <MapContainer 
          center={[33.6071104, 133.6822505]} 
          zoom={17} 
          style={{ height: '100%', width: '100%' }}
          doubleClickZoom={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

        <GetLocation
          onLocationSelected={onMapDoubleClick} 
          enabled={!isOverlayOpen} 
        />
  
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.latitude, pin.longitude]}
              icon={createCustomIcon(pin, 1)}
              eventHandlers={{
                click: () => onPinClick(pin),
              }}
            >
            </Marker>
          ))}
        </MapContainer>
      </div>
    );
  }