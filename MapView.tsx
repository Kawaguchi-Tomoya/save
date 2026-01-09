import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pin } from '../types';
import { genreColors } from '../lib/mockData';
import { MapPin as MapPinIcon, Building2 } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { GetLocation } from './GetLocation';

interface MapViewProps {
  pins: Pin[];
  onPinClick: (pin: Pin) => void;
  onMapDoubleClick: (lat: number, lng: number) => void;
  isOverlayOpen?: boolean;
}

export function MapView({ pins, onPinClick, onMapDoubleClick, isOverlayOpen }: MapViewProps) {
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  const createCustomIcon = (pin: Pin, isHovered: boolean) => {
    const color = genreColors[pin.genre];
    const size = "w-10 h-10"; 

    const iconHtml = renderToString(
      <div className={`relative transition-all duration-300 ${isHovered ? 'scale-110 -translate-y-2' : ''}`}>
        {/* ピンの影 */}
        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full bg-black/20 blur-sm transition-all ${isHovered ? 'w-8 h-3' : 'w-6 h-2'}`} />

        {pin.userRole === 'business' ? (
          // 事業者ピン（ダイヤモンド形状）
          <div className="relative">
            <div 
              className={`${size} transform rotate-45 shadow-2xl overflow-hidden border-4 border-white transition-all`}
              style={{ 
                backgroundColor: color,
                boxShadow: `0 10px 25px -5px ${color}50`
              }}
            >
              <div className="transform -rotate-45 w-full h-full flex items-center justify-center">
                {pin.businessIcon ? (
                  <img src={pin.businessIcon} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
            {isHovered && (
              <div className="absolute inset-0 transform rotate-45 animate-ping" style={{ backgroundColor: color, opacity: 0.3 }} />
            )}
          </div>
        ) : (
          // 一般ユーザーピン（円形＋グロー）
          <div className="relative">
            <div 
              className={`${size} rounded-full shadow-2xl flex items-center justify-center transition-all border-4 border-white relative`}
              style={{ 
                backgroundColor: color,
                boxShadow: `0 10px 25px -5px ${color}50`
              }}
            >
              <MapPinIcon className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%)` }} />
            </div>
            {isHovered && (
              <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: color, opacity: 0.3 }} />
            )}
          </div>
        )}
      </div>
    );

    return L.divIcon({
      html: iconHtml,
      className: '', 
      iconSize: [40, 40],
      iconAnchor: [20, 40], 
    });
  };

  return (
    <div className="flex-1 w-full h-full relative" style={{ zIndex: isOverlayOpen ? 0 : 10 }}>
      {/* 凡例 */}
      <div 
        className="absolute bottom-6 left-6 pointer-events-auto"
        style={{ zIndex: 99999 }} // Leafletの全レイヤー(最大1000程度)より上に配置
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-white/50">
          <div className="text-xs text-slate-700 mb-3 font-bold">凡例</div>
          <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: '#EF4444' }} />
              <span className="text-slate-700">グルメ</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: '#F59E0B' }} />
              <span className="text-slate-700">イベント</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: '#10B981' }} />
              <span className="text-slate-700">景色</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: '#3B82F6' }} />
              <span className="text-slate-700">お店</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: '#8B5CF6' }} />
              <span className="text-slate-700">緊急情報</span>
            </div>
            <div className="border-t border-slate-300 my-2" />
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full shadow-md bg-blue-500 border-2 border-white flex items-center justify-center">
                <MapPinIcon className="w-3 h-3 text-white" />
              </div>
              <span className="text-slate-700">一般投稿</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 transform rotate-45 shadow-md bg-blue-500 border-2 border-white" />
              <span className="text-slate-700">事業者投稿</span>
            </div>
          </div>
        </div>
      </div>

      {/* 地図 */}
      <MapContainer 
        center={[33.6071, 133.6823]} 
        zoom={17} 
        style={{ height: '100%', width: '100%' }}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 座標取得 */}
        <GetLocation 
          onLocationSelected={onMapDoubleClick} 
          enabled={!isOverlayOpen} 
        />

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.latitude, pin.longitude]}
            icon={createCustomIcon(pin, hoveredPinId === pin.id)}
            eventHandlers={{
              click: () => onPinClick(pin),
              mouseover: () => setHoveredPinId(pin.id),
              mouseout: () => setHoveredPinId(null),
            }}
          >
          </Marker>
        ))}
      </MapContainer>

      {/* Leafletの標準ツールチップデザインを打ち消すスタイル */}
      <style>{`
        .leaflet-tooltip.custom-tooltip-container {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-tooltip-top:before {
          border-top-color: #0f172a !important; /* slate-900 */
        }
      `}</style>
    </div>
  );
}