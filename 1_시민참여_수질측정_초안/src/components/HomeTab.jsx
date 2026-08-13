import React from 'react';
import { Droplet, Award, Zap, ChevronRight, ShieldCheck } from 'lucide-react';

export default function HomeTab({ pins, onNavigateTab, totalEarned }) {
  return (
    <div className="home-tab" style={{ padding: '16px' }}>
      {/* 1. Main River Status Banner - Ultra Clean */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '20px',
        border: 'none',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
            📍 부산 임하천
          </span>
          <span style={{ fontSize: '0.72rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ShieldCheck size={12} /> 데이터 위변조 방지 적용
          </span>
        </div>

        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>오늘의 수질 상태</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, margin: '2px 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Droplet size={28} /> 1급수 (매우 좋음)
        </div>

        <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <span>내 동백전 적립금:</span>
          <b>{(14500 + totalEarned).toLocaleString()}원</b>
        </div>
      </div>

      {/* 2. Primary Action Button */}
      <button 
        className="btn-primary"
        onClick={() => onNavigateTab('measure')}
        style={{ height: '52px', fontSize: '0.98rem', marginBottom: '14px' }}
      >
        <Zap size={18} /> 지금 수질 측정하고 1,000원 받기
      </button>

      {/* 3. Single Event Banner - Clean & Focused */}
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
          marginBottom: '14px'
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

      {/* 4. Simple Water Status List */}
      <div className="card" style={{ marginBottom: 0 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '10px', color: 'var(--gray-700)' }}>
          최근 시민 측정 현황
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {pins.slice(0, 3).map(pin => (
            <div key={pin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '6px 0', borderBottom: '1px solid var(--gray-100)' }}>
              <div>
                <b style={{ color: 'var(--gray-900)' }}>{pin.locationName.split(' ')[0]} {pin.locationName.split(' ')[1]}</b>
                <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)' }}>{pin.measuredBy} · {pin.measuredAt}</div>
              </div>
              <span className={`badge ${pin.status === 'good' ? 'badge-success' : pin.status === 'warning' ? 'badge-warning' : 'badge-danger'}`}>
                {pin.statusText.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
