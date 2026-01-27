# AGENTS.md (for OpenCode) — In-App Toss Release Project (Granite + React Native)

이 문서는 OpenCode(=opencode)가 이 레포지토리에서 작업할 때 따라야 하는 규칙/아키텍처/작업 방식(가드레일)을 정의합니다.  
목표는 **인앱토스 출시 품질(안정성/심사 대응)**을 최우선으로 하면서, **Granite + RN 조합**에 맞는 **얇은 Route 어댑터 + Screen/Feature 중심 아키텍처**를 유지하는 것입니다. **또한 구현 시 인앱토스 개발 사이트에 올라온 문서들을 기반으로 합니다**

---

## 0) 프로젝트 컨텍스트
- 스택: **Granite + React Native**
- 라우팅: Granite가 `pages/*`에서 `Route`를 import하여 스크린 레지스트리/타입을 자동 생성(`router.gen.ts` 등)하는 구조
- 출시: **인앱토스(심사/안정성/권한/외부 SDK 리스크 최소화)**가 중요
- 디자인 시스템: **TDS(Toss Design System) SDK / 컴포넌트 사용 우선** (가능한 범위에서)
  - 프로젝트에 존재하는 TDS 패키지/컴포넌트만 사용
  - 신규 UI 도입 시, 우선순위: **TDS 컴포넌트 > shared/ui 공용 컴포넌트 > 최소 구현**

> 주의: 이 파일은 “규칙 문서”이며, 생성 파일(`router.gen.ts`) 등 자동 생성 산출물을 수정하지 않습니다.

---

## 1) 핵심 아키텍처 원칙 (필수)

### 1.1 `pages/`는 "라우트 어댑터"만
Granite 자동 생성 파일이 `pages/*`에서 `Route`를 import하므로, `pages/*`는 아래 역할만 수행합니다.

- ✅ `Route` export 제공 (Granite 요구사항 충족)
- ✅ (필요 시) `default export Page()` 제공 (웹/호환 목적)
- ❌ UI 로직/상태/데이터 패칭/큰 컴포넌트 배치 금지

**허용 예시**
```tsx
// pages/about.tsx
import AboutScreen from '@/screens/about/AboutScreen';
export { Route } from '@/screens/about/route';

export default function Page() {
  return <AboutScreen />;
}
```

> 규칙: `pages/*`는 최대 10~20줄 내로 유지하세요.

---

### 1.2 Screen 구현은 `src/screens/**`가 소유
실제 화면(조립)은 `src/screens/**`에서 담당합니다.

- `src/screens/<name>/<Name>Screen.tsx` : 화면 UI/컴포지션
- `src/screens/<name>/route.tsx` : Granite용 `Route` 래퍼(입출력 타입/가드 포함 가능)

**예시**
```tsx
// src/screens/about/route.tsx
import AboutScreen from './AboutScreen';

export function Route() {
  return <AboutScreen />;
}
```

---

### 1.3 "라이트 FSD" 적용 (현실적 기준)
FSD 풀세트가 아니라, Granite/RN 현실에 맞춘 **라이트 FSD**를 적용합니다.

- `src/screens/` : 화면 조립(페이지 단위)
- `src/features/` : 사용자 행동 단위(필터/제보/로그인/즐겨찾기 등)
- `src/shared/` : 공용 기반(UI, util, api client, config, types, assets)
- `src/entities/` / `src/widgets/` : **필요할 때만** 추가(규모 커질 때)

**의존성 방향**
- screens → (widgets) → features → entities → shared
- shared는 어떤 레이어도 import하지 않음
- entities는 screens/widgets/features를 import하지 않음

---

## 2) 폴더 규칙 (필수)

### 2.1 자산(assets) 위치
- ✅ `src/shared/assets/**` 가 기본
- ✅ `public/`은 웹 메타(og, favicon) 같은 **웹 전용 정적**만
- ❌ 루트 `/assets` 금지(플랫폼별 빌드/번들 처리 분기 증가)

권장 구조
```
src/shared/assets/
  images/
  icons/
  lottie/
  fonts/
```

---

### 2.2 라우팅/네비게이션 의존성 제한
- `router.gen.ts` 같은 생성물은 수정하지 않음
- 라우트 상수/헬퍼가 필요하면 `src/app/navigation/**` 또는 `src/screens/**` 수준에 둠
- ❌ shared/entities에서 라우팅 의존성(import router.gen.ts 등) 금지

---

## 3) Granite 특수 규칙 (매우 중요)

### 3.1 `Route`는 반드시 `pages/*`에서 export 가능해야 함
Granite가 다음 형태로 import하여 타입 레지스트리를 구성합니다.

```ts
import { Route as _AboutRoute } from '../pages/about';
```

따라서:
- `pages/about.tsx`는 반드시 `export const Route` 또는 `export { Route }`가 가능해야 함
- `Route` 구현은 `src/screens/**/route.tsx`에서 하고 `pages`는 재-export하는 패턴을 선호

---

### 3.2 `Route`와 UI는 분리한다
- `src/screens/**/route.tsx` : Route 계약/가드/입출력 타입에 집중
- `src/screens/**/<Name>Screen.tsx` : 화면 구현에 집중

`Route`를 Screen 파일에 섞어두는 패턴은 지양합니다(규모 커질수록 유지보수 비용 상승).

---

## 4) 인앱토스 출시 기준 가드레일

