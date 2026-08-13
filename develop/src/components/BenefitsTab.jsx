import React, { useState } from 'react';
import { Wallet, Ticket, MapPin, Sparkles, ArrowRightLeft, CheckCircle2, QrCode, Store, ChevronRight, Gift } from 'lucide-react';

export default function BenefitsTab({ onShowToast }) {
  const [subTab, setSubTab] = useState('wallet'); // 'wallet', 'coupons', 'map'
  const [balance, setBalance] = useState(4000);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(null);

  // Earning history list
  const [historyList, setHistoryList] = useState([
    { id: 1, title: '온천천 시민 수질 측정 검증', date: '오늘 12:45', amount: '+1,000원', river: '온천천', icon: '🧪' },
    { id: 2, title: '온천천 하천 산책 77보 완료', date: '오늘 11:20', amount: '+1,000원', river: '온천천', icon: '👣' },
    { id: 3, title: '동천 수질 오염 현장 사진 제보', date: '어제 16:10', amount: '+1,000원', river: '동천', icon: '📸' },
    { id: 4, title: '괴정천 맑은 물 관찰 제보', date: '8월 12일', amount: '+1,000원', river: '괴정천', icon: '🟢' },
  ]);

  // My coupons
  const [coupons, setCoupons] = useState([
    { id: 101, title: '온천천 카페거리 아메리카노 1,000원 할인', shop: '온천천 자원봉사 카페', expire: '2026.08.31까지', isUsed: false, code: 'DB-ONCHEON-01' },
    { id: 102, title: '동천 마을 베이커리 10% 할인 쿠폰', shop: '범일교 마을 빵집', expire: '2026.09.15까지', isUsed: false, code: 'DB-DONGCHEON-02' },
    { id: 103, title: '부산 하천 자전거 무료 1시간 대여권', shop: '부산 시민 자전거 대여소', expire: '2026.12.31까지', isUsed: false, code: 'DB-RIVER-BIKE-03' },
  ]);

  // Partner merchants list
  const partnerShops = [
    { id: 1, name: '온천천 리버뷰 카페', type: '카페/디저트', distance: '80m', location: '온천천 세병교 옆', benefit: '동백전 결제 시 5% 추가 적립 + 음료 할인', phone: '051-555-1234' },
    { id: 2, name: '동천 친환경 마을상회', type: '제휴 마트', distance: '210m', location: '범일교 앞 100m', benefit: '리버로그 시민 10% 할인 쿠폰 적용 가능', phone: '051-666-5678' },
    { id: 3, name: '괴정천 하구 동백 베이커리', type: '베이커리', distance: '350m', location: '하굿둑 수문 상권', benefit: '아메리카노 1,000원 할인권 사용 가능', phone: '051-777-9012' },
  ];

  // Handle Dongbaekjeon transfer
  const handleExchangeSubmit = () => {
    if (balance <= 0) {
      alert("전환 가능한 동백전 잔액이 없습니다.");
      return;
    }
    const transferred = balance;
    setBalance(0);
    setShowExchangeModal(false);
    if (onShowToast) {
      onShowToast(`🎉 동백전 ${transferred.toLocaleString()}원이 부산 동백전 앱 지갑으로 즉시 전환되었습니다!`);
    }
  };

  return (
    <div style={{ padding: '16px 16px 140px', background: '#f8fafc', minHeight: '100%', overflowY: 'auto' }}>
      {/* Header Sub-Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.1fr', gap: '4px', background: '#e2e8f0', padding: '4px', borderRadius: '14px', marginBottom: '16px' }}>
        <button
          onClick={() => setSubTab('wallet')}
          style={{
            padding: '9px 4px',
            borderRadius: '10px',
            border: 'none',
            background: subTab === 'wallet' ? '#ffffff' : 'transparent',
            color: subTab === 'wallet' ? '#1677ff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.75rem',
            cursor: 'pointer',
            boxShadow: subTab === 'wallet' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Wallet size={14} /> 동백전 지갑
        </button>

        <button
          onClick={() => setSubTab('coupons')}
          style={{
            padding: '9px 4px',
            borderRadius: '10px',
            border: 'none',
            background: subTab === 'coupons' ? '#ffffff' : 'transparent',
            color: subTab === 'coupons' ? '#1677ff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.75rem',
            cursor: 'pointer',
            boxShadow: subTab === 'coupons' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Ticket size={14} /> 내 쿠폰함 ({coupons.length})
        </button>

        <button
          onClick={() => setSubTab('map')}
          style={{
            padding: '9px 4px',
            borderRadius: '10px',
            border: 'none',
            background: subTab === 'map' ? '#ffffff' : 'transparent',
            color: subTab === 'map' ? '#1677ff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.75rem',
            cursor: 'pointer',
            boxShadow: subTab === 'map' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Store size={14} /> 제휴 상권
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. 동백전 지갑 (잔액 + 적립 내역 + 동백전 페이 전환) */}
      {/* ======================================================== */}
      {subTab === 'wallet' && (
        <div>
          {/* Main Wallet Balance Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
            color: 'white',
            padding: '24px 20px',
            borderRadius: '24px',
            marginBottom: '16px',
            boxShadow: '0 12px 28px rgba(22, 119, 255, 0.35)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '14px', fontSize: '0.78rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} /> 부산 동백전 연동 지갑
              </span>
              <span style={{ fontSize: '0.72rem', opacity: 0.9 }}>
                실시간 적립 잔액
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>보유 중인 동백전 적립금</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, margin: '6px 0 16px', letterSpacing: '-1px' }}>
              {balance.toLocaleString()} 원
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
              <button
                onClick={() => setShowExchangeModal(true)}
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  background: '#ffffff',
                  color: '#1677ff',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <ArrowRightLeft size={18} /> 부산 동백전 앱으로 페이 전환하기
              </button>
            </div>
          </div>

          {/* Earning History Section */}
          <div style={{ background: 'white', padding: '18px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📜 동백전 적립 상세 내역 ({historyList.length}건)
            </h4>

            {historyList.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{item.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{item.river} • {item.date}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1677ff' }}>
                  {item.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. 내 쿠폰함 (할인 쿠폰 목록 + QR 사용하기 팝업) */}
      {/* ======================================================== */}
      {subTab === 'coupons' && (
        <div>
          <div style={{ background: 'white', padding: '18px', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '4px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🎟️ 내가 보유한 리버로그 혜택 쿠폰 ({coupons.length}장)
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
              하천 산책 및 수질 측정을 통해 획득한 제휴 상권 전용 할인 쿠폰입니다.
            </p>

            {coupons.map((c) => (
              <div key={c.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: '18px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', background: '#eff6ff', color: '#1677ff', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, display: 'inline-block', marginBottom: '4px' }}>
                      🏪 {c.shop}
                    </span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a' }}>{c.title}</div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>유효기간: {c.expire}</span>
                </div>

                <button
                  onClick={() => setShowQrModal(c)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    background: '#1677ff',
                    color: 'white',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '8px'
                  }}
                >
                  <QrCode size={16} /> QR 바코드 제시하고 쿠폰 사용하기
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. 제휴 상권 지도 (온천천/동천/괴정천 주변 제휴 상점 목록) */}
      {/* ======================================================== */}
      {subTab === 'map' && (
        <div>
          <div style={{ background: 'white', padding: '18px', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '4px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🗺️ 부산 하천 제휴 상권 지도
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
              하천 환경 보호에 동참하는 우리 동네 제휴 가게에서 동백전을 사용해보세요!
            </p>

            {partnerShops.map((shop) => (
              <div key={shop.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: '18px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>{shop.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      📍 {shop.location} • 거리 {shop.distance} ({shop.type})
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', background: '#d1fae5', color: '#065f46', padding: '3px 8px', borderRadius: '8px', fontWeight: 800 }}>
                    동백전 가맹점
                  </span>
                </div>

                <div style={{ background: 'white', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#1677ff', fontWeight: 800, margin: '8px 0' }}>
                  🎁 혜택: {shop.benefit}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button
                    onClick={() => alert(`📍 [${shop.name}] 카카오 지도로 길찾기 안내를 시작합니다.`)}
                    style={{ flex: 1, padding: '10px', borderRadius: '12px', background: '#ffffff', border: '1.5px solid #1677ff', color: '#1677ff', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    🗺️ 길찾기
                  </button>
                  <button
                    onClick={() => alert(`📞 ${shop.name} 전화 연결: ${shop.phone}`)}
                    style={{ flex: 1, padding: '10px', borderRadius: '12px', background: '#1677ff', border: 'none', color: '#ffffff', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    📞 전화 문의
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 동백전 페이 전환 팝업 모달 */}
      {showExchangeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zindex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '340px', background: 'white', borderRadius: '24px', padding: '24px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', color: '#1677ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <ArrowRightLeft size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '6px' }}>부산 동백전 페이 전환</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
              리버로그에서 적립한 <b>{balance.toLocaleString()}원</b>을 부산 동백전 앱 결제 잔액으로 전환합니다.
            </p>

            <button
              onClick={handleExchangeSubmit}
              style={{ width: '100%', padding: '14px', borderRadius: '16px', background: '#1677ff', color: 'white', border: 'none', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', marginBottom: '8px' }}
            >
              ✅ 즉시 전환하기 ({balance.toLocaleString()}원)
            </button>

            <button
              onClick={() => setShowExchangeModal(false)}
              style={{ width: '100%', padding: '10px', borderRadius: '14px', background: '#f1f5f9', color: '#64748b', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 쿠폰 QR 바코드 팝업 모달 */}
      {showQrModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zindex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '340px', background: 'white', borderRadius: '24px', padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '4px' }}>{showQrModal.title}</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '16px' }}>가게 직원에게 아래 QR 바코드를 보여주세요.</p>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', display: 'inline-block', border: '2px dashed #1677ff', marginBottom: '16px' }}>
              <QrCode size={160} color="#1677ff" />
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1677ff', marginTop: '10px' }}>{showQrModal.code}</div>
            </div>

            <button
              onClick={() => {
                setShowQrModal(null);
                if (onShowToast) onShowToast("🎉 쿠폰 사용이 정상적으로 완료 되었습니다!");
              }}
              style={{ width: '100%', padding: '14px', borderRadius: '16px', background: '#1677ff', color: 'white', border: 'none', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              확인 (사용 완료)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
