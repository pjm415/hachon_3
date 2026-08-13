import React, { useState, useEffect, useRef } from 'react';
import HomeTab from './components/HomeTab';
import MeasureTab from './components/MeasureTab';
import BenefitsTab from './components/BenefitsTab';
import MyPageTab from './components/MyPageTab';
import { BUSAN_RIVER_STATIONS } from './api/waterQualityApi';
import { Home, Droplets, Footprints, Gift, User, Bell, Camera, Pause, Sparkles, Image as ImageIcon, CheckCircle, AlertTriangle, Heart, MessageCircle, Share2, SwitchCamera, AlertCircle, X, Activity, Coins } from 'lucide-react';
import './index.css';

const INITIAL_RECORDS = [
  { id: 1, riverId: '2014A65', riverName: '온천천', type: 'positive', tag: '맑은 물 관찰', text: '세병교 하부 송사리 떼 관찰됨, 악취 없고 물이 아주 투명합니다!', author: '최수조 (주민)', time: '10분 전', badgeCount: 8, photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', likes: 24, comments: 5 },
  { id: 2, riverId: '2014A65', riverName: '온천천', type: 'positive', tag: '생물 관찰', text: '온천천 산책로 근처에서 왜가리 발견! 생태계 복원 성공적', author: '기점수 (측정단)', time: '30분 전', badgeCount: 16, photo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80', likes: 42, comments: 8 },
  { id: 3, riverId: '2014A70', riverName: '동천', type: 'negative', tag: '오염 제보', text: '동천 범일교 하구 약간의 미세 유류 띠 발견됨 빠른 조치 필요', author: '최진아 (시민기자)', time: '25분 전', badgeCount: 2, photo: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80', likes: 18, comments: 12 },
  { id: 4, riverId: '2014A70', riverName: '동천', type: 'negative', tag: '악취 발생', text: '범일교 상류 인근 악취 수치 상승 제보합니다.', author: '최풍림 (지킴이)', time: '1시간 전', badgeCount: 56, photo: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80', likes: 89, comments: 24 },
  { id: 5, riverId: '2014A85', riverName: '괴정천', type: 'positive', tag: '수질 측정', text: 'DO 용존산소 9.2mg/L로 매우 우수한 1급수 상태 유지 중', author: '조성하 (봉사단)', time: '40분 전', badgeCount: 20, photo: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80', likes: 35, comments: 4 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'measure', 'benefits', 'mypage'
  const [selectedStationId, setSelectedStationId] = useState('2014A65');
  const [isWalking, setIsWalking] = useState(false);
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [walkSteps, setWalkSteps] = useState(0);
  const [records, setRecords] = useState(INITIAL_RECORDS);

  // Real WebRTC Camera for Walking Screen
  const [showRealCameraModal, setShowRealCameraModal] = useState(false);
  const walkingVideoRef = useRef(null);
  const [walkingCameraStream, setWalkingCameraStream] = useState(null);
  const [walkingCameraError, setWalkingCameraError] = useState(null);

  // Selected Photo Pin Feed Drawer State
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showFeedDrawer, setShowFeedDrawer] = useState(false);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('positive');
  const [uploadTag, setUploadTag] = useState('맑은 물 관찰');
  const [uploadComment, setUploadComment] = useState('');
  const [uploadPhoto, setUploadPhoto] = useState('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80');
  const [toastMessage, setToastMessage] = useState(null);

  const currentStation = BUSAN_RIVER_STATIONS.find(s => s.id === selectedStationId) || BUSAN_RIVER_STATIONS[0];

  // Start Real Camera Stream for Walking Screen
  const startWalkingCamera = async () => {
    setShowRealCameraModal(true);
    setWalkingCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("카메라 API를 지원하지 않는 브라우저입니다.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setWalkingCameraStream(stream);
      if (walkingVideoRef.current) {
        walkingVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Walking Camera Hardware/Permission Error:", err);
      setWalkingCameraError("카메라 접근 권한이 필요합니다. 갤러리 파일 선택을 이용해 주세요.");
    }
  };

  const stopWalkingCamera = () => {
    if (walkingCameraStream) {
      walkingCameraStream.getTracks().forEach(track => track.stop());
      setWalkingCameraStream(null);
    }
    setShowRealCameraModal(false);
  };

  const captureWalkingPhoto = () => {
    if (walkingVideoRef.current) {
      const video = walkingVideoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setUploadPhoto(dataUrl);
      stopWalkingCamera();
      setShowUploadModal(true);
    }
  };

  // 1. STRICT PHYSICAL MOTION PEDOMETER ONLY (DeviceMotionEvent)
  // Step count increases strictly when physical body motion is detected!
  useEffect(() => {
    if (!isWalking) return;

    let lastStepTime = 0;
    const ACCELERATION_THRESHOLD = 12.8; // Physical motion threshold (m/s²)
    const MIN_STEP_INTERVAL = 350; // Minimum time between foot steps (ms)

    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;
      const magnitude = Math.sqrt(x * x + y * y + z * z);

      const now = Date.now();
      if (magnitude > ACCELERATION_THRESHOLD && (now - lastStepTime > MIN_STEP_INTERVAL)) {
        lastStepTime = now;
        setWalkSteps(prev => prev + 1);
      }
    };

    if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('devicemotion', handleMotion, true);
            }
          })
          .catch(err => console.warn("Motion sensor permission:", err));
      } else {
        window.addEventListener('devicemotion', handleMotion, true);
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotion, true);
      }
    };
  }, [isWalking]);

  // 2. Timer Effect (Increments duration ONLY)
  useEffect(() => {
    let interval = null;
    if (isWalking) {
      interval = setInterval(() => {
        setWalkSeconds(prev => prev + 1);
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
    }, 3200);
  };

  // Open Feed Drawer when a photo pin is clicked
  const handleSelectPhotoPin = (record) => {
    setSelectedRecord(record);
    setShowFeedDrawer(true);
  };

  // Toggle Like Record
  const handleToggleLike = (recordId) => {
    setRecords(records.map(r => {
      if (r.id === recordId) {
        const isLiked = r.userLiked;
        return {
          ...r,
          userLiked: !isLiked,
          likes: isLiked ? r.likes - 1 : r.likes + 1
        };
      }
      return r;
    }));
  };

  // Handle citizen measurement addition
  const handleAddMeasurement = (newMeasure) => {
    showNotification("🎉 시민 수질 측정 완료! 동백전 +1,000원 적립되었습니다.");
  };

  // Handle Upload Form Submit
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const newRecord = {
      id: Date.now(),
      riverId: selectedStationId,
      riverName: currentStation.river,
      type: uploadType,
      tag: uploadTag || (uploadType === 'positive' ? '맑은 물 관찰' : '오염 제보'),
      text: uploadComment || (uploadType === 'positive' ? '하천 환경이 매우 깨끗하고 쾌적합니다.' : '하천 수질 오염 및 이상 현상이 발견되었습니다.'),
      author: '시민 (나)',
      time: '방금 전',
      badgeCount: 1,
      photo: uploadPhoto,
      likes: 1,
      comments: 0
    };

    setRecords([newRecord, ...records]);
    setShowUploadModal(false);
    setUploadComment('');
    showNotification(`🎉 지도에 사진이 등록되었습니다! [${currentStation.river}] 동백전 +1,000원 적립`);
  };

  const currentRiverRecords = records.filter(r => r.riverId === selectedStationId);

  // 10보당 1원 적립 계산기 (User requested: 10보당 1원)
  const earnedDongbaek = Math.floor(walkSteps / 10);

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
            background: 'linear-gradient(135deg, #1677ff, #0958d9)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '16px',
            boxShadow: '0 10px 20px rgba(22, 119, 255, 0.4)',
            zIndex: 160,
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

        {/* 1. Top Header Bar */}
        <header className="topbar">
          <div className="brand" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
            <span className="brand-name">리버로그</span>
            <span 
              className="brand-badge" 
              onClick={(e) => {
                e.stopPropagation();
                setShowFeedDrawer(true);
              }}
            >
              시민 리버 피드 📸
            </span>
          </div>
          <button 
            className="icon-btn" 
            type="button" 
            aria-label="알림"
            onClick={() => showNotification("🔔 실시간 시민 수질 사진 피드가 갱신되었습니다.")}
          >
            <Bell size={20} />
          </button>
        </header>

        {/* 2. Sub-header River Filter Tabs */}
        {activeTab === 'home' && (
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
        )}

        {/* 3. Main Center Content Area: Home / Measure / Benefits / MyPage */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {activeTab === 'home' && (
            <HomeTab 
              selectedStationId={selectedStationId} 
              setSelectedStationId={setSelectedStationId}
              records={records}
              onSelectPhotoPin={handleSelectPhotoPin}
            />
          )}

          {activeTab === 'measure' && (
            <MeasureTab onAddMeasurement={handleAddMeasurement} />
          )}

          {activeTab === 'benefits' && (
            <BenefitsTab onShowToast={showNotification} />
          )}

          {activeTab === 'mypage' && (
            <MyPageTab onShowToast={showNotification} />
          )}
        </div>

        {/* 4. Bottom Navigation Bar matching user screenshot */}
        <nav className="bottom-nav-clean">
          {/* Tab 1: 홈 (Home) */}
          <button 
            className={`nav-tab-item ${activeTab === 'home' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={22} />
            <span>홈</span>
          </button>

          {/* Tab 2: 수질 측정 */}
          <button 
            className={`nav-tab-item ${activeTab === 'measure' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('measure')}
          >
            <Droplets size={22} />
            <span>수질 측정</span>
          </button>

          {/* Tab 3: 산책하기 */}
          <div className="nav-center-circle-wrapper">
            <button 
              className="center-walk-big-btn"
              onClick={() => {
                setIsWalking(true);
                setWalkSeconds(0);
                setWalkSteps(0);
                
                // Request Motion Permission on Mobile iOS/Android
                if (typeof window !== 'undefined' && window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') {
                  DeviceMotionEvent.requestPermission().catch(console.error);
                }
              }}
              title="산책 시작"
            >
              <Footprints size={28} />
            </button>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1677ff', marginTop: '36px' }}>산책하기</span>
          </div>

          {/* Tab 4: 혜택 */}
          <button 
            className={`nav-tab-item ${activeTab === 'benefits' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('benefits')}
          >
            <Gift size={22} />
            <span>혜택</span>
          </button>

          {/* Tab 5: 마이페이지 */}
          <button 
            className={`nav-tab-item ${activeTab === 'mypage' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('mypage')}
          >
            <User size={22} />
            <span>마이페이지</span>
          </button>
        </nav>

        {/* 5. Active Walking Screen displaying 10보당 1원 동백전 적립 */}
        {isWalking && (
          <div className="walking-screen">
            <div style={{ background: 'rgba(255,255,255,0.22)', padding: '6px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#10b981" />
              📱 10보 당 동백전 1원 실시간 적립 중
            </div>

            <div className="walking-timer">
              {formatTimer(walkSeconds)}
            </div>

            <div className="walking-center-content">
              <div className="walking-river-title">
                {currentStation.river} 산책 중...
              </div>

              {/* Step Counter */}
              <div className="walking-step-count">
                {walkSteps.toLocaleString()}보
              </div>

              {/* Real-time 10보 당 1원 Dongbaekjeon Pay Reward Banner */}
              <div style={{
                fontSize: '0.92rem',
                fontWeight: 900,
                color: '#3c1e1e',
                background: '#fee500',
                padding: '8px 16px',
                borderRadius: '20px',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}>
                <Coins size={18} color="#3c1e1e" />
                적립 동백전: <b>{earnedDongbaek.toLocaleString()}원</b> (10보당 1원)
              </div>

              <Footprints className="walking-footprint-icon" size={64} style={{ marginTop: '12px' }} />
            </div>

            <div className="walking-bottom-actions">
              <button 
                className="walking-action-btn"
                onClick={startWalkingCamera}
              >
                <div className="walking-action-circle">
                  <Camera size={22} />
                </div>
                <span>업로드</span>
              </button>

              <button 
                className="walking-action-btn"
                onClick={() => {
                  setIsWalking(false);
                  showNotification(`🏅 ${currentStation.river} 산책 완료! 총 ${walkSteps.toLocaleString()}보 (${earnedDongbaek.toLocaleString()}원) 적립 완료!`);
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

        {/* Real Live Hardware Camera Modal */}
        {showRealCameraModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 350, display: 'flex', flexDirection: 'column', padding: '20px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={20} /> 실시간 하천 촬영 카메라
              </span>
              <button 
                onClick={stopWalkingCamera}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} />
              </button>
            </div>

            {walkingCameraError ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '12px' }} />
                <p style={{ fontSize: '0.9rem', color: '#f87171', fontWeight: 700, marginBottom: '16px' }}>
                  {walkingCameraError}
                </p>

                <label style={{ background: '#1677ff', color: 'white', padding: '14px 24px', borderRadius: '16px', fontWeight: 800, cursor: 'pointer' }}>
                  📁 사진 파일 직접 선택하기
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setUploadPhoto(event.target.result);
                          stopWalkingCamera();
                          setShowUploadModal(true);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            ) : (
              <div style={{ flex: 1, position: 'relative', borderRadius: '24px', overflow: 'hidden', background: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video 
                  ref={walkingVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', bottom: '20px', background: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', color: 'white', fontWeight: 800 }}>
                  📍 [{currentStation.river}] 산책 현장 촬영중
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-submit"
                onClick={captureWalkingPhoto}
                style={{ flex: 1, margin: 0, padding: '16px', background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '1rem' }}
              >
                📸 찰칵! 샷 촬영하고 지도에 등록
              </button>

              <button 
                onClick={stopWalkingCamera}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '16px 20px', borderRadius: '16px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 6. Citizen River Photo Feed Modal */}
        {showFeedDrawer && (
          <div className="feed-drawer-backdrop" onClick={() => setShowFeedDrawer(false)}>
            <div className="feed-drawer" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                  📸 [{currentStation.river}] 시민 리버 피드 ({currentRiverRecords.length}건)
                </h3>
                <button 
                  style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800 }}
                  onClick={() => setShowFeedDrawer(false)}
                >
                  ✕
                </button>
              </div>

              {currentRiverRecords.map((item) => (
                <div key={item.id} className="feed-item-card">
                  <div className="feed-item-header">
                    <div className="feed-author-info">
                      <div className="feed-avatar">{item.author.charAt(0)}</div>
                      <div>
                        <div className="feed-author-name">{item.author}</div>
                        <div className="feed-time">{item.riverName} • {item.time}</div>
                      </div>
                    </div>
                    <span className={`feed-tag ${item.type}`}>
                      {item.type === 'positive' ? '🟢 ' : '🔴 '}{item.tag}
                    </span>
                  </div>

                  <img src={item.photo} alt={item.tag} className="feed-photo" />
                  <p className="feed-comment">{item.text}</p>

                  <div className="feed-actions">
                    <span 
                      style={{ cursor: 'pointer', color: item.userLiked ? '#ef4444' : '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => handleToggleLike(item.id)}
                    >
                      <Heart size={16} fill={item.userLiked ? '#ef4444' : 'none'} color={item.userLiked ? '#ef4444' : '#64748b'} /> {item.likes}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MessageCircle size={16} /> {item.comments}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Share2 size={16} /> 공유
                    </span>
                  </div>
                </div>
              ))}

              <button 
                className="btn-submit"
                onClick={() => {
                  setShowFeedDrawer(false);
                  startWalkingCamera();
                }}
              >
                📷 나도 현장 사진 올리고 동백전 받기
              </button>
            </div>
          </div>
        )}

        {/* 7. Upload Modal */}
        {showUploadModal && (
          <div className="upload-modal-backdrop" onClick={() => setShowUploadModal(false)}>
            <div className="upload-modal" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                  📸 [{currentStation.river}] 지도 사진 등록
                </h3>
                <button 
                  style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800 }}
                  onClick={() => setShowUploadModal(false)}
                >
                  ✕
                </button>
              </div>

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

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  촬영된 현장 사진 (지도 위에 표시됩니다)
                </label>
                <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '14px', overflow: 'hidden', background: '#f1f5f9', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={uploadPhoto} alt="미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={startWalkingCamera}
                    style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Camera size={14} /> 다시 촬영하기
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  한줄 제보 기록
                </label>
                <textarea
                  rows={3}
                  value={uploadComment}
                  onChange={e => setUploadComment(e.target.value)}
                  placeholder={uploadType === 'positive' ? '예: 물이 맑고 송사리 떼가 많이 보입니다.' : '예: 동천 범일교 하구에 기름 띠가 보입니다.'}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.88rem', resize: 'none' }}
                />
              </div>

              <button 
                type="button"
                className="btn-submit"
                onClick={handleUploadSubmit}
              >
                📍 지도에 사진 핀 올리기 (동백전 +1,000원)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
