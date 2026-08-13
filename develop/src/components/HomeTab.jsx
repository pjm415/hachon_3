import React, { useState, useEffect, useRef } from 'react';
import { Compass, Crosshair } from 'lucide-react';
import { BUSAN_RIVER_STATIONS } from '../api/waterQualityApi';

const STATION_COORDS = {
  '2014A65': { lat: 35.1970, lng: 129.0835, river: '온천천', station: '세병교 지점' },
  '2014A70': { lat: 35.1432, lng: 129.0625, river: '동천', station: '범일교 지점' },
  '2014A85': { lat: 35.0985, lng: 128.9680, river: '괴정천', station: '하굿둑 지점' }
};

export default function HomeTab({ selectedStationId, setSelectedStationId, records }) {
  const mapRef = useRef(null);
  const currentCoords = STATION_COORDS[selectedStationId] || STATION_COORDS['2014A65'];

  // Kakao Map Autoload implementation
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

        // Add Main Station Marker
        const markerPosition = new window.kakao.maps.LatLng(coords.lat, coords.lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);

        // Add Main InfoWindow
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:6px 12px;font-size:12px;font-weight:700;color:#1677ff;border-radius:8px;">📍 ${coords.river} ${coords.station}</div>`
        });
        infowindow.open(map, marker);

        // Add User Uploaded Record Pinned Markers on Map
        if (records && records.length > 0) {
          records.forEach((rec, idx) => {
            if (rec.riverId === selectedStationId) {
              const offsetLat = coords.lat + (idx * 0.0008 - 0.0004);
              const offsetLng = coords.lng + (idx * 0.0008 - 0.0004);
              const recPos = new window.kakao.maps.LatLng(offsetLat, offsetLng);

              const recMarker = new window.kakao.maps.Marker({
                position: recPos
              });
              recMarker.setMap(map);

              const color = rec.type === 'positive' ? '#10b981' : '#ef4444';
              const recWindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:4px 8px;font-size:11px;font-weight:700;color:${color};">
                  ${rec.type === 'positive' ? '🟢 긍정' : '🔴 부정'}: ${rec.tag}
                </div>`
              });
              recWindow.open(map, recMarker);
            }
          });
        }
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
  }, [selectedStationId, records]);

  return (
    <div className="map-container">
      {/* Floating Compass */}
      <button 
        className="floating-compass" 
        onClick={() => alert(`🧭 ${currentCoords.river} 방향 북위 35° / 동경 129°`)}
        title="방위각 보기"
      >
        <Compass size={22} />
      </button>

      {/* Kakao Map Canvas */}
      <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }}></div>

      {/* Floating Target Location */}
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
