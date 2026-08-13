import React, { useState } from 'react';
import HomeTab from './components/HomeTab';
import MeasureTab from './components/MeasureTab';
import PloggingTab from './components/PloggingTab';
import MerchantTab from './components/MerchantTab';
import WalletTab from './components/WalletTab';
import { initialWaterPins } from './mockData';
import { Map, Camera, Award, Store, Wallet, Bell, Sparkles, Droplets } from 'lucide-react';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
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
        title: "임하천 수질 측정 캐시백",
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
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '16px',
          right: '16px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '16px',
          boxShadow: '0 10px 20px rgba(16, 185, 129, 0.4)',
          zIndex: 60,
          fontWeight: 700,
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'pulseGlow 1.5s infinite ease-in-out'
        }}>
          <Sparkles size={18} />
          {toastMessage}
        </div>
      )}

      {/* Top Header Bar */}
      <header className="top-bar">
        <div className="brand-logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <Droplets size={24} color="#059669" />
          <span>클린임하</span>
          <span className="brand-badge">동백전 연동</span>
        </div>
        <div className="top-bar-actions">
          <button className="icon-btn" title="알림">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="app-content">
        {activeTab === 'home' && (
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

        {activeTab === 'merchant' && (
          <MerchantTab 
            onEarnCoupon={handleEarnCoupon}
          />
        )}

        {activeTab === 'wallet' && (
          <WalletTab 
            totalEarned={totalEarned}
            historyItems={historyItems}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Map size={22} />
          <span>수질지도</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'plogging' ? 'active' : ''}`}
          onClick={() => setActiveTab('plogging')}
        >
          <Award size={22} />
          <span>줍깅행사</span>
        </button>

        <button 
          className={`nav-item measure-btn ${activeTab === 'measure' ? 'active' : ''}`}
          onClick={() => setActiveTab('measure')}
        >
          <div className="btn-circle">
            <Camera size={26} />
          </div>
          <span style={{ marginTop: '2px' }}>수질측정</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'merchant' ? 'active' : ''}`}
          onClick={() => setActiveTab('merchant')}
        >
          <Store size={22} />
          <span>대여/상권</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          <Wallet size={22} />
          <span>동백전</span>
        </button>
      </nav>
    </div>
  );
}
