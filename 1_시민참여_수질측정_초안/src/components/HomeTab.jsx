import React, { useState, useEffect, useRef } from 'react';
import { Droplet, Award, Zap, ChevronRight, ShieldCheck, Activity, Thermometer, Gauge, TestTube, MapPin, Navigation, Crosshair } from 'lucide-react';
import { BUSAN_RIVER_STATIONS, getStationWaterData } from '../api/waterQualityApi';

const STATION_COORDS = {
  '2014A65': { lat: 35.1970, lng: 129.0835, river: '온천천', station: '세병교 지점' },
  '2014A70': { lat: 35.1432, lng: 129.0625, river: '동천', station: '범일교 지점' },
  '2014A85': { lat: 35.0985, lng: 128.9680, river: '괴정천', station: '하굿둑 지점' },
  '2014IMHA': { lat: 35.1634, lng: 129.1623, river: '임하천', station: '동백교 지점' }
};

const SAMPLE_RECORDS = [
  { id: 1, type: 'positive', tag: '맑은 물 관찰', text: '세병교 하부 송사리 떼 관찰됨, 악취 없음', author: '최수조 (주민)', time: '10분 전', photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80' },
  { id: 2, type: 'negative', tag: '오염 제보', text: '동천 범일교 하구 약간의 유류 띠 발견됨', author: '최진아 (시민기자)', time: '25분 전', photo: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=400&q=80' },
  { id: 3, type: 'positive', tag: '수질 측정', text: 'DO 용존산소 9.2mg/L로 매우 우수 평가', author: '기점수 (측정단)', time: '40분 전', photo: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80' },
  { id: 4, type: 'positive', tag: '줍깅 활동', text: '괴정천 하구 하천 변 플라스틱 쓰레기 5kg 수거', author: '조성하 (봉사단)', time: '1시간 전', photo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80' },
  { id: 5, type: 'negative', tag: '거품 발생', text: '임하천 동백교 상류 미세 흰 거품 관찰', author: '최풍림 (지킴이)', time: '2시간 전', photo: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=400&q=80' },
];

export default function HomeTab({ pins, onNavigateTab, totalEarned }) {
  const [selectedStationId, setSelectedStationId] = useState('2014A65'); // Default: 온천천
  const realtimeData = getStationWaterData(selectedStationId);
  const { metrics, bodTrend24h } = realtimeData;
  const mapRef = useRef(null);
  
  // Sheet modal state
  const [selectedRecord, setSelectedRecord] = useState(null);

  const currentCoords = STATION_COORDS[selectedStationId] || STATION_COORDS['2014A65'];

  // Kakao Official Guide implementation
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
          content: `<div style="padding:4px 8px;font-size:12px;font-weight:bold;color:#1e534c;">📍 ${coords.river} ${coords.station}</div>`
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
    <div className="home-tab">
      {/* 1. River Selection Tabs (River Tabs matching ohjiwon/riverlog) */}
      <div className="river-tabs" id="riverTabs">
        {BUSAN_RIVER_STATIONS.map((st) => (
          <button
            key={st.id}
            onClick={() => setSelectedStationId(st.id)}
            className={`river-tab-btn ${selectedStationId === st.id ? 'is-active' : ''}`}
          >
            {st.river}
          </button>
        ))}
      </div>

      {/* 2. Map View Container matching ohjiwon/riverlog */}
      <div className="map-view">
        {/* River Name Pill */}
        <div className="river-name-pill">
          <strong>{currentCoords.river}</strong>
          <span>{currentCoords.station}</span>
        </div>

        {/* Real Kakao Map Canvas */}
        <div style={{ position: 'relative', width: '100%', height: '240px', background: '#e2e8f0' }}>
          <div id="map" ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
        </div>

        {/* Map Legend */}
        <div className="map-legend">
          <span className="legend-item"><i className="dot tag-positive"></i>긍정 기록</span>
          <span className="legend-item"><i className="dot tag-negative"></i>부정 기록</span>
          <span className="legend-item"><i className="dot dot-me"></i>내 위치</span>
        </div>

        {/* Locate Button */}
        <button className="locate-btn" type="button" aria-label="내 위치 찾기" onClick={() => alert("현재 위치: 부산 수질 측정 지점 근처입니다.")}>
          <Crosshair size={18} />
        </button>
      </div>

      {/* 3. Realtime Water Quality Metrics (Public Water Quality API Preserved) */}
      <div style={{ padding: '16px 16px 0' }}>
        <div className="card" style={{
          background: selectedStationId === '2014A70' || selectedStationId === '2014A85'
            ? 'linear-gradient(135deg, #1e534c 0%, #0f2e2a 100%)'
            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '18px',
          border: 'none',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} /> {realtimeData.stationName}
            </span>
            <span style={{ fontSize: '0.72rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ShieldCheck size={12} /> 공공데이터포털 실시간 연동
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>통합 수질 지표 평가</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 900, margin: '2px 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplet size={26} /> {metrics.grade.value}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span>내 동백전 환급 적립금:</span>
            <b>{(14500 + totalEarned).toLocaleString()}원</b>
          </div>
        </div>

        {/* Metric Grid */}
        <div className="card" style={{ marginBottom: '12px', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={16} color="var(--primary)" /> {realtimeData.river} 실시간 세부 지표
            </h4>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>국립환경과학원</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
            <div style={{ background: 'var(--gray-100)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>BOD (생화학)</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '2px' }}>{metrics.bod.value}</div>
            </div>
            <div style={{ background: 'var(--gray-100)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>DO (용존산소)</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '2px' }}>{metrics.do.value}</div>
            </div>
            <div style={{ background: 'var(--gray-100)', padding: '8px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>pH (산도)</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '2px' }}>{metrics.ph.value}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ background: 'var(--gray-100)', padding: '8px 10px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>TDS (고형물)</span>
              <b>{metrics.tds.value}</b>
            </div>
            <div style={{ background: 'var(--gray-100)', padding: '8px 10px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>수온</span>
              <b>{metrics.waterTemp.value}</b>
            </div>
          </div>
        </div>

        {/* Primary Measurement Button */}
        <button 
          className="btn-primary"
          onClick={() => onNavigateTab('measure')}
          style={{ height: '48px', fontSize: '0.92rem', marginBottom: '12px' }}
        >
          <Zap size={16} /> 지금 수질 측정하고 동백전 받기
        </button>
      </div>

      {/* 4. Preview Dock matching ohjiwon/riverlog */}
      <section className="preview-dock">
        <div className="preview-dock-head">
          <span>주변 사람들의 기록</span>
          <span className="preview-count">8건</span>
        </div>
        <div className="strip">
          {SAMPLE_RECORDS.map((item) => (
            <div 
              key={item.id} 
              className="strip-card"
              onClick={() => setSelectedRecord(item)}
            >
              <span className={`strip-tag ${item.type === 'positive' ? 'tag-positive' : 'tag-negative'}`}>
                {item.tag}
              </span>
              <div className="strip-text">{item.text}</div>
              <div className="strip-author">{item.author} • {item.time}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BottomSheet Modal matching ohjiwon/riverlog */}
      <div 
        className={`sheet-backdrop ${selectedRecord ? 'show' : ''}`}
        onClick={() => setSelectedRecord(null)}
      ></div>
      <div className={`sheet ${selectedRecord ? 'show' : ''}`}>
        <div className="sheet-handle"></div>
        <button className="sheet-close" onClick={() => setSelectedRecord(null)}>✕</button>
        {selectedRecord && (
          <div className="sheet-body">
            <img 
              src={selectedRecord.photo} 
              alt={selectedRecord.tag} 
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '16px', marginBottom: '14px' }} 
            />
            <div className="sheet-info">
              <span className={`sheet-tag ${selectedRecord.type === 'positive' ? 'tag-positive' : 'tag-negative'}`}>
                {selectedRecord.tag}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                {selectedRecord.time}
              </div>
              <p className="sheet-comment">{selectedRecord.text}</p>
              <div className="sheet-author">작성자: {selectedRecord.author}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
