import React, { useState } from 'react';
import { Droplet, Award, Zap, ChevronRight, ShieldCheck, Activity, Thermometer, Gauge, TestTube } from 'lucide-react';
import { getSimulatedRealtimeWaterData } from '../api/waterQualityApi';

export default function HomeTab({ pins, onNavigateTab, totalEarned }) {
  const [realtimeData] = useState(getSimulatedRealtimeWaterData());
  const { metrics, bodTrend24h } = realtimeData;

  return (
    <div className="home-tab" style={{ padding: '16px' }}>
      {/* 1. Main River Status Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '20px',
        border: 'none',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
            📍 {realtimeData.stationName}
          </span>
          <span style={{ fontSize: '0.72rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ShieldCheck size={12} /> 공공 API 데이터 검증
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
            <Activity size={16} color="var(--primary)" /> 실시간 주요 수질 측정 지표
          </h4>
          <span style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>공공데이터포털 연동</span>
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
          <Activity size={16} color="var(--blue)" /> 최근 24시간 BOD 변화량 추이
        </h4>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '90px', padding: '10px 4px 0', borderBottom: '1px solid var(--gray-200)' }}>
          {bodTrend24h.map((item, idx) => {
            const heightPercent = (item.bod / 2.5) * 100;
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
                  {item.bod}
                </span>
                <div style={{
                  width: '18px',
                  height: `${heightPercent}%`,
                  background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
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
