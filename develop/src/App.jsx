import React, { useState, useEffect } from 'react';
import HomeTab from './components/HomeTab';
import { BUSAN_RIVER_STATIONS } from './api/waterQualityApi';
import { Bell, Camera, Pause, Footprints, Sparkles, X, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import './index.css';

const INITIAL_RECORDS = [
  { id: 1, riverId: '2014A65', riverName: '온천천', type: 'positive', tag: '맑은 물 관찰', text: '세병교 하부 송사리 떼 관찰됨, 악취 없음', author: '최수조 (주민)', time: '10분 전', photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80' },
  { id: 2, riverId: '2014A70', riverName: '동천', type: 'negative', tag: '오염 제보', text: '동천 범일교 하구 약간의 유류 띠 발견됨', author: '최진아 (시민기자)', time: '25분 전', photo: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=400&q=80' },
  { id: 3, riverId: '2014A85', riverName: '괴정천', type: 'positive', tag: '수질 측정', text: 'DO 용존산소 9.2mg/L로 매우 우수 평가', author: '기점수 (측정단)', time: '40분 전', photo: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80' },
];

export default function App() {
  const [selectedStationId, setSelectedStationId] = useState('2014A65'); // Default: 온천천
  const [isWalking, setIsWalking] = useState(false); // 산책 중 화면 토글
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [walkSteps, setWalkSteps] = useState(77);
  const [records, setRecords] = useState(INITIAL_RECORDS);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('positive'); // 'positive' or 'negative'
  const [uploadTag, setUploadTag] = useState('맑은 물 관찰');
  const [uploadComment, setUploadComment] = useState('');
  const [uploadPhoto, setUploadPhoto] = useState('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80');
  const [toastMessage, setToastMessage] = useState(null);

  // Current River station details
  const currentStation = BUSAN_RIVER_STATIONS.find(s => s.id === selectedStationId) || BUSAN_RIVER_STATIONS[0];

  // Live Timer & Step counter when walking
  useEffect(() => {
    let interval = null;
    if (isWalking) {
      interval = setInterval(() => {
        setWalkSeconds(prev => prev + 1);
        setWalkSteps(prev => prev + Math.floor(Math.random() * 2) + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isWalking]);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Upload submit handler
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const newRecord = {
      id: Date.now(),
      riverId: selectedStationId,
      riverName: currentStation.river,
      type: uploadType,
      tag: uploadTag || (uploadType === 'positive' ? '맑은 물 관찰' : '오염 제보'),
      text: uploadComment || (uploadType === 'positive' ? '하천 환경이 매우 깨끗하고 쾌적합니다.' : '하천 수질 오염 및 수질 이상이 발견되었습니다.'),
      author: '시민 (나)',
      time: '방금 전',
      photo: uploadPhoto
    };

    setRecords([newRecord, ...records]);
    setShowUploadModal(false);
    setUploadComment('');
    showNotification(`🎉 [${currentStation.river}] ${uploadType === 'positive' ? '긍정' : '부정'} 기록 업로드 완료! 동백전 +1,000원 적립`);
  };

  return (
    <div className="stage">
      <div className="app-shell">
        {/* Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'absolute',
            top: '64px',
            left: '16px',
            right: '16px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '16px',
            boxShadow: '0 10px 20px rgba(16, 185, 129, 0.4)',
            zIndex: 150,
            fontWeight: 700,
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={18} />
            {toastMessage}
          </div>
        )}

        {/* 1. Header Bar matching Figma Frame 3 */}
        <header className="topbar">
          <div className="brand">
            <span className="brand-name">리버로그</span>
            <span className="brand-badge">시민 리버 피드</span>
          </div>
          <button 
            className="icon-btn" 
            type="button" 
            aria-label="알림"
            onClick={() => showNotification("🔔 수질 모니터링 알림이 정상 작동 중입니다.")}
          >
            <Bell size={20} />
          </button>
        </header>

        {/* 2. Sub-header / River Filter Tabs matching Figma Frame 3 */}
        <div className="river-tabs">
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

        {/* 3. Center Main View: Full Kakao Map */}
        <HomeTab 
          selectedStationId={selectedStationId} 
          setSelectedStationId={setSelectedStationId}
          records={records}
        />

        {/* 4. Bottom Nav Bar matching Figma Frame 3 */}
        <nav className="bottom-nav-figma">
          <button 
            className="center-walk-btn-figma"
            onClick={() => {
              setIsWalking(true);
              setWalkSeconds(0);
              setWalkSteps(77);
            }}
          >
            <Footprints size={24} />
            <span>산책하기</span>
          </button>
        </nav>

        {/* 5. Figma "산책중 화면" Screen Modal */}
        {isWalking && (
          <div className="walking-screen">
            {/* Top Timer */}
            <div className="walking-timer">
              {formatTimer(walkSeconds)}
            </div>

            {/* Center Content matching Figma */}
            <div className="walking-center-content">
              <div className="walking-river-title">
                {currentStation.river} 산책 중...
              </div>
              <div className="walking-step-count">
                {walkSteps}보
              </div>
              <Footprints className="walking-footprint-icon" size={72} />
            </div>

            {/* Bottom Actions matching Figma */}
            <div className="walking-bottom-actions">
              {/* Upload Button */}
              <button 
                className="walking-action-btn"
                onClick={() => setShowUploadModal(true)}
              >
                <div className="walking-action-circle">
                  <Camera size={22} />
                </div>
                <span>업로드</span>
              </button>

              {/* Pause / Finish Walking Button */}
              <button 
                className="walking-action-btn"
                onClick={() => {
                  setIsWalking(false);
                  showNotification(`🏅 ${currentStation.river} 산책 완료! 총 ${walkSteps}보 달성 (동백전 +1,000원 적립)`);
                }}
              >
                <div className="walking-action-circle">
                  <Pause size={22} />
                </div>
                <span>산책 완료</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. Upload Modal ("업로드" 팝업: 긍정기록/부정기록) */}
        {showUploadModal && (
          <div className="upload-modal-backdrop" onClick={() => setShowUploadModal(false)}>
            <div className="upload-modal" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                  📸 [{currentStation.river}] 산책 기록 업로드
                </h3>
                <button 
                  style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800 }}
                  onClick={() => setShowUploadModal(false)}
                >
                  ✕
                </button>
              </div>

              {/* Positive / Negative Toggle */}
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                기록 유형 선택
              </div>
              <div className="type-toggle-container">
                <button
                  type="button"
                  className={`type-btn positive ${uploadType === 'positive' ? 'is-selected' : ''}`}
                  onClick={() => {
                    setUploadType('positive');
                    setUploadTag('맑은 물 관찰');
                  }}
                >
                  <CheckCircle size={18} color="#10b981" /> 긍정 기록
                </button>
                <button
                  type="button"
                  className={`type-btn negative ${uploadType === 'negative' ? 'is-selected' : ''}`}
                  onClick={() => {
                    setUploadType('negative');
                    setUploadTag('오염 제보');
                  }}
                >
                  <AlertTriangle size={18} color="#ef4444" /> 부정 기록
                </button>
              </div>

              {/* Tag / Status Select */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  태그 주제
                </label>
                <select
                  value={uploadTag}
                  onChange={e => setUploadTag(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.9rem' }}
                >
                  {uploadType === 'positive' ? (
                    <>
                      <option value="맑은 물 관찰">🟢 맑은 물 관찰</option>
                      <option value="생물 관찰">🟢 물고기/새 등 생물 관찰</option>
                      <option value="청결한 산책로">🟢 깨끗한 산책로 환경</option>
                    </>
                  ) : (
                    <>
                      <option value="오염 제보">🔴 하천 오염 제보</option>
                      <option value="악취 발생">🔴 악취 심함</option>
                      <option value="거품/유류 띠">🔴 거품 및 유류 띠 발견</option>
                      <option value="쓰레기 방치">🔴 쓰레기 무단 투기</option>
                    </>
                  )}
                </select>
              </div>

              {/* Photo Preview & Upload */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  사진 등록
                </label>
                <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '14px', overflow: 'hidden', background: '#f1f5f9', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={uploadPhoto} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => {
                      const samplePhotos = [
                        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
                        'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=400&q=80',
                        'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80'
                      ];
                      const nextIndex = (samplePhotos.indexOf(uploadPhoto) + 1) % samplePhotos.length;
                      setUploadPhoto(samplePhotos[nextIndex]);
                    }}
                    style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ImageIcon size={14} /> 사진 변경
                  </button>
                </div>
              </div>

              {/* Comment Input */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  한줄 기록 내용
                </label>
                <textarea
                  rows={3}
                  value={uploadComment}
                  onChange={e => setUploadComment(e.target.value)}
                  placeholder={uploadType === 'positive' ? '예: 세병교 하부 송사리 떼 관찰됨, 물이 맑고 악취 없음' : '예: 동천 범일교 하구 약간의 유류 띠 발견됨'}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.88rem', resize: 'none' }}
                />
              </div>

              {/* Submit Button */}
              <button 
                type="button"
                className="btn-submit"
                onClick={handleUploadSubmit}
              >
                제보 등록 완료 (동백전 +1,000원)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
