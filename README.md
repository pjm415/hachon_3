# 💧 리버로그 (RiverLog)
> **시민참여 부산 주요 하천 수질 측정 & 동백전 리워드 플랫폼**  
> 🌐 **라이브 웹 앱**: [https://hacheon.vercel.app](https://hacheon.vercel.app)  
> 💻 **GitHub 저장소**: [https://github.com/pjm415/hachon_3](https://github.com/pjm415/hachon_3)  
> 👥 **사용자 계정**: `team3@hacheon.busan.kr` (카카오 소셜 인증)

---

## 📌 프로젝트 소개 및 발표 요약 (Presentation Overview)

**리버로그(RiverLog)**는 부산의 대표 하천인 **온천천, 동천, 괴정천**을 시민들이 직접 산책하며 수질을 측정하고, 오염 현장 제보 및 줍깅(플로깅) 활동에 참여하여 **부산 지역화폐 동백전 리워드**를 적립받는 **시민참여형 친환경 스마트 하천 관리 웹 앱**입니다.

---

## 🌟 주요 핵심 기능 (Key Features)

### 1. 🗺️ 카카오 지도 기반 실시간 하천 핀 & 사진 피드
- **정밀 GPS 관측소 매핑**:
  - 🟢 **온천천 (세병교 지점)** - BOD 1.8ppm (1급수)
  - 🟡 **동천 (범일교 지점)** - BOD 3.5ppm (3급수)
  - 🔴 **괴정천 (하굿둑 지점)** - BOD 4.2ppm (3급수, 사하구 강변대로 수로 `35.1050, 128.9604`)
- **시민 사진 핀 (CustomOverlay)**: 시민들이 현장에서 직접 촬영한 수질·생물·오염 제보 사진이 카카오 지도 상에 커스텀 핀으로 표출됩니다.

### 2. 🧪 실시간 공공데이터 연동 & 시민 수질 Kit 측정
- 공공데이터포털(data.go.kr) 및 국립환경과학원 수질 API 실시간 데이터 수신 (BOD, DO, pH, TDS, 수온).
- **시민 측정 Kit 검증**: 현장에서 수질 측정 키트 결과 입력 및 오차 검증 시 **동백전 +1,000원 즉시 적립**.

### 3. 📸 실시간 HTML5 GPS & WebRTC 카메라 현장 촬영
- **자동 GPS 수신**: 게시글 등록 시 사용자 스마트폰의 실시간 위도/경도/주소를 수신합니다.
- **WebRTC 실시간 카메라**: 스마트폰 카메라로 하천 현장을 촬영하고 악취 정도(🤢 심함 ~ 🌿 안 남)를 함께 기록하여 지도에 사진 핀으로 업로드 (**동백전 +10원 즉시 적립**).

### 4. 👣 물리적 모션 센서 걷기 만보기 (Physical Pedometer)
- `DeviceMotionEvent` 가속도 센서 임계값(`> 12.8 m/s²`) 기반의 **순수 물리 이동 동작 감지 만보기**.
- 산책 완료 시 **10보당 1원 동백전 실시간 적립**.

### 5. 🎁 부산 동백전 페이 혜택 지갑 (Benefits & Pay Wallet)
- 혜택 지갑 탭에서 적립된 동백전 잔액 확인, 가맹점 조회, 환전 신청 및 출석 체크 보너스 제공.

### 6. 🌱 하천 살리기 줍깅(플로깅) 청년위원회 모집 배너
- 앱 첫 접속 시 지도 상단에 줍깅(플로깅) 모집 팝업 배너 표출.
- 클릭 시 [부산청년위원회 줍깅 지원 페이지](https://heureun-youth-committee.vercel.app/#apply)로 자동 연결.

### 7. 📱 안드로이드 PWA (WebAPK) 바탕화면 앱 연동
- `manifest.json` 및 `sw.js` 탑재로 안드로이드 크롬/삼성 인터넷에서 **클릭 한 번으로 스마트폰 바탕화면에 앱 아이콘 생성** 및 실행 지원.

---

## 🛠️ 기술 스택 (Technology Stack)

| 구분 | 사용 기술 |
| :--- | :--- |
| **Frontend** | React 18, Vite, JavaScript (ES6+), HTML5, Vanilla CSS |
| **Map & Location** | Kakao Maps SDK, HTML5 Geolocation API |
| **Hardware & Sensor** | WebRTC MediaDevices API (Camera), DeviceMotionEvent (Pedometer) |
| **Data & PWA** | 공공데이터포털 Open API, PWA (Manifest.json, Service Worker) |
| **Deployment** | Vercel (`https://hacheon.vercel.app`), GitHub (`master`/`main`/`develop`) |

---

## 📂 프로젝트 구조 (Directory Structure)

```
hacheon/
├── index.html                   # 프로덕션 번들 싱글파일
├── README.md                    # 발표자료 및 프로젝트 문서
├── 1_시민참여_수질측정_초안/      # 메인 소스 코드 디렉토리
│   ├── public/
│   │   ├── manifest.json        # PWA 설치 메니페스트
│   │   ├── sw.js                # PWA 캐싱 서비스 워커
│   │   └── favicon.svg
│   └── src/
│       ├── App.jsx              # 메인 애플리케이션 & 탭 컨트롤러
│       ├── api/
│       │   └── waterQualityApi.js # 수질 공공 API & 하천 데이터 모듈
│       ├── components/
│       │   ├── HomeTab.jsx      # 지도 & 줍깅 모집 배너
│       │   ├── MeasureTab.jsx   # 수질 Kit 측정
│       │   ├── BenefitsTab.jsx  # 동백전 혜택 지갑
│       │   └── MyPageTab.jsx    # 프로필 & 출석체크
│       └── index.css            # 반응형 앱 스타일시트
└── develop/                     # 개발 브랜치 동기화 디렉토리
```

---

## 🚀 배포 및 운용 정보

- **Vercel Production Deploy**: `https://hacheon.vercel.app`
- **GitHub Target Repository**: `https://github.com/pjm415/hachon_3`
- **배포 브랜치**: `master` (프로덕션 릴리즈), `main`, `develop`
