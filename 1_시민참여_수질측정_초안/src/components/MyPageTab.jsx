import React, { useState } from 'react';
import { User, Flame, Footprints, Camera, Heart, CheckCircle2, Mail, Edit3, Shield, Award, Calendar, LogOut } from 'lucide-react';

export default function MyPageTab({ onShowToast }) {
  const [nickname, setNickname] = useState('부산하천지킴이_아린');
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [newNickInput, setNewNickInput] = useState(nickname);

  // User Stats
  const [stats, setStats] = useState({
    totalSteps: 12840,
    walkCount: 14,
    measureCount: 8,
    attendanceStreak: 7,
    email: 'team3@hacheon.busan.kr'
  });

  // Consecutive Attendance Status (월~일)
  const attendanceDays = [
    { day: '월', done: true, label: '8/08' },
    { day: '화', done: true, label: '8/09' },
    { day: '수', done: true, label: '8/10' },
    { day: '목', done: true, label: '8/11' },
    { day: '금', done: true, label: '8/12' },
    { day: '토', done: true, label: '8/13' },
    { day: '일', done: true, label: '오늘', isToday: true },
  ];

  // My Uploaded Photos
  const [myPhotos, setMyPhotos] = useState([
    {
      id: 201,
      river: '온천천',
      location: '온천천 세병교 하단',
      tag: '맑은 물 관찰',
      type: 'positive',
      date: '2026.08.13',
      photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      likes: 24,
      text: '세병교 밑에 송사리가 많이 관찰됩니다!'
    },
    {
      id: 202,
      river: '온천천',
      location: '온천천 산책로 쉼터',
      tag: '생물 관찰',
      type: 'positive',
      date: '2026.08.12',
      photo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      likes: 42,
      text: '산책로에서 왜가리 발견'
    },
    {
      id: 203,
      river: '동천',
      location: '동천 범일교 인근',
      tag: '오염 제보',
      type: 'negative',
      date: '2026.08.10',
      photo: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80',
      likes: 18,
      text: '약간의 기름 띠 발견 및 제보'
    },
    {
      id: 204,
      river: '괴정천',
      location: '괴정천 하굿둑',
      tag: '수질 측정',
      type: 'positive',
      date: '2026.08.08',
      photo: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80',
      likes: 35,
      text: '1급수 측정 완료'
    }
  ]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Handle Nickname Edit
  const handleSaveNickname = () => {
    if (!newNickInput.trim()) return;
    setNickname(newNickInput);
    setIsEditingNick(false);
    if (onShowToast) onShowToast(`✏️ 닉네임이 '${newNickInput}'(으)로 변경되었습니다.`);
  };

  return (
    <div style={{ padding: '16px 16px 140px', background: '#f8fafc', minHeight: '100%', overflowY: 'auto' }}>
      
      {/* 1. Profile & Account Info Card */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{ width: '58px', height: '58px', borderRadius: '50%', background: 'linear-gradient(135deg, #1677ff, #0958d9)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.4rem', boxShadow: '0 4px 12px rgba(22, 119, 255, 0.3)', flexShrink: 0 }}>
            💧
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {isEditingNick ? (
              <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                <input
                  type="text"
                  value={newNickInput}
                  onChange={e => setNewNickInput(e.target.value)}
                  placeholder="닉네임 입력"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '1.5px solid #1677ff',
                    fontSize: '0.85rem',
                    fontWeight: 800
                  }}
                />
                <button
                  onClick={handleSaveNickname}
                  style={{
                    padding: '8px 12px',
                    background: '#1677ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  확인
                </button>
                <button
                  onClick={() => setIsEditingNick(false)}
                  style={{
                    padding: '8px 10px',
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  취소
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {nickname}
                  </h3>
                  <button 
                    onClick={() => {
                      setNewNickInput(nickname);
                      setIsEditingNick(true);
                    }}
                    style={{ background: 'none', border: 'none', color: '#1677ff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px', flexShrink: 0 }}
                    title="닉네임 수정"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1677ff', padding: '3px 8px', borderRadius: '10px', fontWeight: 800, display: 'inline-block', marginTop: '3px' }}>
                  🏅 부산 하천 1등급 시민 지킴이
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Logged-in Account Info Box */}
        <div style={{
          background: '#f8fafc',
          padding: '14px 16px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
              <Mail size={14} color="#1677ff" /> 로그인 계정
            </span>
            <span style={{
              fontSize: '0.72rem',
              background: '#fee500',
              color: '#3c1e1e',
              padding: '3px 10px',
              borderRadius: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              💬 카카오 소셜 인증
            </span>
          </div>

          <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            {stats.email}
          </div>
        </div>
      </div>

      {/* 2. Cumulative Step Count & Walk Count Dashboard */}
      <div style={{ background: 'white', padding: '18px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Footprints size={18} color="#1677ff" /> 나의 하천 활동 통계
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '16px', borderRadius: '18px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700 }}>👣 누적 걸음 수</div>
            <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#1d4ed8', marginTop: '4px' }}>
              {stats.totalSteps.toLocaleString()}보
            </div>
            <div style={{ fontSize: '0.68rem', color: '#3b82f6', marginTop: '2px' }}>목표 20,000보 달성 중</div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '16px', borderRadius: '18px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>🚶‍♂️ 총 산책 횟수</div>
            <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#15803d', marginTop: '4px' }}>
              {stats.walkCount} 회
            </div>
            <div style={{ fontSize: '0.68rem', color: '#22c55e', marginTop: '2px' }}>수질 측정 {stats.measureCount}회 포함</div>
          </div>
        </div>
      </div>

      {/* 3. Consecutive Attendance Streak (연속 출석) */}
      <div style={{ background: 'white', padding: '18px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={20} color="#ef4444" /> 연속 출석 도장
          </h4>
          <span style={{ fontSize: '0.78rem', background: '#fef2f2', color: '#ef4444', padding: '3px 10px', borderRadius: '12px', fontWeight: 900 }}>
            🔥 {stats.attendanceStreak}일 연속 출석 중!
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '10px' }}>
          {attendanceDays.map((item, idx) => (
            <div 
              key={idx} 
              style={{
                background: item.done ? '#1677ff' : '#f1f5f9',
                color: item.done ? '#ffffff' : '#94a3b8',
                padding: '10px 2px',
                borderRadius: '14px',
                boxShadow: item.done ? '0 4px 10px rgba(22, 119, 255, 0.25)' : 'none'
              }}
            >
              <div style={{ fontSize: '0.68rem', fontWeight: 700 }}>{item.day}</div>
              <div style={{ fontSize: '0.9rem', margin: '4px 0' }}>{item.done ? '✓' : '•'}</div>
              <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '0.75rem', background: '#fff7ed', color: '#c2410c', padding: '8px 12px', borderRadius: '12px', border: '1px solid #ffedd5', textAlign: 'center', fontWeight: 700 }}>
          🎉 7일 연속 출석 보너스 동백전 +500원 적립 완료!
        </div>
      </div>

      {/* 4. My Photo Gallery (내 사진 모아보기 기능) */}
      <div style={{ background: 'white', padding: '18px', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Camera size={18} color="#1677ff" /> 내 사진 모아보기 ({myPhotos.length}장)
          </h4>
        </div>

        {/* Photo Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {myPhotos.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedPhoto(item)}
              style={{ background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'transform 0.15s' }}
            >
              <div style={{ position: 'relative', width: '100%', height: '110px' }}>
                <img src={item.photo} alt={item.tag} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '6px', left: '6px', fontSize: '0.62rem', background: 'rgba(0,0,0,0.75)', color: 'white', padding: '2px 6px', borderRadius: '8px', fontWeight: 700 }}>
                  {item.river}
                </span>
                <span style={{ position: 'absolute', bottom: '6px', right: '6px', fontSize: '0.62rem', background: '#1677ff', color: 'white', padding: '2px 6px', borderRadius: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Heart size={10} fill="white" /> {item.likes}
                </span>
              </div>

              <div style={{ padding: '8px 10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.tag}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px' }}>
                  {item.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Photo Modal */}
      {selectedPhoto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '350px', background: 'white', borderRadius: '24px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.78rem', background: '#eff6ff', color: '#1677ff', padding: '3px 8px', borderRadius: '10px', fontWeight: 800 }}>
                📍 [{selectedPhoto.river}] {selectedPhoto.location}
              </span>
              <button 
                onClick={() => setSelectedPhoto(null)}
                style={{ background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '50%', fontWeight: 800, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <img src={selectedPhoto.photo} alt={selectedPhoto.tag} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '12px' }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>{selectedPhoto.text}</p>
            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
              <span>업로드 날짜: {selectedPhoto.date}</span>
              <span style={{ color: '#ef4444', fontWeight: 800 }}>❤️ 좋아요 {selectedPhoto.likes}개</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
