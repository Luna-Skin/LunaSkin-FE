let isInternalBackNavigation = false;

// 앱 안의 뒤로가기 버튼을 눌렀다는 표시
export function markInternalBackNavigation() {
  isInternalBackNavigation = true;
}

// 이번 뒤로가기가 앱 내부 버튼에 의한 것인지 확인
export function consumeInternalBackNavigation() {
  if (!isInternalBackNavigation) {
    return false;
  }

  isInternalBackNavigation = false;
  return true;
}