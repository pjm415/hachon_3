import React, { useState, useEffect, useRef } from 'react';
import { Compass, Crosshair } from 'lucide-react';
import { BUSAN_RIVER_STATIONS } from '../api/waterQualityApi';

// 부산 주요 하천 정밀 GPS 좌표 매핑
// 괴정천 (하구 지점): 사용자 캡처 수로 한가운데 괴정천 파란색 물길 정밀 좌표 (35.1064, 128.9648)
const STATION_COORDS = {
  '2014A65': { lat: 35.1970, lng: 129.0835, river: '온천천', station: '세병교 지점' },
  '2014A70': { lat: 35.1432, lng: 129.0625, river: '동천', station: '범일교 지점' },
  '2014A85': { lat: 35.1064, lng: 128.9648, river: '괴정천', station: '하구 지점' }
};

export default function HomeTab({ selectedStationId, setSelectedStationId, records, onSelectPhotoPin }) {
  const mapRef = useRef(null);
  const currentCoords = STATION_COORDS[selectedStationId] || STATION_COORDS['2014A65'];

  // Kakao Map Autoload & CustomOverlay Photo Pins implementation
  useEffect(() => {
    const coords = currentCoords;

    const createMap = () => {
      const container = mapRef.current || document.getElementById('map');
      if (!container) return;

      if (window.kakao && window.kakao.maps) {
        container.innerHTML = '';

        const options = {
          center: new window.kakao.maps.LatLng(coords.lat, coords.lng),
          level: 3
        };

        const map = new window.kakao.maps.Map(container, options);

        // Add Main Station Marker
        const markerPosition = new window.kakao.maps.LatLng(coords.lat, coords.lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);

        // Add Main Station InfoWindow (No apartment name, strictly river name '괴정천')
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:6px 12px;font-size:12px;font-weight:700;color:#1677ff;border-radius:8px;">📍 ${coords.river} ${coords.station}</div>`
        });
        infowindow.open(map, marker);

        // Add CustomOverlay Photo Pins matching user screenshot
        if (records && records.length > 0) {
          records.forEach((rec, idx) => {
            if (rec.riverId === selectedStationId) {
              const lat = coords.lat + ((idx % 3) * 0.0003 - 0.00015);
              const lng = coords.lng + (Math.floor(idx / 3) * 0.0004 - 0.0002);

              const overlayDiv = document.createElement('div');
              overlayDiv.className = 'photo-pin-wrapper';
              overlayDiv.innerHTML = `
                <div class="photo-pin-card ${rec.type}">
                  <img class="photo-pin-img" src="${rec.photo}" alt="${rec.tag}" />
                  <span class="photo-pin-badge ${rec.type === 'negative' ? 'negative-badge' : ''}">${rec.badgeCount || (idx * 5 + 2)}</span>
                </div>
                <div class="photo-pin-tail"></div>
              `;

              overlayDiv.onclick = (e) => {
                e.stopPropagation();
                if (onSelectPhotoPin) {
                  onSelectPhotoPin(rec);
                }
              };

              const customOverlay = new window.kakao.maps.CustomOverlay({
                position: new window.kakao.maps.LatLng(lat, lng),
                content: overlayDiv,
                yAnchor: 1.15
              });
              customOverlay.setMap(map);
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
  }, [selectedStationId, records, onSelectPhotoPin]);

  return (
    <div className="map-container">
      {/* Floating Compass */}
      <button 
        className="floating-compass" 
        onClick={() => alert(`🧭 ${currentCoords.river} 방향 북위 35° / 동경 128°`)}
        title="방위각 보기"
      >
        <Compass size={22} />
      </button>

      {/* Kakao Map Canvas */}
      <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }}></div>

      {/* Floating Target Location */}
      <button 
        className="floating-target" 
        onClick={() => alert(`📍 내 위치: ${currentCoords.river} ${currentCoords.station} (괴정천 파란색 물길 수로)`)}
        title="내 위치 찾기"
      >
        <Crosshair size={24} />
      </button>
    </div>
  );
}
