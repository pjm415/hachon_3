import React, { useState } from 'react';
import { Store, QrCode, Coffee, Gift, CheckCircle, MapPin, Sparkles } from 'lucide-react';
import { localMerchants } from '../mockData';

export default function MerchantTab({ onEarnCoupon }) {
  const [rentedMerchant, setRentedMerchant] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [couponEarned, setCouponEarned] = useState(false);

  const handleRent = (merchant) => {
    setRentedMerchant(merchant);
    setShowQrModal(true);
  };

  const handleReturnDevice = () => {
    setShowQrModal(false);
    setCouponEarned(true);
    if (onEarnCoupon) onEarnCoupon(rentedMerchant);
  };

  return (
    <div className="merchant-tab" style={{ padding: '20px 16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
          <Store size={12} /> 골목 상권 상생 프로젝트
        </span>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>우리동네 하천살리기 지정 업소</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
          가까운 제휴 카페에서 다회용 센서를 무료로 대여하고 할인 쿠폰을 받아가세요!
        </p>
      </div>

      {/* Rented Device Status Banner */}
      {rentedMerchant && !couponEarned && (
        <div className="card" style={{ background: '#f0f9ff', border: '1px solid #0284c7', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="badge badge-primary">
              <QrCode size={12} /> 센서 대여 중
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: 700 }}>대여지: {rentedMerchant.name}</span>
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '12px' }}>
            측정 후 {rentedMerchant.name}에 반납하면 음료 1,000원 쿠폰 발급!
          </div>
          <button className="btn-primary" onClick={handleReturnDevice} style={{ background: 'var(--blue)' }}>
            기기 반납하고 할인쿠폰 받기
          </button>
        </div>
      )}

      {/* Coupon Earned Banner */}
      {couponEarned && (
        <div className="card" style={{ background: '#fff1f2', border: '1px solid #e11d48', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e11d48', fontWeight: 800, marginBottom: '6px' }}>
            <Gift size={20} /> [쿠폰 적립] 아메리카노 1,000원 할인 쿠폰 지급 완료!
          </div>
          <p style={{ fontSize: '0.8rem', color: '#be123c' }}>
            내 지갑 쿠폰함에서 제휴 업소 방문 시 결제 시 바로 사용할 수 있습니다.
          </p>
        </div>
      )}

      {/* Merchant List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {localMerchants.map((merchant) => (
          <div key={merchant.id} className="card" style={{ marginBottom: 0, padding: '16px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', background: 'var(--gray-100)', padding: '10px', borderRadius: '16px' }}>
                {merchant.image}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{merchant.name}</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gray-500)', fontWeight: 700 }}>{merchant.distance}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, margin: '2px 0 6px' }}>
                  대여 가능 기기: {merchant.availableDevices} / {merchant.totalDevices}대
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Gift size={12} color="var(--dongbaek)" /> {merchant.benefit}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '12px', borderTop: '1px solid var(--gray-100)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>📍 {merchant.address}</span>
              <button 
                className="btn-primary" 
                onClick={() => handleRent(merchant)}
                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.8rem' }}
                disabled={merchant.availableDevices === 0 || (rentedMerchant?.id === merchant.id && !couponEarned)}
              >
                {rentedMerchant?.id === merchant.id && !couponEarned ? '대여 중' : '기기 대여 (QR)'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Scan Simulation Modal */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '360px', padding: '24px', textAlign: 'center', background: 'white' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
              {rentedMerchant?.name} 기기 대여
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginBottom: '20px' }}>
              카운터에 배치된 대여 QR 코드를 스캔하세요.
            </p>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '2px dashed var(--gray-300)', marginBottom: '20px', display: 'inline-block' }}>
              <QrCode size={120} color="var(--gray-900)" />
            </div>

            <button className="btn-primary" onClick={() => setShowQrModal(false)}>
              대여 확인 (스캔 완료)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
