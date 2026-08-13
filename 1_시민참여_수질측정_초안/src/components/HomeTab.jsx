import React, { useState, useEffect, useRef } from 'react';
import { Droplet, Award, Zap, ChevronRight, ShieldCheck, Activity, Thermometer, Gauge, TestTube, MapPin } from 'lucide-react';
import { BUSAN_RIVER_STATIONS, getStationWaterData } from '../api/waterQualityApi';

const STATION_COORDS = {
  '2014A65': { lat: 35.1970, lng: 129.0835, name: '온천천 세병교' },
  '2014A70': { lat: 35.1432, lng: 129.0625, name: '동천 범일교' },
  '2014A85': { lat: 35.0985, lng: 128.9680, name: '괴정천 하굿둑' },
  '2014IMHA': { lat: 35.1634, lng: 129.1623, name: '임하천 동백교' }
};

export default function HomeTab({ pins, onNavigateTab, totalEarned }) {
  const [selectedStationId, setSelectedStationId] = useState('2014A65'); // Default: 온천천
  const realtimeData = getStationWaterData(selectedStationId);
  const { metrics, bodTrend24h } = realtimeData;
  const mapContainerRef = useRef(null);

  // Kakao Map initialization & marker update per official React/SPA guide
  useEffect(() => {
    const coords = STATION_COORDS[selectedStationId] || STATION_COORDS['2014A65'];

    const renderMap = () => {
      if (!mapContainerRef.current) return;
      if (!window.kakao || !window.kakao.maps) return;

      window.kakao.maps.load(() => {
        if (!mapContainerRef.current) return;
        const container = mapContainerRef.current;
        container.innerHTML = ''; // clear

        const options = {
          center: new window.kakao.maps.LatLng(coords.lat, coords.lng),
          level: 4
        };

        const map = new window.kakao.maps.Map(container, options);
        const markerPosition = new window.kakao.maps.LatLng(coords.lat, coords.lng);

        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:4px 8px;font-size:12px;font-weight:bold;color:#0284c7;">📍 ${coords.name}</div>`
        });
        infowindow.open(map, marker);
      });
    };

    if (window.kakao && window.kakao.maps) {
      renderMap();
    } else {
      const timer = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(timer);
          renderMap();
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, [selectedStationId]);

  return (
    <div className="home-tab" style={{ padding: '16px' }}>
      {/* Station Selector Buttons */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '4px' }}>
        {BUSAN_RIVER_STATIONS.map((st) => (
          <button
            key={st.id}
            onClick={() => setSelectedStationId(st.id)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: selectedStationId === st.id ? 'none' : '1px solid var(--gray-300)',
              background: selectedStationId === st.id ? 'var(--primary)' : 'white',
              color: selectedStationId === st.id ? 'white' : 'var(--gray-700)',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {st.river}
          </button>
        ))}
      </div>

      {/* Real Kakao Map Canvas Container */}
      <div style={{
        position: 'relative',
        height: '190px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--gray-200)',
        marginBottom: '14px',
        background: '#f1f5f9'
      }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }}></div>
      </div>

      {/* 1. Main River Status Banner */}
      <div className="card" style={{
        background: selectedStationId === '2014A70' || selectedStationId === '2014A85'
          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '20px',
        border: 'none',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} /> {realtimeData.stationName}
          </span>
          <span style={{ fontSize: '0.72rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ShieldCheck size={12} /> 공공데이터포털 연동
          </span>
        </div>

        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>통합 수질 지표 평가</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, margin: '2px 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Droplet size={28} /> {metrics.grade.value}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <span>내 동백전 환급 적립금:</span>
          <b>{(14500 + totalEarned).toLocaleString()}원</b>
        </div>
      </div>

      {/* 2. Detailed Realtime Metrics (BOD, DO, pH, TDS, 수온) */}
      <div className="card" style={{ marginBottom: '14px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--gray-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} color="var(--primary)" /> {realtimeData.river} 실시간 측정 지표
          </h4>
          <span style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>국립환경과학원 API</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <div style={{ background: 'var(--gray-50)', padding: '10px 8px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
              <TestTube size={10} color="var(--primary)" /> BOD (생화학)
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gray-900)', marginTop: '2px' }}>{metrics.bod.value}</div>
          </div>
          <div style={{ background: 'var(--gray-50)', padding: '10px 8px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
              <Gauge size={10} color="var(--blue)" /> DO (용존산소)
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gray-900)', marginTop: '2px' }}>{metrics.do.value}</div>
          </div>
          <div style={{ background: 'var(--gray-50)', padding: '10px 8px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--gray-500)' }}>pH (산도)</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gray-900)', marginTop: '2px' }}>{metrics.ph.value}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ background: 'var(--gray-50)', padding: '10px 12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>TDS (총용존고형물)</span>
            <b style={{ fontSize: '0.9rem' }}>{metrics.tds.value}</b>
          </div>
          <div style={{ background: 'var(--gray-50)', padding: '10px 12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Thermometer size={12} color="#ef4444" /> 수온
            </span>
            <b style={{ fontSize: '0.9rem' }}>{metrics.waterTemp.value}</b>
          </div>
        </div>
      </div>

      {/* 3. Recent 24-Hour BOD Trend Graph */}
      <div className="card" style={{ marginBottom: '14px', padding: '16px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '10px', color: 'var(--gray-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={16} color="var(--blue)" /> {realtimeData.river} 24시간 BOD 변화 추이
        </h4>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '90px', padding: '10px 4px 0', borderBottom: '1px solid var(--gray-200)' }}>
          {bodTrend24h.map((item, idx) => {
            const heightPercent = Math.min(100, (item.bod / 5.0) * 100);
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
                  {item.bod}
                </span>
                <div style={{
                  width: '18px',
                  height: `${Math.max(15, heightPercent)}%`,
                  background: item.bod > 3.0 ? 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s'
                }}></div>
                <span style={{ fontSize: '0.65rem', color: 'var(--gray-500)', marginTop: '6px' }}>
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Primary Action Button */}
      <button 
        className="btn-primary"
        onClick={() => onNavigateTab('measure')}
        style={{ height: '52px', fontSize: '0.98rem', marginBottom: '14px' }}
      >
        <Zap size={18} /> 지금 수질 측정하고 1,000원 받기
      </button>

      {/* 5. Single Event Banner */}
      <div 
        className="card"
        onClick={() => onNavigateTab('plogging')}
        style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          border: '1px solid #fde047',
          background: '#fefce8',
          marginBottom: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#f59e0b', color: 'white', padding: '8px', borderRadius: '12px' }}>
            <Award size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#b45309' }}>D-9 정기 행사</span>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#78350f' }}>이태엽과 함께하는 줍깅 챌린지</div>
          </div>
        </div>
        <ChevronRight size={18} color="#b45309" />
      </div>
    </div>
  );
}
