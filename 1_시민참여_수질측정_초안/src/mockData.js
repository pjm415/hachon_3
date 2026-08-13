export const initialWaterPins = [
  {
    id: 1,
    locationName: "임하천 상류 A구역 (신선교)",
    status: "good",
    statusText: "1급수 (좋음)",
    bod: "1.2 ppm",
    ph: "7.2",
    turbidity: "맑음 (0.8 NTU)",
    measuredBy: "시민 김*민",
    measuredAt: "10분 전",
    verifiedByBlockchain: true,
    kitType: "1회용 시약 키트",
    hash: "0x8f2a...9b31",
    lat: 30,
    lng: 40,
    comment: "수질 매우 깨끗함. 버들치 서식 확인됨."
  },
  {
    id: 2,
    locationName: "임하천 중류 B구역 (이태엽 공장 하류)",
    status: "warning",
    statusText: "2급수 (보통)",
    bod: "3.8 ppm",
    ph: "6.8",
    turbidity: "약간 탁함 (3.2 NTU)",
    measuredBy: "자연수활동회 이*수",
    measuredAt: "35분 전",
    verifiedByBlockchain: true,
    kitType: "카페 대여 다회용 센서",
    hash: "0x3c11...4e8f",
    lat: 55,
    lng: 60,
    comment: "거품 약간 관찰됨. 2차 교차 검증 필요."
  },
  {
    id: 3,
    locationName: "임하천 하류 C구역 (낙동강 합류부)",
    status: "danger",
    statusText: "3급수 (주의)",
    bod: "6.4 ppm",
    ph: "6.2",
    turbidity: "탁함 (8.5 NTU)",
    measuredBy: "시민 박*준",
    measuredAt: "1시간 전",
    verifiedByBlockchain: true,
    kitType: "1회용 시약 키트",
    hash: "0x7d90...1a22",
    lat: 75,
    lng: 80,
    comment: "농업 용수 유입 정황. 수질 개선 필요."
  }
];

export const ploggingEvent = {
  title: "이태엽과 함께하는 8월 임하천 줍깅 챌린지",
  host: "(주)태엽산업 & 임하천 환경 보전 협의회",
  date: "2026년 8월 22일 (토) 오전 10시",
  location: "임하천 생태공원 중앙광장",
  participantsCount: 384,
  maxParticipants: 500,
  rewards: "동백전 3,000원 + 수질 키트 2개 + 줍깅 키트 증정",
  description: "이태엽 대표와 부산 시민이 함께 만들어가는 깨끗한 임하천! 플로깅으로 쓰레기도 줍고 수질도 직접 측정하는 정기 환경 행사입니다.",
  badges: ["8월 수호자", "플로깅 마스터", "수질 감시단"]
};

export const localMerchants = [
  {
    id: 1,
    name: "임하천길 감성카페",
    category: "우리동네 하천살리기 지정업소",
    distance: "120m",
    availableDevices: 4,
    totalDevices: 5,
    address: "부산광역시 해운대구 임하천길 42",
    benefit: "기기 반납 시 음료 1,000원 즉시 할인",
    image: "☕"
  },
  {
    id: 2,
    name: "푸른하천 베이커리",
    category: "우리동네 하천살리기 지정업소",
    distance: "350m",
    availableDevices: 2,
    totalDevices: 3,
    address: "부산광역시 해운대구 임하천길 88",
    benefit: "기기 반납 시 수제 쿠키 무료 증정",
    image: "🥐"
  },
  {
    id: 3,
    name: "해운대 오션 브런치",
    category: "우리동네 하천살리기 지정업소",
    distance: "600m",
    availableDevices: 5,
    totalDevices: 5,
    address: "부산광역시 해운대구 임하천로 15",
    benefit: "기기 반납 시 세트 메뉴 10% 할인",
    image: "🥪"
  }
];

export const walletHistory = [
  {
    id: 101,
    title: "임하천 수질 측정 캐시백",
    date: "2026.08.13 16:40",
    amount: 1000,
    type: "earn",
    detail: "AI 검증 완료 (블록체인 0x8f2a...)"
  },
  {
    id: 102,
    title: "지정카페 기기 반납 할인쿠폰",
    date: "2026.08.11 14:20",
    amount: 1000,
    type: "coupon",
    detail: "임하천길 감성카페 사용 가능"
  },
  {
    id: 103,
    title: "7월 줍깅 챌린지 완주 리워드",
    date: "2026.07.25 12:00",
    amount: 3000,
    type: "earn",
    detail: "이태엽과 함께하는 줍깅 이벤트"
  }
];
