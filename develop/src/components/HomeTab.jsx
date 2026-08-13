import React, { useState, useEffect, useRef } from 'react';
import { Compass, Crosshair } from 'lucide-react';
import { BUSAN_RIVER_STATIONS, getStationWaterData } from '../api/waterQualityApi';

const STATION_COORDS = {
  '2014A65': { lat: 35.1970, lng: 129.0835, river: '온천천', station: '세병교 지점' },
  '2014A70': { lat: 35.1432, lng: 129.0625, river: '동천', station: '범일교 지점' },
  '2014A85': { lat: 35.0985, lng: 128.9680, river: '괴정천', station: '하굿둑 지점' }
};

export default function HomeTab({ selectedStationId, setSelectedStationId, onOpenOverlay }) {
  const mapRef = useRef(null);
  const currentCoords = STATION_COORDS[selectedStationId] || STATION_COORDS['2014A65'];
  const realtimeData = getStationWaterData(selectedStationId);

  // Kakao Map Official Autoload implementation
  useEffect(() => {
    const coords = currentCoords;

    const createMap = () => {
      const container = mapRef.current || document.getElementById('map');
      if (!container) return;

      if (window.kakao && window.kakao.maps) {
        container.innerHTML = '';

        const options = {
          center: new window.kakao.maps.LatLng(coords.lat, coords.lng),
          level: 4
        };

        const map = new window.kakao.maps.Map(container, options);

        // Add Marker
        const markerPosition = new window.kakao.maps.LatLng(coords.lat, coords.lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);

        // Add InfoWindow
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:6px 10px;font-size:12px;font-weight:bold;color:#0f172a;border-radius:8px;">📍 ${coords.river} ${coords.station}</div>`
        });
        infowindow.open(map, marker);
      }
    };

    if (window.kakao && window.kakao.maps) {
      if (window.kakao.maps.load) {
        window.kakao.maps.load(createMap);
      } else {
        createMap();
      }
    } else {
      const timer = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(timer);
          if (window.kakao.maps.load) {
            window.kakao.maps.load(createMap);
          } else {
            createMap();
          }
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, [selectedStationId]);

  return (
    <div className="map-container">
      {/* Floating Compass Button top right */}
      <button 
        className="floating-compass" 
        onClick={() => alert(`🧭 ${currentCoords.river} 방향 북위 35° / 동경 129°`)}
        title="방위각 보기"
      >
        <Compass size={22} />
      </button>

      {/* Kakao Map Canvas */}
      <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }}></div>

      {/* Floating Target Location Button bottom right */}
      <button 
        className="floating-target" 
        onClick={() => alert(`📍 내 위치: ${currentCoords.river} ${currentCoords.station} 근처입니다.`)}
        title="내 위치 찾기"
      >
        <Crosshair size={24} />
      </button>
    </div>
  );
}