### 4.1 외부 SDK/네이티브 모듈 도입은 보수적으로
- 새로운 네이티브 모듈 추가 전, 심사/권한/안정성 영향 평가
- 지도 등은 원칙적으로 **Web SDK + WebView** 같은 안전한 경로 우선
- 네이티브 지도 SDK는 Bare RN, 커스텀 빌드, 심사 리스크를 동반할 수 있음

### 4.2 권한/추적/위치 관련
- 위치 권한: RN에서 권한 획득 → 필요한 최소 정보만 화면/웹뷰로 전달
- 민감 로그/추적: 기본적으로 최소화, 필요 시 익명화/샘플링 고려

---

## 5) 스타일링 규칙 (중요)

### 5.1 Tailwind 사용 금지
- 이 프로젝트에서는 Tailwind(유사 유틸리티 포함) 사용이 불가능하므로 **절대 사용하지 않습니다.**

### 5.2 인라인 스타일(객체)만 사용
- RN: `style={{ ... }}` 형태의 **인라인 객체 스타일**만 허용  
  - 예: `<View style={{ padding: 16, gap: 8 }} />`
- Web: (Granite가 RN Web을 쓰는 경우) 동일하게 인라인 객체 스타일을 우선
- `StyleSheet.create()`는 팀 합의가 없다면 지양(현재 규칙: **인라인 우선**)

### 5.3 디자인 시스템 우선 적용 (TDS)
- 가능한 경우 **TDS SDK 컴포넌트**를 먼저 사용합니다.
- TDS 컴포넌트가 없는 케이스만 `src/shared/ui`에 공용 컴포넌트 추가로 해결합니다.
- 임의의 색상/폰트/간격을 즉흥적으로 늘리지 말고, 가능한 한 TDS 토큰/규칙을 따릅니다.

### 5.4 스타일 작성 기본 가이드
- 레이아웃: `padding`, `margin`, `gap`, `flex`, `alignItems`, `justifyContent` 우선
- 텍스트: 폰트/색상/줄간격은 TDS 기준 우선
- 접근성: 터치 영역 최소 크기(가능하면 44px 이상), 대비 유지

---

## 6) 작업 방식 (OpenCode 실행 규칙)

### 6.1 변경 단위
- 1 PR(또는 1 작업) = 1 목적
  - 예: “pages → screens 분리”, “assets 경로 통일”, “route export 패턴 통일”
- 대규모 이동은 2~3단계로 쪼갠다(리뷰/리스크 감소)

### 6.2 변경 시 반드시 지켜야 할 것
- `pages/*`는 얇게 유지(엔트리/재-export만)
- import 경로는 alias(`@/`)로 통일(가능하면)
- 순환 의존성 금지 (특히 features ↔ screens)
- 생성 파일(`router.gen.ts` 등) 직접 수정 금지

### 6.3 코드 작성 스타일
- 타입 안정성 우선(특히 Route input/output, API 응답 타입)
- 플랫폼 분기(웹/앱)는 화면 진입점 1곳에서 처리
  - 예: `MapScreen`에서 `Platform.OS`로 Web vs WebView 분기

---

## 7) 리팩토링 체크리스트 (OpenCode가 스스로 점검)

### 라우팅/아키텍처
- [ ] `pages/*`가 화면 구현을 들고 있지 않은가?
- [ ] `Route`가 `src/screens/**/route.tsx`로 분리되어 있는가?
- [ ] `pages`가 `pages`를 import/re-export 하고 있지 않은가? (금지)
- [ ] `router.gen.ts`를 shared/entities에서 import하지 않는가?

### 자산/경로
- [ ] 자산이 `src/shared/assets`에 모여 있는가?
- [ ] `public/`은 웹 메타 용도로만 쓰는가?

### 플랫폼 분기
- [ ] RN/Web 분기는 Screen 진입점 1곳에서만 하는가?
- [ ] WebView 통신이 필요하면 postMessage/injectScript를 명확히 분리했는가?

### 스타일링
- [ ] Tailwind/유틸리티 클래스가 섞여 있지 않은가?
- [ ] 스타일이 인라인 객체로 작성되었는가?
- [ ] 가능한 경우 TDS SDK 컴포넌트를 사용했는가?

---

## 8) OpenCode에게 자주 시킬 작업 템플릿

### (A) 라우트 어댑터 정리
- pages 폴더를 훑고, UI/비즈니스 로직이 들어간 파일을 찾아 screens로 이동
- Route export 패턴을 `export { Route } from '@/screens/<name>/route'`로 통일

### (B) assets 정리
- 흩어진 images/icons/fonts를 `src/shared/assets`로 이동
- import 경로 자동 수정

### (C) 의존성 방향 검증
- shared/entities에서 screens/features import가 있는지 탐지하여 제거

### (D) 스타일링 규칙 준수
- Tailwind 흔적 제거
- 인라인 객체 스타일로 변환
- TDS 컴포넌트로 대체 가능한 UI를 탐지하여 제안

---

## 9) 금지 사항 (절대 금지)
- 생성 파일 직접 수정 (`router.gen.ts` 등)
- pages가 pages를 import/re-export하는 구조
- shared/entities 레이어가 라우팅/스크린에 의존하는 구조
- 플랫폼별로 동일 기능을 중복 구현(지도/검색/필터 등) — 가능한 한 공용화 우선
- Tailwind/유틸리티 클래스 기반 스타일링 도입

---

## 10) 문의/결정 기준
애매하면 다음 기준으로 결정합니다:
1) 인앱토스 출시 리스크 최소화
2) Granite 생성 구조와의 충돌 최소화
3) screens/features/shared 중심의 단순한 의존성 방향 유지
4) “코드 재사용”보다 “안정성/예측 가능성” 우선

끝.
