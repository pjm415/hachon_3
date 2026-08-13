import React, { useState } from 'react';
import { CreditCard, ArrowUpRight, Gift, History, Sparkles, CheckCircle2 } from 'lucide-react';
import { walletHistory } from '../mockData';

export default function WalletTab({ totalEarned, historyItems }) {
  const [withdrawn, setWithdrawn] = useState(false);
  const currentBalance = 14500 + totalEarned;

  const handleWithdraw = () => {
    setWithdrawn(true);
  };

  return (
    <div className="wallet-tab" style={{ padding: '20px 16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <span className="badge badge-dongbaek" style={{ marginBottom: '8px' }}>
          <Sparkles size={12} /> 부산시 동백전 공식 지갑
        </span>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>동백전 캐시백 리워드</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
          수질 측정과 줍깅 챌린지로 받은 캐시백을 동백전에 적립하세요.
        </p>
      </div>

      {/* Main Dongbaekjeon Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)',
        color: 'white',
        padding: '24px 20px',
        borderRadius: '24px',
        boxShadow: '0 12px 24px -6px rgba(225, 29, 72, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.5px' }}>
            <CreditCard size={20} /> 동백전 (부산 지역화폐)
          </div>
          <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
            연동 계좌 완료
          </span>
        </div>

        <div style={{ fontSize: '0.8rem', opacity: 0.85, marginBottom: '4px' }}>수질 측정 환급 캐시백 잔액</div>
        <div style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '20px' }}>
          {withdrawn ? '0원' : `${currentBalance.toLocaleString()}원`}
        </div>

        {!withdrawn ? (
          <button 
            className="btn-secondary" 
            onClick={handleWithdraw}
            style={{
              background: 'white',
              color: '#e11d48',
              border: 'none',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ArrowUpRight size={18} /> 동백전 앱으로 캐시백 즉시 출금하기
          </button>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px', textAlign: 'center', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <CheckCircle2 size={18} /> 동백전 앱으로 출금 완료되었습니다!
          </div>
        )}
      </div>

      {/* Available Coupons */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.02rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Gift size={18} color="var(--dongbaek)" /> 보유 중인 지정 업소 할인쿠폰
        </h3>
        <div style={{ background: 'var(--dongbaek-light)', border: '1px solid #fecdd3', padding: '14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--dongbaek)' }}>
              임하천길 감성카페 1,000원 할인
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: '2px' }}>
              다회용 기기 반납 리워드 (유효기간: 2026.09.30)
            </div>
          </div>
          <button className="badge badge-dongbaek" style={{ border: 'none', cursor: 'pointer', padding: '6px 12px' }}>
            사용하기
          </button>
        </div>
      </div>

      {/* Cashback History Ticker */}
      <div className="card">
        <h3 style={{ fontSize: '1.02rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <History size={18} color="var(--primary)" /> 최근 캐시백 적립 내역
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {historyItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--gray-100)' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{item.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>{item.date} · {item.detail}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: item.type === 'earn' ? 'var(--primary)' : 'var(--dongbaek)' }}>
                +{item.amount.toLocaleString()}원
              </div>
            </div>
          ))}
          {walletHistory.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--gray-100)' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{item.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>{item.date} · {item.detail}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: item.type === 'earn' ? 'var(--primary)' : 'var(--dongbaek)' }}>
                +{item.amount.toLocaleString()}원
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
