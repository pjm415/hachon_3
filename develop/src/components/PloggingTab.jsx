import React, { useState } from 'react';
import { Award, Users, Calendar, MapPin, CheckCircle, Sparkles, Trophy, Camera } from 'lucide-react';
import { ploggingEvent } from '../mockData';

export default function PloggingTab({ onRegisterPlogging, isRegistered }) {
  const [registered, setRegistered] = useState(isRegistered || false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const handleRegister = () => {
    setRegistered(true);
    if (onRegisterPlogging) onRegisterPlogging();
  };

  return (
    <div className="plogging-tab" style={{ padding: '20px 16px' }}>
      {/* Event Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: '24px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.15 }}>
          <Trophy size={160} color="white" />
        </div>

        <span className="badge badge-warning" style={{ marginBottom: '12px' }}>
          <Sparkles size={12} /> 매월 정기 ESG 줍깅 행사
        </span>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.3 }}>
          {ploggingEvent.title}
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '16px' }}>
          주최: {ploggingEvent.host}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '0.82rem', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
            <Calendar size={16} color="#f59e0b" /> {ploggingEvent.date}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
            <MapPin size={16} color="#f59e0b" /> {ploggingEvent.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
            <Users size={16} color="#f59e0b" /> 신청 인원: <b>{ploggingEvent.participantsCount + (registered ? 1 : 0)} / {ploggingEvent.maxParticipants}명</b>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ width: `${((ploggingEvent.participantsCount + (registered ? 1 : 0)) / ploggingEvent.maxParticipants) * 100}%`, height: '100%', background: '#f59e0b' }}></div>
        </div>

        {!registered ? (
          <button className="btn-primary" onClick={handleRegister} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' }}>
            <Sparkles size={18} /> 줍깅 챌린지 참가 신청하기 (동백전 +3,000원)
          </button>
        ) : (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', padding: '12px', borderRadius: '12px', textAlign: 'center', color: '#34d399', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle size={20} /> 참가 신청 완료! (행사 당일 줍깅 키트 증정)
          </div>
        )}
      </div>

      {/* Plogging Certification Module */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px' }}>
          📸 현장 줍깅 & 수질 인증샷 올리기
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginBottom: '16px' }}>
          하천에서 쓰레기를 주운 사진을 인증하면 챌린지 배지를 받습니다.
        </p>

        {!photoUploaded ? (
          <div 
            onClick={() => setPhotoUploaded(true)}
            style={{
              border: '2px dashed var(--gray-300)',
              borderRadius: '16px',
              padding: '30px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'var(--gray-50)'
            }}
          >
            <Camera size={36} color="var(--gray-500)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--gray-700)' }}>
              줍깅 사진 촬영하기 (Before / After)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '4px' }}>
              터치하여 샘플 줍깅 사진을 인증하세요
            </div>
          </div>
        ) : (
          <div style={{ background: '#d1fae5', padding: '16px', borderRadius: '16px', border: '1px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#065f46', fontWeight: 800, marginBottom: '8px' }}>
              <CheckCircle size={20} /> 줍깅 인증 사진 제출 완료!
            </div>
            <div style={{ fontSize: '0.8rem', color: '#047857' }}>
              '8월의 하천 수호자' 배지가 획득되었습니다. (동백전 +3,000원 지급)
            </div>
          </div>
        )}
      </div>

      {/* Badge Collection Section */}
      <div className="card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px' }}>
          🏆 나의 줍깅 수호자 배지함
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
          <div style={{ background: registered || photoUploaded ? '#ecfdf5' : 'var(--gray-100)', padding: '12px 8px', borderRadius: '16px', border: registered || photoUploaded ? '1px solid #10b981' : 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🎖️</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: registered || photoUploaded ? 'var(--primary)' : 'var(--gray-500)' }}>8월 수호자</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--gray-500)' }}>{registered ? '획득 완료' : '미획득'}</div>
          </div>
          <div style={{ background: 'var(--gray-100)', padding: '12px 8px', borderRadius: '16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px', opacity: 0.4 }}>🧹</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gray-500)' }}>플로깅 마스터</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--gray-500)' }}>3회 완주시</div>
          </div>
          <div style={{ background: 'var(--gray-100)', padding: '12px 8px', borderRadius: '16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px', opacity: 0.4 }}>🔬</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gray-500)' }}>수질 감시단</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--gray-500)' }}>10회 측정시</div>
          </div>
        </div>
      </div>
    </div>
  );
}
