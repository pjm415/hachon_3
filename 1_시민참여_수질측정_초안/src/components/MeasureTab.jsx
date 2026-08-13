import React, { useState, useEffect } from 'react';
import { BUSAN_RIVER_STATIONS, getStationWaterData } from '../api/waterQualityApi';
import { Activity, Droplet, ShieldCheck, QrCode, Camera, CheckCircle2, Sparkles, Store, ArrowRight, RefreshCw, BarChart2, TestTube, FileText, CheckCircle, Database } from 'lucide-react';

export default function MeasureTab({ onAddMeasurement }) {
  // Two main Sub-Tabs: 'public' (실시간 공공 측정 정보) vs 'citizen' (시민 직접 키트 측정)
  const [subTab, setSubTab] = useState('public');
  
  // Public sub-tab state
  const [selectedStationId, setSelectedStationId] = useState('2014A65');
  const realtimeData = getStationWaterData(selectedStationId);
  const { metrics, bodTrend24h } = realtimeData;

  // Citizen measurement 5-step flow state
  const [citizenStep, setCitizenStep] = useState('check_kit');
  const [selectedShop, setSelectedShop] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  // Filter for citizen results feed
  const [resultFilter, setResultFilter] = useState('all'); // 'all', '2014A65', '2014A70', '2014A85'

  // Citizen measurements data list (rented devices & vending machine kits)
  const [citizenResults, setCitizenResults] = useState([
    {
      id: 101,
      riverId: '2014A65',
      river: '온천천',
      location: '세병교 상류 30m 지점',
      deviceType: '지정 상점 대여 디지털 센서 (온천천 자원봉사센터)',
      author: '기점수 (시민 측정단)',
      time: '15분 전',
      bod: '1.4 ppm',
      ph: '7.2',
      doVal: '9.1 mg/L',
      grade: '1급수 (우수)',
      status: 'good',
      hash: '0x8f2a...9b31'
    },
    {
      id: 102,
      riverId: '2014A70',
      river: '동천',
      location: '범일교 하구 측점',
      deviceType: '무인 자판기 1회용 발색 시약 키트',
      author: '최진아 (시민기자)',
      time: '35분 전',
      bod: '3.2 ppm',
      ph: '6.8',
      doVal: '7.2 mg/L',
      grade: '2급수 (보통)',
      status: 'warning',
      hash: '0x3c7e...12a4'
    },
    {
      id: 103,
      riverId: '2014A85',
      river: '괴정천',
      location: '하굿둑 수문 입구',
      deviceType: '지정 카페 대여 센서 (동백가게)',
      author: '조성하 (봉사단)',
      time: '1시간 전',
      bod: '1.8 ppm',
      ph: '7.4',
      doVal: '8.8 mg/L',
      grade: '1급수 (우수)',
      status: 'good',
      hash: '0x9a1b...55f2'
    }
  ]);

  // Rental shop list
  const rentalShops = [
    { id: 1, name: '온천천 시민 자원봉사센터', distance: '120m', location: '세병교 인근', stock: '여유 15개' },
    { id: 2, name: '동천 마을 상회', distance: '340m', location: '범일교 앞', stock: '여유 8개' },
    { id: 3, name: '괴정천 하구 동백가게', distance: '450m', location: '하굿둑 입구', stock: '여유 12개' },
  ];

  // AI Scan progress animation
  useEffect(() => {
    let timer;
    if (citizenStep === 'ai_analysis' && scanProgress < 100) {
      timer = setTimeout(() => {
        setScanProgress(prev => prev + 25);
      }, 400);
    } else if (citizenStep === 'ai_analysis' && scanProgress >= 100) {
      setCitizenStep('result');
      
      const newResult = {
        id: Date.now(),
        riverId: selectedStationId,
        river: realtimeData.river,
        location: `${realtimeData.river} 측점 구역`,
        deviceType: selectedShop ? `지정 상점 대여 센서 (${selectedShop.name})` : '시민 무인 자판기 1회용 시약 키트',
        author: '시민 (나)',
        time: '방금 전',
        bod: '1.6 ppm',
        ph: '7.2',
        doVal: '9.0 mg/L',
        grade: '1급수 (우수)',
        status: 'good',
        hash: `0x${Math.random().toString(16).substr(2, 8)}`
      };
      setCitizenResults([newResult, ...citizenResults]);

      if (onAddMeasurement) {
        onAddMeasurement({
          locationName: `${realtimeData.river} 측정 구역`,
          status: "good",
          statusText: "1급수 (우수)",
          bod: "1.6 ppm",
          ph: "7.2",
          turbidity: "맑음 (0.8 NTU)"
        });
      }
    }
    return () => clearTimeout(timer);
  }, [citizenStep, scanProgress, realtimeData]);

  const filteredResults = resultFilter === 'all' 
    ? citizenResults 
    : citizenResults.filter(r => r.riverId === resultFilter);

  return (
    <div style={{ padding: '16px 16px 90px', background: '#f8fafc', minHeight: '100%' }}>
      {/* 2 Sub-Tabs Header Navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: '#e2e8f0', padding: '4px', borderRadius: '14px', marginBottom: '16px' }}>
        <button
          onClick={() => setSubTab('public')}
          style={{
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: subTab === 'public' ? '#ffffff' : 'transparent',
            color: subTab === 'public' ? '#1677ff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: subTab === 'public' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <BarChart2 size={16} /> 실시간 공공 측정
        </button>
        <button
          onClick={() => setSubTab('citizen')}
          style={{
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: subTab === 'citizen' ? '#ffffff' : 'transparent',
            color: subTab === 'citizen' ? '#1677ff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: subTab === 'citizen' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <TestTube size={16} /> 시민 키트 측정
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: 실시간 공공 측정 정보 (Open API Key 연동) */}
      {/* ======================================================== */}
      {subTab === 'public' && (
        <div>
          {/* Station Selection */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            {BUSAN_RIVER_STATIONS.map(st => (
              <button
                key={st.id}
                onClick={() => setSelectedStationId(st.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  border: selectedStationId === st.id ? '2px solid #1677ff' : '1px solid #cbd5e1',
                  background: selectedStationId === st.id ? '#eff6ff' : '#ffffff',
                  color: selectedStationId === st.id ? '#1677ff' : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {st.river}
              </button>
            ))}
          </div>

          {/* Integrated Grade Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '20px',
            marginBottom: '14px',
            boxShadow: '0 10px 24px rgba(22, 119, 255, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                📍 {realtimeData.stationName}
              </span>
              <span style={{ fontSize: '0.72rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> 국립환경과학원 연동
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>통합 수질 지표 평가</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, margin: '4px 0 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Droplet size={28} /> {metrics.grade.value}
            </div>

            <div style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '8px 12px', borderRadius: '10px' }}>
              공공데이터포털 API 실시간 데이터 연동 완료
            </div>
          </div>

          {/* Metric Details Cards */}
          <div style={{ background: 'white', padding: '16px', borderRadius: '18px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a' }}>
              <Activity size={16} color="#1677ff" /> {realtimeData.river} 실시간 공공 측정 지표
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>BOD (생화학)</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '2px', color: '#0f172a' }}>{metrics.bod.value}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>DO (용존산소)</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '2px', color: '#0f172a' }}>{metrics.do.value}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>pH (산도)</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '2px', color: '#0f172a' }}>{metrics.ph.value}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#64748b' }}>TDS (고형물)</span>
                <b>{metrics.tds.value}</b>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#64748b' }}>수온</span>
                <b>{metrics.waterTemp.value}</b>
              </div>
            </div>
          </div>

          {/* 24-hour Trend List */}
          <div style={{ background: 'white', padding: '16px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '10px', color: '#0f172a' }}>
              📈 24시간 BOD 수질 변화 추이
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', textAlign: 'center' }}>
              {bodTrend24h.map((t, i) => (
                <div key={i} style={{ background: '#f1f5f9', padding: '8px 2px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.62rem', color: '#64748b' }}>{t.time}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1677ff', marginTop: '2px' }}>{t.bod}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: 시민 키트 측정 (Step Flow + 시민 측정 결과 모아보기) */}
      {/* ======================================================== */}
      {subTab === 'citizen' && (
        <div>
          {/* Step Breadcrumb Progress Bar */}
          <div style={{ background: 'white', padding: '12px 14px', borderRadius: '16px', marginBottom: '16px', border: '1px solid #e2e8f0', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: citizenStep === 'check_kit' || citizenStep === 'shop_list' ? '#1677ff' : '#94a3b8' }}>1. 측정시작/대여</span>
            <ArrowRight size={12} />
            <span style={{ color: citizenStep === 'qr_rent' ? '#1677ff' : '#94a3b8' }}>2. QR대여</span>
            <ArrowRight size={12} />
            <span style={{ color: citizenStep === 'camera_scan' || citizenStep === 'ai_analysis' ? '#1677ff' : '#94a3b8' }}>3. 촬영/AI판독</span>
            <ArrowRight size={12} />
            <span style={{ color: citizenStep === 'result' ? '#1677ff' : '#94a3b8' }}>4. 결과저장</span>
          </div>

          {/* Step 1: Check Kit */}
          {citizenStep === 'check_kit' && (
            <div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#eff6ff', color: '#1677ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <TestTube size={32} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px', color: '#0f172a' }}>
                  시민 수질 측정 시작
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
                  측정 키트를 보유하고 계신가요?<br />키트가 없으시면 가까운 대여 상점에서 QR로 무료 대여할 수 있습니다.
                </p>

                <div style={{ display: 'grid', gap: '10px' }}>
                  <button 
                    className="btn-submit"
                    onClick={() => setCitizenStep('camera_scan')}
                    style={{ margin: 0 }}
                  >
                    📷 키트 보유 중 (바로 카메라 촬영 시작)
                  </button>

                  <button 
                    onClick={() => setCitizenStep('shop_list')}
                    style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1.5px solid #1677ff', background: '#ffffff', color: '#1677ff', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer' }}
                  >
                    🏪 키트 없음 (대여처 상점 목록 보기)
                  </button>
                </div>
              </div>

              {/* NEW SECTION: 시민 측정 결과 모아보기 (Collect & View Citizen Measurements) */}
              <div style={{ background: 'white', padding: '18px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Database size={18} color="#1677ff" /> 시민 측정 결과 모아보기 ({citizenResults.length}건)
                  </h3>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                  <button
                    onClick={() => setResultFilter('all')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      border: 'none',
                      background: resultFilter === 'all' ? '#1677ff' : '#f1f5f9',
                      color: resultFilter === 'all' ? '#ffffff' : '#64748b',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    전체
                  </button>
                  {BUSAN_RIVER_STATIONS.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setResultFilter(st.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        border: 'none',
                        background: resultFilter === st.id ? '#1677ff' : '#f1f5f9',
                        color: resultFilter === st.id ? '#ffffff' : '#64748b',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {st.river}
                    </button>
                  ))}
                </div>

                {/* Citizen Direct Measurement Result List Cards */}
                {filteredResults.map((item) => (
                  <div key={item.id} style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', background: '#eff6ff', color: '#1677ff', padding: '2px 7px', borderRadius: '6px', fontWeight: 800, display: 'inline-block', marginBottom: '4px' }}>
                          🧪 {item.deviceType}
                        </span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                          📍 [{item.river}] {item.location}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.72rem', background: item.status === 'good' ? '#d1fae5' : '#fef2f2', color: item.status === 'good' ? '#065f46' : '#991b1b', padding: '3px 8px', borderRadius: '10px', fontWeight: 800 }}>
                        {item.grade}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', margin: '8px 0', background: 'white', padding: '8px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.72rem', textAlign: 'center' }}>
                      <div><span style={{ color: '#64748b' }}>BOD:</span> <b>{item.bod}</b></div>
                      <div><span style={{ color: '#64748b' }}>pH:</span> <b>{item.ph}</b></div>
                      <div><span style={{ color: '#64748b' }}>DO:</span> <b>{item.doVal}</b></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                      <span>측정자: <b>{item.author}</b> • {item.time}</span>
                      <span style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <CheckCircle size={12} /> 동백전 +1,000원 적립
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Shop List */}
          {citizenStep === 'shop_list' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  🏪 주변 대여처 (상점) 목록
                </h3>
                <button 
                  onClick={() => setCitizenStep('check_kit')}
                  style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  ◀ 뒤로가기
                </button>
              </div>

              {rentalShops.map(shop => (
                <div key={shop.id} style={{ background: 'white', padding: '16px', borderRadius: '18px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{shop.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>📍 {shop.location} • 거리 {shop.distance}</div>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: '#d1fae5', color: '#065f46', padding: '3px 8px', borderRadius: '10px', fontWeight: 800 }}>
                      {shop.stock}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedShop(shop);
                      setCitizenStep('qr_rent');
                    }}
                    style={{ width: '100%', padding: '10px', borderRadius: '12px', background: '#1677ff', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}
                  >
                    <QrCode size={16} /> QR 코드로 대여하기
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: QR Rent Modal */}
          {citizenStep === 'qr_rent' && (
            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <span style={{ background: '#eff6ff', color: '#1677ff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                {selectedShop?.name || '상점 대여'}
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '10px', marginBottom: '6px' }}>
                QR 코드 스캔 및 대여
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
                상점에 비치된 대여 QR 코드를 스마트폰 카메라로 스캔하세요.
              </p>

              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', display: 'inline-block', border: '2px dashed #1677ff', marginBottom: '20px' }}>
                <QrCode size={140} color="#1677ff" />
              </div>

              <button 
                className="btn-submit"
                onClick={() => setCitizenStep('camera_scan')}
                style={{ margin: 0 }}
              >
                ✅ QR 대여 완료 (촬영 단계로 이동)
              </button>
            </div>
          )}

          {/* Step 4: Camera Scan */}
          {citizenStep === 'camera_scan' && (
            <div style={{ background: '#000000', borderRadius: '24px', padding: '20px', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', marginBottom: '10px' }}>
                📷 수질 측정 시약 키트 촬영 중
              </div>
              <div style={{ height: '220px', border: '2px dashed #10b981', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.1)', marginBottom: '16px' }}>
                <div>
                  <Camera size={48} color="#10b981" />
                  <div style={{ fontSize: '0.8rem', marginTop: '8px', color: '#10b981' }}>
                    시약 발색 부위를 프레임 안 중앙에 맞추세요
                  </div>
                </div>
              </div>

              <button 
                className="btn-submit"
                onClick={() => {
                  setCitizenStep('ai_analysis');
                  setScanProgress(0);
                }}
                style={{ margin: 0 }}
              >
                📸 찰칵! 촬영하고 AI 판독 시작
              </button>
            </div>
          )}

          {/* Step 5: AI Analysis */}
          {citizenStep === 'ai_analysis' && (
            <div style={{ background: 'white', padding: '30px 20px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Sparkles size={48} color="#1677ff" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
                AI 시약 색상 분석 진행 중...
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
                스마트폰 카메라로 촬영된 시약 발색 색상을 AI가 정밀 판독합니다 ({scanProgress}%)
              </p>

              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${scanProgress}%`, height: '100%', background: '#1677ff', transition: 'width 0.3s' }}></div>
              </div>
            </div>
          )}

          {/* Step 6: Save Result & Reward */}
          {citizenStep === 'result' && (
            <div style={{ background: 'linear-gradient(180deg, #ffffff 0%, #ecfdf5 100%)', padding: '24px', borderRadius: '24px', border: '2px solid #10b981', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <CheckCircle2 size={36} />
              </div>

              <span style={{ background: '#059669', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                <Sparkles size={14} /> 동백전 +1,000원 적립 완료!
              </span>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '4px', color: '#0f172a' }}>
                측정 결과 저장 성공
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
                시민 판독 결과가 하천 데이터베이스 및 아래 모아보기에 즉시 등록되었습니다.
              </p>

              <div style={{ background: 'white', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '16px', fontSize: '0.82rem' }}>
                <div style={{ padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>📍 위치: <b>{realtimeData.river} 수질 측정 구역</b></div>
                <div style={{ padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>💧 판정 등급: <b style={{ color: '#059669' }}>1급수 (우수)</b></div>
                <div style={{ padding: '4px 0' }}>🧪 BOD 판독치: <b>1.6 ppm (AI 컬러매칭 성공)</b></div>
              </div>

              <button 
                className="btn-submit"
                onClick={() => setCitizenStep('check_kit')}
                style={{ margin: 0 }}
              >
                <RefreshCw size={16} /> 다시 측정하기 / 결과 모아보기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
