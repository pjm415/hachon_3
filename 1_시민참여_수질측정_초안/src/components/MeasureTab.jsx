import React, { useState, useEffect } from 'react';
import { Camera, QrCode, ShieldAlert, CheckCircle2, Sparkles, Lock, RefreshCw } from 'lucide-react';

export default function MeasureTab({ onAddMeasurement }) {
  const [step, setStep] = useState('select'); // 'select', 'scanning', 'result'
  const [kitType, setKitType] = useState('single'); // 'single' or 'multi'
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const startScan = (type) => {
    setKitType(type);
    setStep('scanning');
    setIsScanning(true);
    setScanProgress(0);
  };

  useEffect(() => {
    let timer;
    if (isScanning && scanProgress < 100) {
      timer = setTimeout(() => {
        setScanProgress(prev => prev + 25);
      }, 400);
    } else if (scanProgress >= 100) {
      setIsScanning(false);
      setStep('result');
      if (onAddMeasurement) {
        onAddMeasurement({
          locationName: "임하천 중류 A구역 (동백교 하단)",
          status: "good",
          statusText: "1급수 (매우 좋음)",
          bod: "1.4 ppm",
          ph: "7.1",
          turbidity: "맑음 (0.9 NTU)",
          kitType: kitType === 'single' ? "자판기 1회용 시약 키트" : "지정카페 대여 다회용 센서"
        });
      }
    }
    return () => clearTimeout(timer);
  }, [isScanning, scanProgress]);

  return (
    <div className="measure-tab" style={{ padding: '20px 16px' }}>
      <div style={{ marginBottom: '20px' }}>
        <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
          <Lock size={12} /> 데이터 위·변조 방지 시스템 적용 중
        </span>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>실시간 수질 측정 모듈</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
          갤러리 업로드가 금지되며 라이브 카메라와 GPS로 무결성을 입증합니다.
        </p>
      </div>

      {/* STEP 1: Select Kit Type */}
      {step === 'select' && (
        <div>
          <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '12px', borderRadius: '16px' }}>
                <QrCode size={28} />
              </div>
              <div>
                <span className="badge badge-success">상시 무료지급</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '4px' }}>1회용 시약 키트 측정</h3>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--gray-700)', marginBottom: '16px', lineHeight: 1.5 }}>
              산책로 무인 자판기에서 수령한 1회용 시약 키트의 QR을 스캔하고 물에 적신 후 시약 색상을 스캔합니다.
            </p>
            <button className="btn-primary" onClick={() => startScan('single')}>
              1회용 키트 바코드 스캔 시작
            </button>
          </div>

          <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: 'var(--blue-light)', color: 'var(--blue)', padding: '12px', borderRadius: '16px' }}>
                <Camera size={28} />
              </div>
              <div>
                <span className="badge badge-primary">우리동네 카페 대여</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '4px' }}>다회용 정밀 센서 측정</h3>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--gray-700)', marginBottom: '16px', lineHeight: 1.5 }}>
              지정 업소(카페)에서 대여한 디지털 센서의 LCD 화면 측정치를 스마트폰으로 직접 스캔합니다.
            </p>
            <button className="btn-secondary" onClick={() => startScan('multi')} style={{ background: 'var(--blue-light)', color: 'var(--blue)', border: '1px solid var(--blue)' }}>
              다회용 센서 QR 스캔 시작
            </button>
          </div>

          <div style={{ background: '#fef3c7', padding: '14px', borderRadius: '14px', border: '1px solid #fde047', fontSize: '0.78rem', color: '#854d0e', display: 'flex', gap: '8px' }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <div>
              <b>위변조 차단 정책:</b> 실시간 GPS 좌표(오차 3m 이내)와 시간 정보가 수질 데이터에 함께 영구 암호화됩니다.
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Live Camera Scan Simulation */}
      {step === 'scanning' && (
        <div style={{ background: '#000', borderRadius: '24px', overflow: 'hidden', position: 'relative', height: '480px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
          {/* Top Camera Metadata */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ background: 'rgba(239, 68, 68, 0.8)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} className="pulse"></span> LIVE (갤러리 불가)
              </span>
              <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>
                GPS 35.1634°N, 129.1623°E
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', textAlign: 'center', opacity: 0.9 }}>
              {kitType === 'single' ? '시약 종이와 표준 색상 카드를 사각형에 맞추세요' : '디지털 센서 LCD 화면을 정면에 맞추세요'}
            </div>
          </div>

          {/* Camera Frame Overlay */}
          <div style={{
            position: 'relative',
            height: '240px',
            border: '2px dashed #10b981',
            borderRadius: '16px',
            margin: '0 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(16, 185, 129, 0.05)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Camera size={48} color="#10b981" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
                AI 스캐닝 진행 중... ({scanProgress}%)
              </div>
              {/* Progress Bar */}
              <div style={{ width: '180px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', margin: '12px auto 0', overflow: 'hidden' }}>
                <div style={{ width: `${scanProgress}%`, height: '100%', background: '#10b981', transition: 'width 0.3s' }}></div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', opacity: 0.7, marginBottom: '12px' }}>
              타임스탬프: 2026-08-13 18:30:12 KST (위변조 방지 기기서명 적용)
            </div>
            <button className="btn-secondary" onClick={() => setStep('select')} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}>
              취소하기
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Scan Complete Result Modal */}
      {step === 'result' && (
        <div className="card" style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(180deg, #ffffff 0%, #ecfdf5 100%)', border: '2px solid #10b981' }}>
          <div style={{ display: 'inline-flex', background: '#d1fae5', color: '#059669', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
            <CheckCircle2 size={48} />
          </div>

          <span className="badge badge-dongbaek" style={{ fontSize: '0.85rem', padding: '6px 14px', marginBottom: '12px' }}>
            <Sparkles size={14} /> 동백전 +1,000원 캐시백 적립 완료!
          </span>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '8px', marginBottom: '4px' }}>
            수질 측정 검증 성공
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginBottom: '20px' }}>
            입력된 데이터는 위변조 불가능한 블록체인 해시로 기록되었습니다.
          </p>

          <div style={{ background: 'white', padding: '16px', borderRadius: '16px', textAlign: 'left', marginBottom: '20px', border: '1px solid var(--gray-200)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '10px', color: 'var(--gray-900)' }}>
              📍 측정 결과 요약
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 0', borderBottom: '1px solid var(--gray-100)' }}>
              <span color="var(--gray-500)">위치:</span>
              <b>임하천 중류 A구역 (동백교 하단)</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 0', borderBottom: '1px solid var(--gray-100)' }}>
              <span color="var(--gray-500)">수질 등급:</span>
              <b style={{ color: 'var(--primary)' }}>1급수 (매우 좋음)</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 0', borderBottom: '1px solid var(--gray-100)' }}>
              <span color="var(--gray-500)">BOD 측정치:</span>
              <b>1.4 ppm</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '6px 0' }}>
              <span color="var(--gray-500)">블록체인 Hash:</span>
              <b style={{ fontSize: '0.72rem', color: 'var(--blue)' }}>0x8f2a...9b31</b>
            </div>
          </div>

          <button className="btn-primary" onClick={() => setStep('select')}>
            <RefreshCw size={18} /> 추가 측정하기
          </button>
        </div>
      )}
    </div>
  );
}
