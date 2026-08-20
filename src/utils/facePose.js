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

const YAW_THRESHOLD_DEGREES = 15;

const LEFT_YAW_SIGN = -1; // TODO: 실기기 테스트 후 1 또는 -1로 확정

export function isFrontalYaw(yawDegrees) {
  return Math.abs(yawDegrees) <= YAW_THRESHOLD_DEGREES;
}

export function isLeftYaw(yawDegrees) {
  return LEFT_YAW_SIGN * yawDegrees > YAW_THRESHOLD_DEGREES;
}

export function isRightYaw(yawDegrees) {
  return LEFT_YAW_SIGN * yawDegrees < -YAW_THRESHOLD_DEGREES;
}

// requestedAngle("front" | "left" | "right")에 맞는 yaw인지 한 곳에서 판단
export function matchesRequestedAngle(requestedAngle, yawDegrees) {
  if (requestedAngle === "front") return isFrontalYaw(yawDegrees);
  if (requestedAngle === "left") return isLeftYaw(yawDegrees);
  if (requestedAngle === "right") return isRightYaw(yawDegrees);
  return false;
}
