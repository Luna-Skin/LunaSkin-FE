export function getYawAngleDegrees(matrix) {
  const r00 = matrix[0];
  const r10 = matrix[4];
  const r20 = matrix[8];
  const r21 = matrix[9];
  const r22 = matrix[10];

  let thetaY;
  if (r10 < 1) {
    if (r10 > -1) {
      thetaY = Math.atan2(-r20, r00);
    } else {
      thetaY = -Math.atan2(r21, r22);
    }
  } else {
    thetaY = Math.atan2(r21, r22);
  }

  if (Number.isNaN(thetaY)) thetaY = 0;

  const yawRadians = -thetaY;
  return (yawRadians * 180) / Math.PI;
}

// TODO: 실제 테스트하면서 조정 필요 (정면으로 인정할 각도 범위)
const YAW_THRESHOLD_DEGREES = 15;

// yaw 각도가 "정면"으로 인정할 범위 안에 있는지만 판단.
// 왼쪽/오른쪽 방향(부호)은 구분하지 않음 — 어느 쪽 측면 사진인지는 촬영 당시
// 화면에 어떤 가이드 프레임이 떠 있었는지로 정해지기 때문에, "충분히 돌아갔는가/안 돌아갔는가"만 판단
export function isFrontalYaw(yawDegrees) {
  return Math.abs(yawDegrees) <= YAW_THRESHOLD_DEGREES;
}