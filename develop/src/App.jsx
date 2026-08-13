import React, { useState } from 'react';
import HomeTab from './components/HomeTab';
import MeasureTab from './components/MeasureTab';
import PloggingTab from './components/PloggingTab';
import MerchantTab from './components/MerchantTab';
import WalletTab from './components/WalletTab';
import { BUSAN_RIVER_STATIONS } from './api/waterQualityApi';
import { Bell, Droplet, Sparkles, X, Footprints } from 'lucide-react';
import './index.css';

export default function App() {
  const [selectedStationId, setSelectedStationId] = useState('2014A65'); // Default: 온천천
  const [activeOverlay, setActiveOverlay] = useState(null); // null, 'news', 'merchant', 'kit', 'mypage', 'walk'
  const [toastMessage, setToastMessage] = useState(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const [historyItems, setHistoryItems] = useState([]);
  const [isPloggingRegistered, setIsPloggingRegistered] = useState(false);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddMeasurement = (newMeasure) => {
    setTotalEarned(prev => prev + 1000);
    setHistoryItems(prev => [
      {
        id: Date.now(),
        title: "수질 측정 캐시백",
        date: "방금 전",
        amount: 1000,
        type: "earn",
        detail: `${newMeasure.locationName} AI 검증 완료`
      },
      ...prev
    ]);
    showNotification("🎉 수질 측정 완료! 동백전 +1,000원 캐시백 적립");
    setActiveOverlay(null);
  };

  const handleRegisterPlogging = () => {
    setIsPloggingRegistered(true);
    setTotalEarned(prev => prev + 3000);
    setHistoryItems(prev => [
      {
        id: Date.now(),
        title: "8월 줍깅 챌린지 신청 리워드",
        date: "방금 전",
        amount: 3000,
        type: "earn",
        detail: "이태엽과 함께하는 줍깅 챌린지"
      },
      ...prev
    ]);
    showNotification("🏅 줍깅 챌린지 신청 완료! 동백전 +3,000원 적립");
    setActiveOverlay(null);
  };

  const handleEarnCoupon = (merchant) => {
    showNotification(`☕ ${merchant?.name || '지정업소'} 아메리카노 1,000원 쿠폰 지급!`);
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
            zIndex: 70,
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

        {/* 1. Header Bar matching image */}
        <header className="topbar">
          <div className="brand">
            <Droplet className="brand-icon" size={24} />
            <span className="brand-name">리버로그</span>
            <span className="brand-badge">시민 리버 피드</span>
          </div>
          <button 
            className="icon-btn" 
            type="button" 
            aria-label="알림"
            onClick={() => showNotification("🔔 수질 측정소 데이터가 업데이트 되었습니다.")}
          >
            <Bell size={20} />
          </button>
        </header>

        {/* 2. Sub-header / River Filter Tabs matching image */}
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
          onOpenOverlay={setActiveOverlay}
        />

        {/* 4. Bottom Nav Bar matching image (Blue with Yellow Buttons & Center Circle) */}
        <nav className="bottom-nav">
          <button 
            className="nav-yellow-btn"
            onClick={() => setActiveOverlay('news')}
          >
            소식창
          </button>

          <button 
            className="nav-yellow-btn"
            onClick={() => setActiveOverlay('merchant')}
          >
            대여 상권<br />혜택 모아보기
          </button>

          <div className="nav-center-wrapper">
            <button 
              className="center-walk-btn"
              onClick={() => {
                showNotification("🚶 산책하기 모드 시작! 수질 감시 걸음 수가 기록됩니다.");
                setActiveOverlay('walk');
              }}
            >
              산책하기
            </button>
          </div>

          <button 
            className="nav-yellow-btn"
            onClick={() => setActiveOverlay('kit')}
          >
            키트
          </button>

          <button 
            className="nav-yellow-btn"
            onClick={() => setActiveOverlay('mypage')}
          >
            마이페이지
          </button>
        </nav>

        {/* Modal Overlays for Sub-features */}
        {activeOverlay && (
          <div className="overlay-panel">
            <div className="overlay-header">
              <span className="overlay-title">
                {activeOverlay === 'news' && '📰 리버로그 소식창'}
                {activeOverlay === 'merchant' && '🛍️ 대여 / 상권 혜택 모아보기'}
                {activeOverlay === 'kit' && '🧪 수질 측정 키트'}
                {activeOverlay === 'mypage' && '👤 마이페이지 & 동백전 지갑'}
                {activeOverlay === 'walk' && '🚶 하천 산책 모드'}
              </span>
              <button className="close-btn" onClick={() => setActiveOverlay(null)}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {activeOverlay === 'news' && (
                <PloggingTab 
                  onRegisterPlogging={handleRegisterPlogging}
                  isRegistered={isPloggingRegistered}
                />
              )}

              {activeOverlay === 'merchant' && (
                <MerchantTab 
                  onEarnCoupon={handleEarnCoupon}
                />
              )}

              {activeOverlay === 'kit' && (
                <MeasureTab 
                  onAddMeasurement={handleAddMeasurement}
                />
              )}

              {activeOverlay === 'mypage' && (
                <WalletTab 
                  totalEarned={totalEarned}
                  historyItems={historyItems}
                />
              )}

              {activeOverlay === 'walk' && (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <Footprints size={64} color="#2563eb" style={{ margin: '20px 0' }} />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>하천 산책 및 실시간 모니터링 중</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                    부산 하천 변을 걸으며 악취나 수질 오염을 발견하면 [키트] 메뉴에서 즉시 사진을 찍어 제보할 수 있습니다.
                  </p>
                  <button className="btn-primary" onClick={() => setActiveOverlay('kit')}>
                    📷 수질 제보 / 키트 측정하기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
