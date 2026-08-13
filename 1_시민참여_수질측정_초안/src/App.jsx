import React, { useState } from 'react';
import HomeTab from './components/HomeTab';
import MeasureTab from './components/MeasureTab';
import PloggingTab from './components/PloggingTab';
import MerchantTab from './components/MerchantTab';
import WalletTab from './components/WalletTab';
import { initialWaterPins } from './mockData';
import { Map, Camera, Award, Store, Wallet, Bell, Sparkles, Droplets, Rss, ShieldAlert } from 'lucide-react';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('map'); // Default: 지도
  const [pins, setPins] = useState(initialWaterPins);
  const [totalEarned, setTotalEarned] = useState(0);
  const [historyItems, setHistoryItems] = useState([]);
  const [isPloggingRegistered, setIsPloggingRegistered] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddMeasurement = (newMeasure) => {
    const newPin = {
      id: Date.now(),
      locationName: newMeasure.locationName,
      status: newMeasure.status,
      statusText: newMeasure.statusText,
      bod: newMeasure.bod,
      ph: newMeasure.ph,
      turbidity: newMeasure.turbidity,
      measuredBy: "시민 (나)",
      measuredAt: "방금 전",
      verifiedByBlockchain: true,
      kitType: newMeasure.kitType,
      hash: `0x${Math.random().toString(16).substr(2, 8)}`,
      lat: 42,
      lng: 50,
      comment: "스마트폰 AI 색상 스캔 측정 완료"
    };

    setPins([newPin, ...pins]);
    setTotalEarned(prev => prev + 1000);
    setHistoryItems(prev => [
      {
        id: Date.now(),
        title: "하천 수질 측정 캐시백",
        date: "방금 전",
        amount: 1000,
        type: "earn",
        detail: `${newMeasure.locationName} AI 검증 완료`
      },
      ...prev
    ]);
    showNotification("🎉 수질 측정 완료! 동백전 +1,000원 캐시백 적립");
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
            zIndex: 60,
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

        {/* Top Bar matching ohjiwon/riverlog */}
        <header className="topbar">
          <div className="brand" onClick={() => setActiveTab('map')} style={{ cursor: 'pointer' }}>
            <span className="brand-drop">💧</span>
            <span className="brand-name">리버로그</span>
          </div>
          <button className="icon-btn" type="button" aria-label="알림" onClick={() => showNotification("🔔 온천천/동천 실시간 수질 데이터 정상 수신 중입니다.")}>
            <Bell size={20} />
          </button>
        </header>

        {/* Main View Area */}
        <main className="app-content">
          {(activeTab === 'map' || activeTab === 'feed') && (
            <HomeTab 
              pins={pins} 
              onNavigateTab={setActiveTab}
              totalEarned={totalEarned}
            />
          )}

          {activeTab === 'measure' && (
            <MeasureTab 
              onAddMeasurement={handleAddMeasurement}
            />
          )}

          {activeTab === 'plogging' && (
            <PloggingTab 
              onRegisterPlogging={handleRegisterPlogging}
              isRegistered={isPloggingRegistered}
            />
          )}

          {activeTab === 'wallet' && (
            <WalletTab 
              totalEarned={totalEarned}
              historyItems={historyItems}
            />
          )}

          {activeTab === 'merchant' && (
            <MerchantTab 
              onEarnCoupon={handleEarnCoupon}
            />
          )}
        </main>

        {/* Bottom Navigation matching ohjiwon/riverlog 5-item structure */}
        <nav className="bottom-nav">
          <button 
            className={`nav-item ${activeTab === 'feed' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            <Rss size={20} />
            <span>피드</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'map' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('map')}
          >
            <Map size={20} />
            <span>지도</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'measure' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('measure')}
          >
            <Camera size={20} />
            <span>측정</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'wallet' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            <Wallet size={20} />
            <span>지갑</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'merchant' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('merchant')}
          >
            <ShieldAlert size={20} />
            <span>상황실</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
