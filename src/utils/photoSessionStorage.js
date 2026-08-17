// 투데이스킨 기록 폼 ↔ 카메라를 오가는 동안, 지금까지 찍은 사진 목록(capturedPhotos)을
// sessionStorage에 진짜 기준(source of truth)으로 저장해두는 헬퍼.
//
// 왜 필요하냐면: 예전엔 이 목록을 navigate()의 state로만 주고받았는데, 그러면
// 브라우저 히스토리에 "그 순간의" 목록이 그대로 박제됨. 그 이후에 사진을 삭제해도
// state가 안 바뀌니까, 브라우저 뒤로가기를 하면 삭제 전 목록이 되살아나는 문제가 있었음.
// sessionStorage는 변경할 때마다 계속 최신값으로 덮어써서, "언제 돌아오든 항상 최신"이 보장됨.

const STORAGE_KEY = "todaySkinCapturedPhotos";

export function loadCapturedPhotos() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCapturedPhotos(photos) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

// 분석 제출 등으로 이번 기록 세션이 끝났을 때, 다음 번엔 빈 상태로 새로 시작하도록 정리
export function clearCapturedPhotos() {
  sessionStorage.removeItem(STORAGE_KEY);
}