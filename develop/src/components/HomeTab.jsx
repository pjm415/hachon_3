import React, { useState, useEffect, useRef } from 'react';
import { Compass, Crosshair } from 'lucide-react';
import { BUSAN_RIVER_STATIONS } from '../api/waterQualityApi';

// 부산 주요 하천 정밀 GPS 좌표 매핑
// 괴정천 하굿둑: 괴정천 파란색 물길 수로 좌표 (35.1050, 128.9604)
const STATION_COORDS = {
  '2014A65': { lat: 35.1970, lng: 129.0835, river: '온천천', station: '세병교 지점' },
  '2014A70': { lat: 35.1432, lng: 129.0625, river: '동천', station: '범일교 지점' },
  '2014A85': { lat: 35.1050, lng: 128.9604, river: '괴정천', station: '하굿둑' }
};

export default function HomeTab({ selectedStationId, setSelectedStationId, records, onSelectPhotoPin }) {
  const mapRef = useRef(null);
  const currentCoords = STATION_COORDS[selectedStationId] || STATION_COORDS['2014A65'];

  // 줍깅(플로깅) 청년위원회 참여 모집 배너 상태 관리 (기본 노출)
  const [showJubgingBanner, setShowJubgingBanner] = useState(true);

  const handleCloseToday = (e) => {
    e.stopPropagation();
    setShowJubgingBanner(false);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setShowJubgingBanner(false);
  };

  const handleBannerClick = () => {
    window.open('https://heureun-youth-committee.vercel.app/#apply', '_blank');
  };

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

        // Add Main Station InfoWindow
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
    <div className="map-container" style={{ position: 'relative' }}>
      {/* 줍깅(플로깅) 청년위원회 참여 모집 배너 (사용자 제공 스크린샷 100% 일치 디자인) */}
      {showJubgingBanner && (
        <div 
          onClick={handleBannerClick}
          style={{
            position: 'absolute',
            top: '12px',
            left: '16px',
            right: '16px',
            zIndex: 120,
            background: 'linear-gradient(135deg, #1665ff 0%, #0d55e8 100%)',
            color: 'white',
            borderRadius: '22px',
            padding: '18px 20px',
            boxShadow: '0 12px 28px rgba(22, 101, 255, 0.35)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                청년위원회에서 함께할 청년을 찾습니다
              </h4>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'rgba(255,255,255,0.92)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                지금 바로 지원하기 →
              </div>
            </div>

            <button
              onClick={handleClose}
              style={{
                background: 'rgba(255, 255, 255, 0.22)',
                border: 'none',
                color: 'white',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                marginLeft: '10px',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
              title="닫기"
            >
              ✕
            </button>
          </div>

          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <span
              onClick={handleCloseToday}
              style={{
                fontSize: '0.74rem',
                color: 'rgba(255, 255, 255, 0.85)',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              오늘 하루 보지 않기
            </span>
          </div>
        </div>
      )}

      {/* Floating Compass */}
      <button 
        className="floating-compass" 
        onClick={() => alert(`🧭 ${currentCoords.river} 방향 북위 35° / 동경 128°`)}
        title="방위각 보기"
        style={{ top: showJubgingBanner ? '160px' : '16px' }}
      >
        <Compass size={22} />
      </button>

      {/* Kakao Map Canvas */}
      <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }}></div>

      {/* Floating Target Location */}
      <button 
        className="floating-target" 
        onClick={() => alert(`📍 내 위치: ${currentCoords.river} ${currentCoords.station} (부산 사하구 강변대로 괴정천 물길)`)}
        title="내 위치 찾기"
      >
        <Crosshair size={24} />
      </button>
    </div>
  );
}
