// 결과값의 +/- 부호가 실제로 왼쪽/오른쪽 중 어느 쪽을 가리키는지는 기기·카메라
// 방향에 따라 달라질 수 있어서, 실제 촬영 테스트하면서 확인 필요
export function getYawAngleDegrees(matrix) {
  // 4x4 행렬 중 회전을 담당하는 3x3 부분만 사용 (0,1,2행의 앞 3개 값)
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

// TODO: 실제 테스트하면서 조정 필요 (front로 인정할 각도 범위)
const YAW_THRESHOLD_DEGREES = 15;

// yaw 각도를 받아서 "front" | "left" | "right" 중 하나로 분류.
// +/- 중 어느 쪽이 실제 왼쪽/오른쪽인지는 TODO: 실측 후 확인 필요
export function classifyFaceAngle(yawDegrees) {
  if (Math.abs(yawDegrees) <= YAW_THRESHOLD_DEGREES) return "front";
  return yawDegrees > 0 ? "right" : "left";
}